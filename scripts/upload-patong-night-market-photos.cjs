const https = require('https');
const fs = require('fs');
const path = require('path');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const SHOPIFY_API_VERSION = '2025-07';

function makeGraphQLRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query, variables });
    
    const options = {
      hostname: SHOPIFY_STORE,
      port: 443,
      path: `/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.errors) {
            reject(new Error(`GraphQL Errors: ${JSON.stringify(jsonData.errors)}`));
          } else {
            resolve(jsonData);
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function getProductIdByHandle(handle) {
  const query = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
      }
    }
  `;
  const result = await makeGraphQLRequest(query, { handle });
  return result.data?.productByHandle;
}

// Функция для создания SVG placeholder
function createPlaceholderSVG(text, index) {
  const colors = [
    { bg: '#FF6B6B', text: '#FFFFFF' },
    { bg: '#4ECDC4', text: '#FFFFFF' },
    { bg: '#45B7D1', text: '#FFFFFF' }
  ];
  const color = colors[index % colors.length];
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
  <rect width="800" height="600" fill="${color.bg}"/>
  <text x="400" y="280" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="${color.text}" text-anchor="middle">
    ${text}
  </text>
  <text x="400" y="340" font-family="Arial, sans-serif" font-size="24" fill="${color.text}" text-anchor="middle" opacity="0.8">
    Фото ${index + 1}
  </text>
</svg>`;
}

async function uploadPhotoViaREST(productId, base64Image, filename, altText) {
  return new Promise((resolve, reject) => {
    const productGid = productId.split('/').pop();
    const postData = JSON.stringify({
      image: {
        attachment: base64Image,
        filename: filename,
        alt: altText
      }
    });

    const options = {
      hostname: SHOPIFY_STORE,
      port: 443,
      path: `/admin/api/${SHOPIFY_API_VERSION}/products/${productGid}/images.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(jsonData)}`));
          } else {
            resolve(jsonData);
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('📸 ЗАГРУЗКА ФОТОГРАФИЙ ДЛЯ PATONG NIGHT MARKET');
  console.log('='.repeat(50));

  try {
    // 1. Получить ID продукта
    const product = await getProductIdByHandle('patong-night-market');
    if (!product) {
      console.error('❌ Продукт не найден: patong-night-market');
      return;
    }

    console.log(`✅ Найден продукт: ${product.title}`);
    console.log(`🆔 ID: ${product.id}`);

    // 2. Создать и загрузить 3 placeholder изображения
    const photos = [
      { text: 'Patong Night Market', alt: 'Patong Night Market - Entrance and main street' },
      { text: 'Patong Night Market', alt: 'Patong Night Market - Street food and vendors' },
      { text: 'Patong Night Market', alt: 'Patong Night Market - Shopping and souvenirs' }
    ];

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      console.log(`\n📸 [${i + 1}/3] Загрузка фотографии...`);

      // Создать SVG
      const svg = createPlaceholderSVG(photo.text, i);
      const base64 = Buffer.from(svg).toString('base64');
      const filename = `patong-night-market-${i + 1}.svg`;

      // Загрузить через REST API
      console.log(`   Файл: ${filename}`);
      console.log(`   Alt: ${photo.alt}`);
      
      const result = await uploadPhotoViaREST(
        product.id,
        base64,
        filename,
        photo.alt
      );

      console.log(`   ✅ Загружено! ID: ${result.image?.id}`);

      // Пауза между загрузками
      if (i < photos.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 ВСЕ ФОТОГРАФИИ ЗАГРУЖЕНЫ!');
    console.log('🔗 Проверьте: http://localhost:8080/place/patong-night-market');

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

main().catch(console.error);
