const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const SHOPIFY_API_VERSION = '2025-07';

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
          resolve(JSON.parse(data));
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

async function findProduct(handle) {
  console.log(`\n�� Ищем продукт: ${handle}...`);
  
  const query = `
    query {
      productByHandle(handle: "${handle}") {
        id
        title
        handle
        publishedOnCurrentPublication
      }
    }
  `;

  const result = await shopifyAdminRequest(query);
  return result.data?.productByHandle;
}

async function publishProduct(productId) {
  console.log(`\n📢 Публикуем продукт...`);
  
  const mutation = `
    mutation {
      publishablePublish(id: "${productId}", input: [{publicationId: "gid://shopify/Publication/183033913664"}]) {
        publishable {
          ... on Product {
            id
            title
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
  
  if (result.data?.publishablePublish?.userErrors?.length > 0) {
    console.error('❌ Ошибки:', result.data.publishablePublish.userErrors);
    return false;
  }

  console.log('✅ Продукт опубликован!');
  return true;
}

async function main() {
  const handle = process.argv[2] || 'central-phuket-floresta';
  
  console.log('🚀 Публикация продукта в Online Store...\n');
  
  const product = await findProduct(handle);
  
  if (!product) {
    console.error(`❌ Продукт "${handle}" не найден`);
    process.exit(1);
  }

  console.log(`✅ Найден: ${product.title}`);
  console.log(`   ID: ${product.id}`);
  console.log(`   Published: ${product.publishedOnCurrentPublication}`);

  if (!product.publishedOnCurrentPublication) {
    await publishProduct(product.id);
  } else {
    console.log('\n✅ Продукт уже опубликован');
  }

  console.log('\n💡 Проверьте: http://localhost:8080/category/shopping\n');
}

main().catch(console.error);
