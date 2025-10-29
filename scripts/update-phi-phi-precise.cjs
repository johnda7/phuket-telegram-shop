const fs = require('fs');

// Конфигурация Shopify
const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const ADMIN_TOKEN = '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';

// Функция для запроса к Shopify Admin API
async function shopifyRequest(query, variables = {}) {
  const response = await fetch(`https://${SHOPIFY_STORE}/admin/api/2025-07/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_TOKEN
    },
    body: JSON.stringify({ query, variables })
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

// ТОЧНОЕ описание с pukeo.com
const PRECISE_DESCRIPTION = `
<h1>🏝️ Пхи-Пхи 2 дня/1 ночь — Лучший тур Пхукета!</h1>

<p><strong>Экскурсия с ночёвкой на островах Пхи-Пхи</strong></p>

<p>Острова Пхи-Пхи — это архипелаг из 6 островов с лазурной водой и белыми песчаными пляжами, расположенный между Пхукетом и западным побережьем Андаманского моря. Двухдневная экскурсия с ночёвкой на острове Пхи-Пхи Дон позволяет в полной мере насладиться всеми красотами этого райского уголка.</p>

<p>Вы посетите знаменитую бухту Майя, где снимался фильм "Пляж" с Леонардо Ди Каприо, поплаваете в изумрудной лагуне Пиле и исследуете таинственную пещеру Викингов. Белоснежные пляжи, кристально чистая вода и богатый подводный мир создают идеальные условия для снорклинга.</p>

<p>Вы увидите разнообразных тропических рыб и коралловые рифы у острова Бамбу. Вечером вас ждёт незабываемая ночная жизнь острова: огненное шоу от чемпионов Таиланда, пляжные вечеринки и модные бары на берегу моря. Утром второго дня у вас будет возможность подняться на обзорную площадку, откуда открывается изумительный панорамный вид на весь архипелаг.</p>

<h2>🎯 Что входит в тур</h2>
<ul>
<li>✓ Множество остановок для фотографирования с захватывающими видами</li>
<li>✓ Возможность увидеть живописную природу одного из самого крупного Национального парка Таиланда</li>
<li>✓ Узнайте больше о тайской культуре, Буддизме</li>
<li>✓ Полюбуйтесь очаровательными пляжами и незабываемыми видами островов Андаманского моря</li>
<li>✓ Познакомитесь с подводным миром и их обитателями</li>
<li>✓ Окунитесь в ночную жизнь острова Пхи-Пхи Дон</li>
</ul>

<h2>📅 Программа тура</h2>

<h3>День 1</h3>
<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
  <strong>06:50</strong> — Выезд из отеля
</div>
<p>Выезд из отеля</p>

<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
  <strong>07:50</strong> — Прибытие к причалу
</div>
<p>Прибытие к причалу, знакомство с гидом, перерыв на чай, кофе</p>

<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
  <strong>08:50</strong> — Отправление с причала
</div>
<p>Отправление с причала</p>

<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
  <strong>09:50</strong> — Бухта Майя
</div>
<p>Посещение бухты Майя, где проходили съемки фильма «Пляж» с Леонардо ДиКаприо</p>

<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
  <strong>10:50</strong> — Лагуна Пиле
</div>
<p>Плавание в Лагуне Пиле</p>

<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
  <strong>11:30</strong> — Пещера Викингов
</div>
<p>Осмотр Пещеры Викингов</p>

<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
  <strong>11:50</strong> — Плавание с масками
</div>
<p>Плавание с масками. Созерцание разнообразных видов рыб</p>

<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
  <strong>12:50</strong> — Остров Бамбу
</div>
<p>Отдых на прекрасном острове Бамбу</p>

<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
  <strong>14:20</strong> — Обед
</div>
<p>Прибытие на острова Пхи Пхи Дон. Обед в пляжном ресторане</p>

<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
  <strong>15:50</strong> — Заселение в отель
</div>
<p>Заселение в отель на острове Пхи-Пхи Дон. Посещение улиц деревни Пхи-Пхи, где есть множество модных баров, ресторанов и магазинов, время для отдыха</p>

<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
  <strong>19:50</strong> — Ужин в отеле
</div>
<p>Ужин в отеле</p>

<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
  <strong>20:30</strong> — Огненное шоу
</div>
<p>До начала пляжных вечеринок, посещение бара и возможность увидеть невероятное огненное шоу от чемпионов Таиланда, а также насладиться коктейлем на пляже</p>

<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
  <strong>22:50</strong> — Тайский Бокс
</div>
<p>Посещение бара, где самые смелые гости смогут попытать свои навыки в Тайском Боксе</p>

<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
  <strong>23:20</strong> — Ночная жизнь
</div>
<p>Ночная жизнь острова. Вечеринки на пляже</p>

<h3>День 2</h3>
<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
  <strong>07:00-10:00</strong> — Завтрак
</div>
<p>Завтрак в отеле</p>

<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
  <strong>09:00</strong> — Отдых на пляже
</div>
<p>Время для отдыха после вечеринки на пляже, отдых на пляже</p>

<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
  <strong>10:30</strong> — Смотровая площадка
</div>
<p>Потрясающая возможность посетить обзорную площадку откуда открывается изумительный вид на остров</p>

<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
  <strong>11:00</strong> — Выселение с отеля
</div>
<p>Выселение с отеля</p>

<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
  <strong>11:10</strong> — Свободное время
</div>
<p>Свободное время</p>

<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
  <strong>13:30</strong> — Обед
</div>
<p>Обед на острове Пхи Пхи Дон</p>

<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
  <strong>14:30</strong> — Пляж обезьян
</div>
<p>Осмотр пляжа обезьян в заливе Йонг Касем</p>

<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
  <strong>15:30</strong> — Снорклинг
</div>
<p>Плавание с масками возле острова Пхи-Пхи Дон. Созерцание разнообразных видов рыб</p>

<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
  <strong>16:30</strong> — Рыбалка
</div>
<p>Отдых на жемчужине Андаманского моря, острове Ранг Яй. Глубоководная рыбалка, желающие могут попробовать свои рыбацкие навыки вместе с нашим капитаном и матросами. Возможность поймать множество различных видов рыб. (Внимание: в случае неблагоприятных погодных условий рыбалка может быть отменена)</p>

<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
  <strong>17:00</strong> — Возвращение
</div>
<p>Прибытие к причалу, отправление в отель</p>

<h2>✅ Включено в стоимость</h2>

<h3>Включено</h3>
<ul>
<li>✓ 2 обеда, 1 ужин, 1 завтрак</li>
<li>✓ Транспорт (автобус и лодка)</li>
<li>✓ Входные билеты в национальные парки</li>
<li>✓ Прохладительные безалкогольные напитки</li>
<li>✓ Угощение фруктами на борту</li>
<li>✓ Страховка</li>
<li>✓ Русский гид</li>
<li>✓ Спасательные жилеты</li>
<li>✓ Маски, трубки</li>
<li>✓ Размещение в отеле</li>
</ul>

<h3>Не включено</h3>
<ul>
<li>✗ Входные билеты на смотровую площадку Пхи-Пхи Дон (50 Бат)</li>
<li>✗ Личные расходы</li>
</ul>

<h2>🎒 Что взять с собой</h2>
<ul>
<li>• Купальные принадлежности</li>
<li>• Солнцезащитные крема</li>
<li>• Крем после загара</li>
<li>• Головной убор</li>
<li>• Тапочки</li>
<li>• Личные деньги</li>
</ul>

<h2>⚠️ Важная информация</h2>
<ul>
<li>⚠ Программа и расписание могут изменяться в зависимости от погодных условий и работы национального парка</li>
<li>⚠ Гид может изменить очередность посещения локаций или заменить локации на схожие по насыщенности и красоте</li>
</ul>

<h2>🎯 Планируете поездку на Пхи-Пхи?</h2>
<div class="flex flex-wrap gap-4 mb-4">
  <a href="/phuket" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">🏝️ Забронировать тур с гидом</a>
  <a href="/services/car-rental" class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">🚗 Арендовать авто</a>
  <a href="/services/currency-exchange" class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600">💱 Обменять валюту</a>
</div>

<p><em>Пхи-Пхи 2 дня/1 ночь — это не просто тур, это незабываемое путешествие в райский уголок Андаманского моря. Идеальное сочетание приключений, отдыха и ночной жизни для создания воспоминаний на всю жизнь.</em></p>
`;

async function updatePhiPhiPrecise() {
  console.log('🚀 ТОЧНОЕ ОБНОВЛЕНИЕ ТУРА ПХИ-ПХИ (КАК НА PUKEO.COM)');
  console.log('============================================================');
  console.log('📅 Дата:', new Date().toLocaleString('ru-RU'));
  console.log('🎯 Цель: Один в один с pukeo.com');
  console.log('🏪 Магазин:', SHOPIFY_STORE);
  console.log('============================================================\n');

  try {
    // 1. Найти тур Пхи-Пхи
    console.log('🔍 Ищу тур Пхи-Пхи...');
    const searchQuery = `
      query {
        productByHandle(handle: "phi-phi-2-days-1-night") {
          id
          title
          handle
          variants(first: 10) {
            edges {
              node {
                id
                title
                price
              }
            }
          }
        }
      }
    `;

    const searchResult = await shopifyRequest(searchQuery);
    
    if (!searchResult.data.productByHandle) {
      throw new Error('Тур Пхи-Пхи не найден!');
    }

    const product = searchResult.data.productByHandle;
    console.log(`✅ Найден тур: ${product.title}`);
    console.log(`🔗 ID: ${product.id}`);

    // 2. Обновить описание через metafield
    console.log('\n📝 Обновляю описание...');
    const metafieldMutation = `
      mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            key
            value
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const metafieldVariables = {
      metafields: [
        {
          ownerId: product.id,
          namespace: "custom",
          key: "description",
          value: PRECISE_DESCRIPTION,
          type: "multi_line_text_field"
        }
      ]
    };

    const metafieldResult = await shopifyRequest(metafieldMutation, metafieldVariables);
    
    if (metafieldResult.data.metafieldsSet.userErrors.length > 0) {
      console.error('❌ Ошибка создания metafield:', metafieldResult.data.metafieldsSet.userErrors);
      return false;
    }

    console.log('✅ Описание обновлено!');

    // 3. Обновить цены в батах
    console.log('\n💰 Обновляю цены в батах...');
    const variants = product.variants.edges.map(edge => edge.node);
    
    const priceUpdateMutation = `
      mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
          product {
            id
            title
          }
          productVariants {
            id
            title
            price
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const priceUpdateVariables = {
      productId: product.id,
      variants: variants.map(variant => ({
        id: variant.id,
        price: variant.title.includes('Взрослый') ? '4500.00' : '3500.00'
      }))
    };

    const priceResult = await shopifyRequest(priceUpdateMutation, priceUpdateVariables);
    
    if (priceResult.data.productVariantsBulkUpdate.userErrors.length > 0) {
      console.error('❌ Ошибка обновления цен:', priceResult.data.productVariantsBulkUpdate.userErrors);
    } else {
      console.log('✅ Цены обновлены в батах!');
      priceResult.data.productVariantsBulkUpdate.productVariants.forEach(variant => {
        console.log(`   ${variant.title}: ${variant.price} бат`);
      });
    }

    console.log('\n============================================================');
    console.log('🎉 ГОТОВО! Тур Пхи-Пхи обновлен один в один с pukeo.com');
    console.log('💡 Проверьте результат на сайте');
    console.log('============================================================');

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

updatePhiPhiPrecise().catch(console.error);
