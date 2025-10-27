// Проверяем metafields всех торговых центров

const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const SHOPIFY_API_VERSION = '2025-07';

const shoppingCenters = [
  { name: 'Central Phuket', handle: 'central-phuket-floresta', productId: '7972352950326' },
  { name: 'Jungceylon Shopping Center', handle: 'jungceylon-shopping-center', productId: '7974403080246' },
  { name: 'Premium Outlet Phuket', handle: 'premium-outlet-phuket', productId: '7974403145782' },
  { name: 'Big C Supercenter Phuket', handle: 'big-c-supercenter-phuket', productId: '7974403244086' },
  { name: 'Tesco Lotus Phuket', handle: 'tesco-lotus-phuket', productId: '7974403604534' },
  { name: 'Robinson Lifestyle Phuket', handle: 'robinson-lifestyle-phuket', productId: '7974403702838' }
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

async function checkShoppingCenterMetafields(productId, name) {
  const query = `
    query getProduct($id: ID!) {
      product(id: $id) {
        id
        title
        handle
        metafields(first: 20, namespace: "custom") {
          edges {
            node {
              key
              value
              type
            }
          }
        }
      }
    }
  `;

  const variables = { id: `gid://shopify/Product/${productId}` };

  try {
    const result = await shopifyAdminRequest(query, variables);
    const product = result.data.product;
    
    console.log(`\n🏢 ${name}`);
    console.log(`   Handle: ${product.handle}`);
    console.log(`   ID: ${productId}`);
    
    if (product.metafields.edges.length === 0) {
      console.log('   ❌ Нет metafields!');
      return { hasMetafields: false };
    }
    
    const metafields = {};
    product.metafields.edges.forEach(edge => {
      metafields[edge.node.key] = edge.node.value;
    });
    
    console.log('   📊 Metafields:');
    console.log(`      Рейтинг: ${metafields.rating || 'НЕТ'}`);
    console.log(`      Район: ${metafields.district || 'НЕТ'}`);
    console.log(`      Координаты: ${metafields.coordinates || 'НЕТ'}`);
    console.log(`      Часы работы: ${metafields.working_hours || 'НЕТ'}`);
    console.log(`      Цена входа: ${metafields.entry_price || 'НЕТ'}`);
    console.log(`      Телефон: ${metafields.phone || 'НЕТ'}`);
    console.log(`      Сайт: ${metafields.website || 'НЕТ'}`);
    
    return { hasMetafields: true, metafields };
  } catch (error) {
    console.error(`   ❌ Ошибка:`, error.message);
    return { hasMetafields: false, error: error.message };
  }
}

async function checkAllShoppingMetafields() {
  console.log('🔍 ПРОВЕРЯЕМ METAFIELDS ВСЕХ ТОРГОВЫХ ЦЕНТРОВ\n');
  
  let totalChecked = 0;
  let withMetafields = 0;
  let withoutMetafields = 0;
  
  for (let i = 0; i < shoppingCenters.length; i++) {
    const center = shoppingCenters[i];
    const result = await checkShoppingCenterMetafields(center.productId, center.name);
    
    totalChecked++;
    if (result.hasMetafields) {
      withMetafields++;
    } else {
      withoutMetafields++;
    }
    
    // Задержка между запросами
    if (i < shoppingCenters.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 ИТОГИ ПРОВЕРКИ METAFIELDS:');
  console.log('='.repeat(60));
  console.log(`✅ С metafields: ${withMetafields}/${totalChecked}`);
  console.log(`❌ Без metafields: ${withoutMetafields}/${totalChecked}`);
  
  if (withoutMetafields > 0) {
    console.log('\n⚠️  НУЖНО ДОБАВИТЬ METAFIELDS!');
    console.log('📝 Запустите: node scripts/add-shopping-metafields.cjs');
  }
}

checkAllShoppingMetafields().catch(console.error);
