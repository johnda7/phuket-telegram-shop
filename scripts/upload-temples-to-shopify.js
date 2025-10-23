import { temples } from '../src/data/shopify-temples.ts';

const SHOPIFY_STORE = process.env.SHOPIFY_STORE || 'phuket-insider-admin.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

if (!SHOPIFY_ACCESS_TOKEN) {
  console.error('❌ SHOPIFY_ACCESS_TOKEN не установлен');
  process.exit(1);
}

const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_ADMIN_URL = `https://${SHOPIFY_STORE}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;

async function uploadTempleToShopify(temple) {
  const productInput = {
    title: temple.title,
    descriptionHtml: temple.description,
    productType: temple.productType,
    vendor: temple.vendor,
    tags: temple.tags,
    status: 'ACTIVE'
  };

  const mutation = `
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

  try {
    const response = await fetch(SHOPIFY_ADMIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN
      },
      body: JSON.stringify({
        query: mutation,
        variables: { input: productInput }
      })
    });

    const result = await response.json();
    
    if (result.data?.productCreate?.userErrors?.length > 0) {
      console.error(`❌ Ошибка создания ${temple.title}:`, result.data.productCreate.userErrors);
      return null;
    }

    const product = result.data?.productCreate?.product;
    console.log(`✅ Создан храм: ${product.title} (${product.handle})`);
    
    // Добавляем метафилды
    if (temple.metafields && product.id) {
      await addMetafields(product.id, temple.metafields);
    }

    return product;
  } catch (error) {
    console.error(`❌ Ошибка при создании ${temple.title}:`, error);
    return null;
  }
}

async function addMetafields(productId, metafields) {
  for (const metafield of metafields) {
    const mutation = `
      mutation CreateMetafield($input: MetafieldInput!) {
        metafieldCreate(input: $input) {
          metafield {
            id
            key
            value
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const input = {
      namespace: metafield.namespace,
      key: metafield.key,
      value: JSON.stringify(metafield.value),
      type: metafield.type,
      ownerId: productId
    };

    try {
      const response = await fetch(SHOPIFY_ADMIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN
        },
        body: JSON.stringify({
          query: mutation,
          variables: { input }
        })
      });

      const result = await response.json();
      
      if (result.data?.metafieldCreate?.userErrors?.length > 0) {
        console.error(`  ⚠️ Метафилд ${metafield.key}:`, result.data.metafieldCreate.userErrors);
      } else {
        console.log(`  ✅ Метафилд ${metafield.key} добавлен`);
      }
    } catch (error) {
      console.error(`  ❌ Ошибка метафилда ${metafield.key}:`, error);
    }
  }
}

async function main() {
  console.log('🛕 Загрузка храмов в Shopify...\n');
  
  for (const temple of temples) {
    await uploadTempleToShopify(temple);
    // Задержка между запросами
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n✅ Все храмы загружены!');
}

main().catch(console.error);
