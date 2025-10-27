// Загружаем фото Central Festival через REST API
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

async function shopifyRestRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: SHOPIFY_STORE,
      path: `/admin/api/${SHOPIFY_API_VERSION}/${path}`,
      method: method,
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(data);
    }

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

    if (data) {
      req.write(data);
    }
    req.end();
  });
}

async function getProductByHandle(handle) {
  try {
    const result = await shopifyRestRequest('GET', `products.json?handle=${handle}`);
    return result.products?.[0] || null;
  } catch (error) {
    console.error('Error getting product:', error.message);
    return null;
  }
}

async function uploadImageToProduct(productId, imageUrl, altText) {
  try {
    const imageData = {
      image: {
        src: imageUrl,
        alt: altText
      }
    };

    const result = await shopifyRestRequest('POST', `products/${productId}/images.json`, JSON.stringify(imageData));
    return result.image;
  } catch (error) {
    console.error('Error uploading image:', error.message);
    return null;
  }
}

async function main() {
  console.log('📸 Загружаем фото Central Festival через REST API...\n');

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
      const image = await uploadImageToProduct(product.id, photo.url, photo.alt);
      
      if (image) {
        console.log(`  ✅ Загружено! ID: ${image.id}`);
        console.log(`  🔗 URL: ${image.src}`);
        console.log(`  📝 Alt: ${image.alt}`);
      } else {
        console.error(`  ❌ Ошибка загрузки`);
      }
      
    } catch (error) {
      console.error(`  ❌ Ошибка:`, error.message);
    }
    
    console.log(''); // Пустая строка для читаемости
    
    // Пауза между загрузками
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('✅ Готово! Фото Central Festival загружены в Shopify!');
  console.log('🔗 Проверь: https://admin.shopify.com/store/phuket-telegram-shop-117ck/products');
}

main().catch(console.error);
