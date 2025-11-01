#!/usr/bin/env node

/**
 * 🔧 ИСПРАВЛЕНИЕ ОПИСАНИЯ ТУРА "Avatar Plus Hangdong Tour"
 * 
 * Заменяет шаблонное описание на реальное из репозитория
 */

const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const ADMIN_TOKEN = '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';
const API_VERSION = '2025-07';

const APPLY = process.argv.includes('--apply');

// Реальное описание из репозитория
const REAL_DESCRIPTION = `
<div class="space-y-6">
  <!-- Hero секция -->
  <div class="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl mb-6">
    <h1 class="text-3xl font-black mb-2">🦅 Аватар Плюс Хангдонг</h1>
    <p class="text-lg opacity-90">Экстремальные приключения в джунглях Пхукета!</p>
  </div>

  <!-- Краткое описание -->
  <div class="bg-gray-50 p-6 rounded-lg">
    <p class="text-lg text-gray-700 leading-relaxed mb-4">
      Окунитесь в мир фантастических приключений с нашим туром "Аватар Плюс" в джунглях Хангдонга! Этот захватывающий тур объединяет лучшее, что может предложить северный Таиланд. Вы исследуете девственные джунгли, где снимались сцены фильма "Аватар", прокатитесь на зиплайне над кронами деревьев и испытаете настоящий адреналин на высоте птичьего полёта.
    </p>
    <p class="text-gray-700 leading-relaxed mb-4">
      Встреча со слонами в их естественной среде обитания станет незабываемым опытом. Вы сможете покормить этих величественных животных, искупаться вместе с ними в реке и узнать об их образе жизни от опытных погонщиков. Живописные водопады и горячие источники позволят расслабиться после активной части программы. Природные термальные ванны с минеральной водой обладают целебными свойствами и помогут восстановить силы.
    </p>
    <p class="text-gray-700 leading-relaxed">
      Этот тур идеально подходит для любителей природы и активного отдыха, которые хотят увидеть настоящий Таиланд вдали от туристических троп.
    </p>
    <p class="text-gray-600 mt-4">
      <strong>⏱️ Длительность:</strong> 1 день<br>
      <strong>👥 Группа:</strong> До 12 человек<br>
      <strong>🗓️ Ежедневно</strong>
    </p>
  </div>

  <!-- Конверсионный блок -->
  <div class="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-xl">
    <p class="text-lg font-semibold mb-3">🎯 Хотите посетить джунгли Хангдонга?</p>
    <p class="mb-4">Забронируйте <a href="/phuket" class="underline hover:no-underline font-bold">тур с гидом</a> или <a href="/services/car-rental" class="underline hover:no-underline font-bold">арендуйте авто</a> для самостоятельной поездки!</p>
  </div>

  <!-- Ключевые моменты -->
  <h2 class="text-2xl font-bold text-gray-900 mb-4">✨ Что вас ждёт</h2>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <div class="bg-green-50 p-4 rounded-lg text-center">
      <div class="text-3xl mb-2">🌳</div>
      <div class="text-sm font-medium text-green-800">Джунгли Хангдонга</div>
    </div>
    <div class="bg-blue-50 p-4 rounded-lg text-center">
      <div class="text-3xl mb-2">🎢</div>
      <div class="text-sm font-medium text-blue-800">Зиплайн</div>
    </div>
    <div class="bg-purple-50 p-4 rounded-lg text-center">
      <div class="text-3xl mb-2">🐘</div>
      <div class="text-sm font-medium text-purple-800">Встреча со слонами</div>
    </div>
    <div class="bg-orange-50 p-4 rounded-lg text-center">
      <div class="text-3xl mb-2">🌊</div>
      <div class="text-sm font-medium text-orange-800">Горячие источники</div>
    </div>
    <div class="bg-yellow-50 p-4 rounded-lg text-center">
      <div class="text-3xl mb-2">💧</div>
      <div class="text-sm font-medium text-yellow-800">Водопады Бенжаран</div>
    </div>
    <div class="bg-pink-50 p-4 rounded-lg text-center">
      <div class="text-3xl mb-2">🚙</div>
      <div class="text-sm font-medium text-pink-800">Джип-сафари</div>
    </div>
  </div>

  <!-- Что входит -->
  <h2 class="text-2xl font-bold text-gray-900 mb-4">✅ Что входит в тур</h2>
  <div class="bg-gray-50 p-6 rounded-lg">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div class="flex items-center space-x-2">
        <span class="text-green-500 text-xl">✓</span>
        <span class="text-gray-700">Трансфер из районов Равай, Найхарн, Ката, Карон, Патонг</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-green-500 text-xl">✓</span>
        <span class="text-gray-700">Русскоговорящий гид</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-green-500 text-xl">✓</span>
        <span class="text-gray-700">Питание по программе (обед)</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-green-500 text-xl">✓</span>
        <span class="text-gray-700">Входные билеты во все места по программе</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-green-500 text-xl">✓</span>
        <span class="text-gray-700">Медицинская страховка</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-green-500 text-xl">✓</span>
        <span class="text-gray-700">Джип-сафари по джунглям</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-green-500 text-xl">✓</span>
        <span class="text-gray-700">Посещение горячих источников</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-green-500 text-xl">✓</span>
        <span class="text-gray-700">Встреча со слонами и катание</span>
      </div>
    </div>
  </div>

  <!-- Программа тура -->
  <h2 class="text-2xl font-bold text-gray-900 mb-4">📅 Программа тура</h2>
  <div class="bg-blue-50 p-6 rounded-lg">
    <div class="space-y-3 text-sm">
      <div class="flex justify-between items-start">
        <span class="font-medium text-blue-900">08:00</span>
        <span class="text-gray-700 ml-4">Трансфер из отеля</span>
      </div>
      <div class="flex justify-between items-start">
        <span class="font-medium text-blue-900">10:00</span>
        <span class="text-gray-700 ml-4">Прибытие к водопадам Бенжаран. Прогулка по тропическим джунглям</span>
      </div>
      <div class="flex justify-between items-start">
        <span class="font-medium text-blue-900">12:00</span>
        <span class="text-gray-700 ml-4">Обед в ресторане</span>
      </div>
      <div class="flex justify-between items-start">
        <span class="font-medium text-blue-900">14:00</span>
        <span class="text-gray-700 ml-4">Встреча со слонами. Купание и катание</span>
      </div>
      <div class="flex justify-between items-start">
        <span class="font-medium text-blue-900">15:30</span>
        <span class="text-gray-700 ml-4">Джип-сафари по бездорожью</span>
      </div>
      <div class="flex justify-between items-start">
        <span class="font-medium text-blue-900">16:30</span>
        <span class="text-gray-700 ml-4">Посещение горячих источников. СПА-процедуры</span>
      </div>
      <div class="flex justify-between items-start">
        <span class="font-medium text-blue-900">17:00</span>
        <span class="text-gray-700 ml-4">Возвращение в отель</span>
      </div>
    </div>
  </div>

  <!-- Highlights -->
  <h2 class="text-2xl font-bold text-gray-900 mb-4">⭐ Главные моменты тура</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    <div class="bg-white border border-gray-200 p-4 rounded-lg">
      <h3 class="font-semibold text-gray-900 mb-2">🌳 Джунгли и зиплайн</h3>
      <p class="text-sm text-gray-600">Исследуйте джунгли где снимали "Аватар". Прокатитесь на зиплайне над кронами деревьев!</p>
    </div>
    <div class="bg-white border border-gray-200 p-4 rounded-lg">
      <h3 class="font-semibold text-gray-900 mb-2">🐘 Встреча со слонами</h3>
      <p class="text-sm text-gray-600">Покормите слонов, искупайтесь вместе с ними в реке, узнайте об их образе жизни</p>
    </div>
    <div class="bg-white border border-gray-200 p-4 rounded-lg">
      <h3 class="font-semibold text-gray-900 mb-2">💧 Водопады Бенжаран</h3>
      <p class="text-sm text-gray-600">Живописные водопады в тропических джунглях. Идеальное место для фотографий!</p>
    </div>
    <div class="bg-white border border-gray-200 p-4 rounded-lg">
      <h3 class="font-semibold text-gray-900 mb-2">🌊 Горячие источники</h3>
      <p class="text-sm text-gray-600">Природные термальные ванны с минеральной водой. Расслабление и восстановление сил</p>
    </div>
  </div>

  <!-- Не включено -->
  <h2 class="text-2xl font-bold text-gray-900 mb-4">⚠️ Не включено</h2>
  <div class="bg-yellow-50 p-6 rounded-lg">
    <div class="space-y-2 text-sm text-gray-700">
      <div>• Трансфер из отдаленных районов (Камала, Сурин, Бангтао) - доплата 1000 бат</div>
      <div>• Напитки в ресторане</div>
      <div>• Личные расходы и чаевые</div>
      <div>• Дополнительные развлечения</div>
    </div>
  </div>

  <!-- Важная информация -->
  <div class="bg-blue-50 p-6 rounded-lg">
    <h3 class="text-xl font-semibold text-blue-800 mb-3">💡 Важно знать</h3>
    <div class="space-y-2 text-sm text-gray-700">
      <div>• Детский билет 4-11 лет включительно. До 3-х лет бесплатно</div>
      <div>• Программа может изменяться в зависимости от погодных условий</div>
      <div>• Подходит для людей любого возраста</div>
      <div>• Рекомендуется иметь при себе средства от комаров</div>
      <div>• Удобная обувь для ходьбы по джунглям</div>
      <div>• Купальные принадлежности для горячих источников</div>
    </div>
  </div>

  <!-- Финальный конверсионный блок -->
  <div class="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 rounded-xl">
    <h2 class="text-3xl font-bold mb-6">🎯 Планируете поездку в джунгли Хангдонга?</h2>
    <div class="flex flex-wrap gap-4 mb-6">
      <a href="/phuket" class="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors text-center">🏝️ Забронировать тур с гидом</a>
      <a href="/services/car-rental" class="bg-white text-green-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors text-center">🚗 Арендовать авто</a>
      <a href="/services/currency-exchange" class="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors text-center">💱 Обменять валюту</a>
    </div>
  </div>

  <!-- Эмоциональное заключение -->
  <p class="text-lg text-gray-600 italic text-center mt-8">
    Аватар Плюс Хангдонг — это не просто экскурсия, это настоящее приключение в тропических джунглях! Зиплайн, слоны, водопады и горячие источники — всё в одном дне для создания незабываемых воспоминаний.
  </p>
</div>
`;

