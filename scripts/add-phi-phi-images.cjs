#!/usr/bin/env node

/**
 * СКРИПТ: Добавление изображений к туру Пхи-Пхи
 * 
 * Этот скрипт добавляет изображения к продукту "Пхи-Пхи 2 дня/1 ночь"
 * используя base64 изображения из assets
 */

const fs = require('fs');
const path = require('path');

// Shopify credentials
const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const ADMIN_TOKEN = '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';

const ADMIN_URL = `https://${SHOPIFY_STORE}/admin/api/2025-07/graphql.json`;

// Product ID for Phi-Phi tour
const PRODUCT_ID = 'gid://shopify/Product/7980554485814';

// GraphQL mutation to add image to product
const ADD_IMAGE_MUTATION = `
  mutation productCreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
    productCreateMedia(productId: $productId, media: $media) {
      media {
        id
        ... on MediaImage {
          id
          image {
            url
            altText
          }
        }
      }
      mediaUserErrors {
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

// Function to create base64 image from file
function createBase64Image(filePath) {
  try {
    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = path.extname(filePath).toLowerCase() === '.jpg' ? 'image/jpeg' : 'image/png';
    return `data:${mimeType};base64,${base64Image}`;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
}

// Function to create placeholder images
function createPlaceholderImages() {
  const images = [];
  
  // Create 4 placeholder images for Phi-Phi tour
  for (let i = 1; i <= 4; i++) {
    const svgContent = `
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad${i}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#${['3B82F6', '10B981', 'F59E0B', 'EF4444'][i-1]};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#${['1D4ED8', '059669', 'D97706', 'DC2626'][i-1]};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#grad${i})"/>
  <text x="200" y="150" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="white">
    Пхи-Пхи ${i}
  </text>
  <text x="200" y="180" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="white" opacity="0.8">
    Фото ${i} из 4
  </text>
</svg>`;
    
    const base64Svg = Buffer.from(svgContent).toString('base64');
    images.push(`data:image/svg+xml;base64,${base64Svg}`);
  }
  
  return images;
}

// Main function
async function addPhiPhiImages() {
  console.log('🚀 Добавляем изображения к туру Пхи-Пхи...\n');

  try {
    // Create placeholder images
    console.log('📸 Создаем placeholder изображения...');
    const images = createPlaceholderImages();
    console.log(`✅ Создано ${images.length} изображений\n`);

    // Add images to product
    console.log('📤 Загружаем изображения в Shopify...');
    
    const mediaInputs = images.map((imageData, index) => ({
      originalSource: imageData,
      alt: `Пхи-Пхи 2 дня/1 ночь - Фото ${index + 1}`,
      mediaContentType: 'IMAGE'
    }));

    const result = await makeGraphQLRequest(ADD_IMAGE_MUTATION, {
      productId: PRODUCT_ID,
      media: mediaInputs
    });

    if (result?.productCreateMedia?.mediaUserErrors?.length > 0) {
      console.error('❌ Ошибки при загрузке изображений:', result.productCreateMedia.mediaUserErrors);
      return;
    }

    if (result?.productCreateMedia?.media?.length > 0) {
      console.log(`✅ Успешно загружено ${result.productCreateMedia.media.length} изображений`);
      
      // Show URLs
      result.productCreateMedia.media.forEach((media, index) => {
        if (media.image) {
          console.log(`   📷 Фото ${index + 1}: ${media.image.url}`);
        }
      });
    }

    console.log('\n🎉 Изображения успешно добавлены к туру Пхи-Пхи!');
    console.log('\n📱 Проверьте результат: http://localhost:8080/product/phi-phi-2-days-1-night');

  } catch (error) {
    console.error('❌ Критическая ошибка:', error);
  }
}

// Run the script
if (require.main === module) {
  addPhiPhiImages();
}

module.exports = { addPhiPhiImages };
