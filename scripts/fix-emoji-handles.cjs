#!/usr/bin/env node

/**
 * СКРИПТ: Исправление handle с эмодзи
 * 
 * Этот скрипт:
 * 1. Создает новые продукты с правильными handle (без эмодзи)
 * 2. Копирует все данные из старых продуктов
 * 3. Удаляет старые продукты с эмодзи в handle
 */

// Using built-in fetch (Node.js 18+)

// Shopify credentials
const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const ADMIN_TOKEN = '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';

const ADMIN_URL = `https://${SHOPIFY_STORE}/admin/api/2025-07/graphql.json`;

// GraphQL query to get products with emoji handles
const GET_EMOJI_PRODUCTS_QUERY = `
  query GetEmojiProducts {
    products(first: 50) {
      edges {
        node {
          id
          title
          handle
          description
          productType
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

// GraphQL mutation to create new product
const CREATE_PRODUCT_MUTATION = `
  mutation CreateProduct($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
        title
        handle
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// GraphQL mutation to delete product
const DELETE_PRODUCT_MUTATION = `
  mutation DeleteProduct($input: ProductDeleteInput!) {
    productDelete(input: $input) {
      deletedProductId
      userErrors {
        field
        message
      }
    }
  }
`;

// Function to make GraphQL request
async function makeGraphQLRequest(query, variables = {}) {
  try {
    const response = await fetch(ADMIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const data = await response.json();
    
    if (data.errors) {
      console.error('GraphQL Errors:', data.errors);
      return null;
    }

    return data.data;
  } catch (error) {
    console.error('Request failed:', error);
    return null;
  }
}

// Function to create clean handle from title
function createCleanHandle(title) {
  return title
    .toLowerCase()
    .replace(/[🏝️🎬🌊⛵🤿🏖️🌅]/g, '') // Remove emojis
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Function to create clean title (remove emojis from title)
function createCleanTitle(title) {
  return title
    .replace(/[🏝️🎬🌊⛵🤿🏖️🌅]/g, '') // Remove emojis
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

// Main function
async function fixEmojiHandles() {
  console.log('🚀 Начинаем исправление handle с эмодзи...\n');

  try {
    // 1. Get all products
    console.log('📋 Получаем список всех продуктов...');
    const productsData = await makeGraphQLRequest(GET_EMOJI_PRODUCTS_QUERY);
    
    if (!productsData) {
      console.error('❌ Не удалось получить список продуктов');
      return;
    }

    const products = productsData.products.edges.map(edge => edge.node);
    const emojiProducts = products.filter(p => /[🏝️🎬🌊⛵🤿🏖️🌅]/.test(p.handle));
    
    console.log(`✅ Найдено ${emojiProducts.length} продуктов с эмодзи в handle\n`);

    // 2. Process each emoji product
    for (let i = 0; i < emojiProducts.length; i++) {
      const product = emojiProducts[i];
      console.log(`🔄 [${i + 1}/${emojiProducts.length}] Обрабатываем: ${product.title}`);

      try {
        // Create clean handle and title
        const cleanHandle = createCleanHandle(product.title);
        const cleanTitle = createCleanTitle(product.title);
        
        console.log(`   Старый handle: ${product.handle}`);
        console.log(`   Новый handle: ${cleanHandle}`);
        console.log(`   Новый title: ${cleanTitle}`);

        // Check if clean handle already exists
        const existingProduct = products.find(p => p.handle === cleanHandle);
        if (existingProduct) {
          console.log(`   ⚠️ Продукт с handle "${cleanHandle}" уже существует, пропускаем`);
          continue;
        }

        // Create new product
        const newProductInput = {
          title: cleanTitle,
          handle: cleanHandle,
          productType: product.productType,
          tags: product.tags,
          description: product.description,
          variants: product.variants.edges.map(edge => ({
            title: edge.node.title,
            price: edge.node.price,
            availableForSale: edge.node.availableForSale,
            selectedOptions: edge.node.selectedOptions
          })),
          options: product.options
        };

        const createResult = await makeGraphQLRequest(CREATE_PRODUCT_MUTATION, {
          input: newProductInput
        });

        if (createResult?.productCreate?.userErrors?.length > 0) {
          console.error(`❌ Ошибки при создании ${cleanTitle}:`, createResult.productCreate.userErrors);
          continue;
        }

        console.log(`✅ Создан новый продукт: ${cleanTitle}`);

        // Delete old product
        const deleteResult = await makeGraphQLRequest(DELETE_PRODUCT_MUTATION, {
          input: {
            id: product.id
          }
        });

        if (deleteResult?.productDelete?.userErrors?.length > 0) {
          console.error(`❌ Ошибки при удалении ${product.title}:`, deleteResult.productDelete.userErrors);
        } else {
          console.log(`✅ Удален старый продукт: ${product.title}`);
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`❌ Ошибка при обработке ${product.title}:`, error.message);
      }
    }

    console.log('\n🎉 Все handle с эмодзи исправлены!');
    console.log('\n📱 Проверьте результат на сайте: http://localhost:8080/tours');

  } catch (error) {
    console.error('❌ Критическая ошибка:', error);
  }
}

// Run the script
if (require.main === module) {
  fixEmojiHandles();
}

module.exports = { fixEmojiHandles };
