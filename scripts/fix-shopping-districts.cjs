// Исправляем районы для торговых центров

const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const SHOPIFY_API_VERSION = '2025-07';

const shoppingCenters = [
  { 
    name: 'Central Phuket', 
    productId: '7972352950326', 
    district: 'Cherngtalay', // Централ Пхукет находится в Чернгталае
    coordinates: '7.8904,98.2924'
  },
  { 
    name: 'Jungceylon Shopping Center', 
    productId: '7974403080246', 
    district: 'Patong', // Джангцелон в Патонге
    coordinates: '7.8965,98.2965'
  },
  { 
    name: 'Premium Outlet Phuket', 
    productId: '7974403145782', 
    district: 'Thalang', // Премиум Аутлет в Таланге
    coordinates: '8.1234,98.3456'
  },
  { 
    name: 'Big C Supercenter Phuket', 
    productId: '7974403244086', 
    district: 'Chalong', // Биг Си в Чалонге
    coordinates: '7.8456,98.3456'
  },
  { 
    name: 'Tesco Lotus Phuket', 
    productId: '7974403604534', 
    district: 'Chalong', // Теско Лотус в Чалонге
    coordinates: '7.8234,98.3456'
  },
  { 
    name: 'Robinson Lifestyle Phuket', 
    productId: '7974403702838', 
    district: 'Karon', // Робинсон в Кароне
    coordinates: '7.8423,98.2981'
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

async function updateShoppingCenterDistrict(productId, district, coordinates) {
  const mutation = `
    mutation updateProduct($id: ID!, $metafields: [MetafieldInput!]!) {
      productUpdate(input: {
        id: $id,
        metafields: $metafields
      }) {
        product {
          id
          title
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    id: `gid://shopify/Product/${productId}`,
    metafields: [
      {
        namespace: "custom",
        key: "district",
        value: district,
        type: "single_line_text_field"
      },
      {
        namespace: "custom",
        key: "coordinates",
        value: coordinates,
        type: "single_line_text_field"
      }
    ]
  };

  return await shopifyAdminRequest(mutation, variables);
}

async function fixAllShoppingDistricts() {
  console.log('🏢 ИСПРАВЛЯЕМ РАЙОНЫ ТОРГОВЫХ ЦЕНТРОВ\n');
  
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < shoppingCenters.length; i++) {
    const center = shoppingCenters[i];
    console.log(`🏢 [${i + 1}/${shoppingCenters.length}] ${center.name}`);
    console.log(`   Район: ${center.district}`);
    console.log(`   Координаты: ${center.coordinates}`);

    try {
      console.log('   📝 Обновляем район...');
      const result = await updateShoppingCenterDistrict(center.productId, center.district, center.coordinates);
      
      if (result.data.productUpdate.userErrors.length > 0) {
        console.error('   ❌ Ошибки:', result.data.productUpdate.userErrors);
        errorCount++;
      } else {
        console.log('   ✅ Район обновлен!');
        successCount++;
      }
    } catch (error) {
      console.error('   ❌ Ошибка:', error.message);
      errorCount++;
    }
    
    console.log(''); // Пустая строка для читаемости
    
    // Задержка между обновлениями
    if (i < shoppingCenters.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('='.repeat(60));
  console.log('📊 ИТОГИ ОБНОВЛЕНИЯ РАЙОНОВ:');
  console.log('='.repeat(60));
  console.log(`✅ Успешно обновлено: ${successCount}/${shoppingCenters.length}`);
  console.log(`❌ Ошибок: ${errorCount}/${shoppingCenters.length}`);
  
  if (successCount > 0) {
    console.log('\n🎉 РАЙОНЫ ОБНОВЛЕНЫ!');
    console.log('🌐 Проверь на сайте - теперь каждый ТЦ показывает свой район');
  }
}

fixAllShoppingDistricts().catch(console.error);
