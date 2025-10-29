const https = require('https');

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

// Функция для генерации описания с правильными заголовками
function generateDescriptionWithHeadings(center) {
  const { title, description } = center;
  const cleanTitle = title.split('(')[0].trim();
  
  return `
<div class="space-y-6">
  <h1 class="text-4xl font-black text-gray-900 mb-6">${title}</h1>

  <p class="text-lg text-gray-700 leading-relaxed">${description}</p>

  <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-6">
    <p class="text-lg font-semibold mb-2">🎯 Хотите посетить ${cleanTitle}?</p>
    <p>Забронируйте <a href="/phuket" class="underline hover:no-underline font-bold">тур с гидом</a> или <a href="/services/car-rental" class="underline hover:no-underline font-bold">арендуйте авто</a> для самостоятельной поездки!</p>
  </div>

  <div class="grid md:grid-cols-2 gap-8">
    <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">🛍️ Магазины и бренды</h2>
      <p class="text-gray-600">Здесь вы найдете широкий выбор магазинов, от международных брендов до местных бутиков.</p>
    </div>

    <div class="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl shadow-lg border border-yellow-200">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">🍽️ Еда и напитки</h2>
      <p class="text-gray-600">Множество ресторанов и кафе на любой вкус, от фастфуда до изысканной кухни.</p>
    </div>
  </div>

  <div class="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 rounded-xl shadow-xl">
    <h2 class="text-3xl font-bold mb-6">🎯 Планируете поездку в ${cleanTitle}?</h2>

    <div class="flex flex-wrap gap-4 mb-6">
      <a href="/phuket" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">🏝️ Забронировать тур с гидом</a>
      <a href="/services/car-rental" class="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">🚗 Арендовать авто</a>
      <a href="/services/currency-exchange" class="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">💱 Обменять валюту</a>
    </div>

    <p class="text-lg">💡 <strong>Совет:</strong> Лучшее время для посещения — утром или вечером, когда меньше всего людей.</p>
  </div>

  <p class="text-lg text-gray-600 italic text-center mt-8">${cleanTitle} — это отличное место для шопинга, развлечений и отдыха на Пхукете.</p>
</div>
  `.trim();
}

const shoppingCenters = [
  {
    handle: 'central-phuket-floresta',
    title: 'Central Phuket (Централ Пхукет)',
    description: 'Крупнейший торговый центр на Пхукете, состоящий из двух крыльев: Central Festival и Central Floresta. Предлагает широкий выбор магазинов, ресторанов, развлечений и аквариум.'
  },
  {
    handle: 'jungceylon-shopping-center',
    title: 'Jungceylon Shopping Center (Джангцелон)',
    description: 'Один из самых популярных торговых центров на Патонге, предлагающий широкий выбор магазинов, ресторанов и развлечений.'
  },
  {
    handle: 'premium-outlet-phuket',
    title: 'Premium Outlet Phuket (Премиум Аутлет Пхукет)',
    description: 'Крупный аутлет-центр с дисконтными магазинами известных брендов, расположенный недалеко от Пхукет Тауна.'
  },
  {
    handle: 'big-c-supercenter-phuket',
    title: 'Big C Supercenter Phuket (Биг Си Суперцентр Пхукет)',
    description: 'Гипермаркет, где можно найти продукты, одежду, электронику и товары для дома по доступным ценам.'
  },
  {
    handle: 'robinson-lifestyle-phuket',
    title: 'Robinson Lifestyle Phuket (Робинсон Лайфстайл Пхукет)',
    description: 'Современный торговый центр с магазинами, ресторанами, кинотеатром и зонами отдыха.'
  },
  {
    handle: 'tesco-lotus-phuket',
    title: 'Tesco Lotus Phuket (Теско Лотус Пхукет)',
    description: 'Еще один крупный гипермаркет, предлагающий широкий ассортимент товаров, от продуктов до бытовой техники.'
  },
  {
    handle: 'patong-night-market',
    title: 'Patong Night Market (Ночной рынок Патонг)',
    description: 'Оживленный ночной рынок с уличной едой, сувенирами, одеждой и местными товарами.'
  }
];

async function main() {
  console.log('🔧 ОБНОВЛЕНИЕ ОПИСАНИЙ С ЗАГОЛОВКАМИ');
  console.log('='.repeat(50));

  for (let i = 0; i < shoppingCenters.length; i++) {
    const center = shoppingCenters[i];
    console.log(`\n📝 [${i + 1}/${shoppingCenters.length}] ${center.title}`);
    
    try {
      const product = await getProductIdByHandle(center.handle);
      if (!product) {
        console.error(`❌ Продукт не найден: ${center.handle}`);
        continue;
      }

      const descriptionHtml = generateDescriptionWithHeadings(center);

      const mutation = `
        mutation updateProduct($id: ID!, $descriptionHtml: String!) {
          productUpdate(input: {
            id: $id,
            descriptionHtml: $descriptionHtml
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

      const data = await makeGraphQLRequest(mutation, {
        id: product.id,
        descriptionHtml: descriptionHtml
      });

      if (data.data.productUpdate.userErrors.length > 0) {
        console.error('❌ User Errors:', data.data.productUpdate.userErrors);
      } else {
        console.log('✅ Описание обновлено!');
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error(`❌ Ошибка: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('🎉 ВСЕ ОПИСАНИЯ ОБНОВЛЕНЫ С ЗАГОЛОВКАМИ!');
  console.log('🔗 Проверьте: http://localhost:8080/category/shopping');
}

main().catch(console.error);
