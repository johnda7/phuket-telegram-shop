const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const SHOPIFY_API_VERSION = '2025-07';

const centralPhuket = {
  title: "Central Phuket Floresta",
  handle: "central-phuket-floresta",
  description: "Central Phuket – самый большой торговый центр на острове с широким ассортиментом брендов и бесспорно одно из лучших мест для шоппинга на Пхукете. Он состоит из двух корпусов: Central Festival и Central Floresta.<br><br>В Central Festival располагаются всем известные бренды одежды, обуви и аксессуаров, а во втором корпусе Central Floresta – преимущественно люксовые бутики.",
  productType: "place",
  vendor: "PhuketDa Insider",
  tags: ["place", "category:shopping", "district:phuket-town", "shopping", "mall"],
  metafields: [
    { namespace: "place_info", key: "rating", value: "4.5", type: "number_decimal" },
    { namespace: "place_info", key: "reviews_count", value: "1250", type: "number_integer" },
    { namespace: "place_info", key: "amenities", value: JSON.stringify(["wifi", "parking", "food-court", "cinema", "kids-zone"]), type: "json" },
    { namespace: "place_info", key: "hours", value: "10:00-22:00 ежедневно", type: "single_line_text_field" },
    { namespace: "place_info", key: "coordinates", value: "7.8904,98.2924", type: "single_line_text_field" }
  ]
};

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

async function createProduct(placeData) {
  console.log(`\n📦 Создаём продукт: ${placeData.title}...`);

  const mutation = `
    mutation createProduct($input: ProductInput!) {
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

  const input = {
    title: placeData.title,
    handle: placeData.handle,
    descriptionHtml: placeData.description,
    productType: placeData.productType,
    vendor: placeData.vendor,
    tags: placeData.tags,
    status: 'ACTIVE'
  };

  const result = await shopifyAdminRequest(mutation, { input });
  
  if (result.data?.productCreate?.userErrors?.length > 0) {
    console.error('❌ Ошибки:', result.data.productCreate.userErrors);
    return null;
  }

  const product = result.data.productCreate.product;
  console.log(`✅ Продукт создан: ${product.title}`);
  
  return product;
}

async function addMetafields(productId, metafields) {
  console.log(`\n📝 Добавляем ${metafields.length} метаполей...`);

  for (const metafield of metafields) {
    const mutation = `
      mutation createMetafield($input: MetafieldInput!) {
        metafieldSet(metafield: $input) {
          metafield { id key value }
          userErrors { field message }
        }
      }
    `;

    const input = {
      namespace: metafield.namespace,
      key: metafield.key,
      value: metafield.value,
      type: metafield.type,
      ownerId: productId
    };

    try {
      const result = await shopifyAdminRequest(mutation, { input });
      
      if (result.data?.metafieldSet?.userErrors?.length > 0) {
        console.error(`  ❌ ${metafield.key}:`, result.data.metafieldSet.userErrors);
      } else {
        console.log(`  ✅ ${metafield.key}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`  ❌ ${metafield.key}:`, error.message);
    }
  }
}

async function main() {
  console.log('🚀 Загрузка Central Phuket в Shopify...\n');

  const product = await createProduct(centralPhuket);
  
  if (!product) {
    console.error('\n❌ Не удалось создать продукт');
    process.exit(1);
  }

  await addMetafields(product.id, centralPhuket.metafields);

  console.log('\n' + '='.repeat(60));
  console.log('✅ УСПЕШНО! Central Phuket загружен');
  console.log('='.repeat(60));
  console.log(`\nHandle: ${product.handle}`);
  console.log(`\n💡 Проверьте: http://localhost:8080/category/shopping\n`);
}

main().catch(console.error);
