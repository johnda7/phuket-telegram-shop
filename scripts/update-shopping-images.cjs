// Скрипт для обновления изображений торговых центров в Shopify

const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const SHOPIFY_API_VERSION = '2025-07';

// Уникальные изображения для каждого ТЦ (Unsplash)
const shoppingImages = [
  {
    handle: "central-phuket-floresta",
    imageUrl: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=1200&h=900&fit=crop&q=80",
    alt: "Central Phuket Floresta - Luxury Shopping Mall"
  },
  {
    handle: "jungceylon-shopping-center",
    imageUrl: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&h=900&fit=crop&q=80",
    alt: "Jungceylon Shopping Center Patong"
  },
  {
    handle: "premium-outlet-phuket",
    imageUrl: "https://images.unsplash.com/photo-1441986380878-c4248f5b8b5b?w=1200&h=900&fit=crop&q=80",
    alt: "Premium Outlet Phuket - Designer Brands"
  },
  {
    handle: "big-c-supercenter-phuket",
    imageUrl: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1200&h=900&fit=crop&q=80",
    alt: "Big C Supercenter Phuket - Thai Supermarket"
  },
  {
    handle: "tesco-lotus-phuket",
    imageUrl: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=1200&h=900&fit=crop&q=80",
    alt: "Tesco Lotus Phuket - Supermarket"
  },
  {
    handle: "robinson-lifestyle-phuket",
    imageUrl: "https://images.unsplash.com/photo-1558470598-a5dda9640f68?w=1200&h=900&fit=crop&q=80",
    alt: "Robinson Lifestyle Phuket - Modern Mall"
  },
  {
    handle: "patong-night-market",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=900&fit=crop&q=80",
    alt: "Patong Night Market - Thai Shopping"
  }
];

function shopifyAdminRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query, variables });
    const options = {
      hostname: SHOPIFY_STORE,
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

async function findProductByHandle(handle) {
  const query = `
    query {
      productByHandle(handle: "${handle}") {
        id
        title
        handle
        images(first: 5) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  `;

  const result = await shopifyAdminRequest(query);
  return result.data?.productByHandle;
}

async function deleteProductImages(productId, imageIds) {
  if (!imageIds || imageIds.length === 0) return;

  const mutation = `
    mutation {
      productDeleteImages(
        id: "${productId}",
        imageIds: [${imageIds.map(id => `"${id}"`).join(', ')}]
      ) {
        deletedImageIds
        userErrors {
          field
          message
        }
      }
    }
  `;

  await shopifyAdminRequest(mutation);
}

async function addProductImage(productId, imageUrl, alt) {
  const mutation = `
    mutation {
      productCreateMedia(
        productId: "${productId}",
        media: [{
          originalSource: "${imageUrl}",
          alt: "${alt}",
          mediaContentType: IMAGE
        }]
      ) {
        media {
          ... on MediaImage {
            id
            image {
              url
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
  
  if (result.data?.productCreateMedia?.userErrors?.length > 0) {
    console.error(`  ❌ Ошибка добавления изображения:`, result.data.productCreateMedia.userErrors);
    return false;
  }

  return true;
}

async function main() {
  console.log('🖼️  Обновление изображений торговых центров...\n');

  let updatedCount = 0;
  let errorCount = 0;

  for (const item of shoppingImages) {
    console.log(`\n📦 ${item.handle}`);
    
    try {
      // Найти продукт
      const product = await findProductByHandle(item.handle);
      
      if (!product) {
        console.log(`  ❌ Продукт не найден`);
        errorCount++;
        continue;
      }

      // Удалить старые изображения
      const existingImageIds = product.images.edges.map(e => e.node.id);
      if (existingImageIds.length > 0) {
        console.log(`  🗑️  Удаление ${existingImageIds.length} старых изображений...`);
        await deleteProductImages(product.id, existingImageIds);
      }

      // Добавить новое изображение
      console.log(`  ➕ Добавление нового изображения...`);
      const success = await addProductImage(product.id, item.imageUrl, item.alt);
      
      if (success) {
        console.log(`  ✅ Изображение обновлено!`);
        updatedCount++;
      } else {
        errorCount++;
      }

      // Небольшая задержка
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error(`  ❌ Ошибка:`, error.message);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 ИТОГИ:');
  console.log('='.repeat(60));
  console.log(`✅ Обновлено: ${updatedCount}`);
  console.log(`❌ Ошибок: ${errorCount}`);
  console.log(`📦 Всего обработано: ${shoppingImages.length}`);
  console.log('\n💡 Проверьте: http://localhost:8080/category/shopping\n');
}

main().catch(console.error);