// ============================================================================
// FUNCTIONS
// ============================================================================

function makeGraphQLRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query, variables });
    const options = {
      hostname: SHOPIFY_STORE,
      path: `/admin/api/${API_VERSION}/graphql.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_TOKEN,
        'Content-Length': Buffer.byteLength(postData),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.errors) reject(new Error(JSON.stringify(jsonData.errors)));
          else resolve(jsonData.data);
        } catch (error) { reject(error); }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function getProductId(handle) {
  const query = `
    query GetProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
      }
    }
  `;
  
  const data = await makeGraphQLRequest(query, { handle });
  return data.productByHandle;
}

async function updateDescription(productId, descriptionHtml) {
  const escapedDescription = descriptionHtml
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
  
  const mutation = `
    mutation UpdateProduct($id: ID!, $input: ProductInput!) {
      productUpdate(input: {
        id: $id,
        descriptionHtml: "${escapedDescription}"
      }) {
        product { id title }
        userErrors { field message }
      }
    }
  `;
  
  if (!APPLY) {
    console.log(`🧪 DRY-RUN: Обновление описания для ${productId}`);
    return true;
  }
  
  const data = await makeGraphQLRequest(mutation, { 
    id: productId,
    input: {} // Не используется, descriptionHtml в строке
  });
  
  if (data.productUpdate.userErrors?.length > 0) {
    throw new Error(JSON.stringify(data.productUpdate.userErrors));
  }
  
  return true;
}

async function main() {
  console.log('🔧 ИСПРАВЛЕНИЕ ОПИСАНИЯ ТУРА "Avatar Plus Hangdong Tour"');
  console.log('='.repeat(60));
  console.log(`⚙️  Режим: ${APPLY ? 'APPLY (реальная запись)' : 'DRY-RUN (тест)'}\n`);
  
  const handle = 'avatar-plus-hangdong-tour';
  
  try {
    console.log(`🔍 Ищем тур: ${handle}...`);
    const product = await getProductId(handle);
    
    if (!product) {
      console.error(`❌ Тур не найден!`);
      return;
    }
    
    console.log(`✅ Найден: ${product.title} (${product.id})\n`);
    console.log(`📝 Обновляем описание...`);
    
    await updateDescription(product.id, REAL_DESCRIPTION);
    
    console.log(`✅ Описание успешно обновлено!`);
    console.log(`🌐 Проверьте: http://localhost:8080/product/${handle}`);
    
  } catch (error) {
    console.error(`❌ Ошибка:`, error.message);
  }
}

main().catch(console.error);

