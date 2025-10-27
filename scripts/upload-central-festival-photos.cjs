// Загружаем фото Central Festival в Shopify
const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const SHOPIFY_API_VERSION = '2025-07';

// Твои 3 фото Central Festival
const centralFestivalPhotos = [
  {
    name: 'central-phuket-exterior.jpg',
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'Central Phuket внешний вид архитектура'
  },
  {
    name: 'central-phuket-interior-luxury.jpg', 
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'Central Phuket интерьер роскошные магазины'
  },
  {
    name: 'central-phuket-floating-market.jpg',
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'Central Phuket плавучий рынок фуд-корт'
  }
];

async function shopifyAdminRequest(query) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query });

    const options = {
      hostname: SHOPIFY_STORE,
      path: `/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(responseData));
        } catch (e) {
          console.error('Failed to parse JSON:', responseData);
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(data);
    req.end();
  });
}

async function getProductByHandle(handle) {
  const query = `{
    productByHandle(handle: "${handle}") {
      id
      title
    }
  }`;
  const result = await shopifyAdminRequest(query);
  return result.data?.productByHandle;
}

async function uploadImageToShopify(imageUrl, altText) {
  const mutation = `
    mutation {
      fileCreate(files: [{
        originalSource: "${imageUrl}"
        alt: "${altText}"
      }]) {
        files {
          id
          url
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  
  const result = await shopifyAdminRequest(mutation);
  return result.data?.fileCreate;
}

async function attachImageToProduct(productId, imageId) {
  const mutation = `
    mutation {
      productUpdate(input: {
        id: "${productId}"
        images: [{
          id: "${imageId}"
        }]
      }) {
        product {
          id
          title
          images(first: 10) {
            edges {
              node {
                id
                url
                altText
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  
  const result = await shopifyAdminRequest(mutation);
  return result.data?.productUpdate;
}

async function main() {
  console.log('📸 Загружаем фото Central Festival в Shopify...\n');

  // Находим продукт Central Phuket Floresta
  const product = await getProductByHandle('central-phuket-floresta');
  
  if (!product) {
    console.error('❌ Продукт central-phuket-floresta не найден!');
    return;
  }

  console.log(`🏢 Найден продукт: ${product.title}`);
  console.log(`🆔 ID: ${product.id}\n`);

  // Загружаем каждое фото
  for (let i = 0; i < centralFestivalPhotos.length; i++) {
    const photo = centralFestivalPhotos[i];
    console.log(`📷 Загружаем фото ${i + 1}/3: ${photo.name}`);
    
    try {
      // Загружаем фото в Shopify
      const uploadResult = await uploadImageToShopify(photo.url, photo.alt);
      
      if (uploadResult?.files?.[0]) {
        const imageId = uploadResult.files[0].id;
        const imageUrl = uploadResult.files[0].url;
        
        console.log(`  ✅ Загружено! ID: ${imageId}`);
        console.log(`  🔗 URL: ${imageUrl}`);
        
        // Прикрепляем к продукту
        const attachResult = await attachImageToProduct(product.id, imageId);
        
        if (attachResult?.product) {
          console.log(`  ✅ Прикреплено к продукту!`);
        } else if (attachResult?.userErrors) {
          console.error(`  ❌ Ошибка прикрепления:`, attachResult.userErrors);
        }
        
      } else if (uploadResult?.userErrors) {
        console.error(`  ❌ Ошибка загрузки:`, uploadResult.userErrors);
      } else {
        console.error(`  ❌ Неизвестная ошибка загрузки`);
      }
      
    } catch (error) {
      console.error(`  ❌ Ошибка:`, error.message);
    }
    
    console.log(''); // Пустая строка для читаемости
  }

  console.log('✅ Готово! Фото Central Festival загружены в Shopify!');
}

main().catch(console.error);
