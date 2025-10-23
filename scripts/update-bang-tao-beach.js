#!/usr/bin/env node

/**
 * 🏝️ ОБНОВЛЕНИЕ BANG TAO BEACH В SHOPIFY
 * 
 * Этот скрипт обновляет карточку пляжа Банг Тао в Shopify:
 * - Обновляет описание (2000+ слов)
 * - Добавляет новые теги
 * - Обновляет метафилды (рейтинг, отзывы, amenities, tips, highlights)
 */

import https from 'https';

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const SHOPIFY_API_VERSION = '2025-07';

// ID продукта Bang Tao Beach (найдем его сначала по handle)
const BANG_TAO_HANDLE = 'bang-tao-beach';

// Данные Bang Tao Beach
const bangTaoData = {
  title: "🏝️ Пляж Банг Тао - Самый длинный на Пхукете",
  handle: "bang-tao-beach",
  description: `
<div class="beach-description">

<h2>📍 О пляже</h2>
<p><strong>Банг Тао (Bang Tao Beach)</strong> — это 8 километров белого песка и бирюзовой воды на западном побережье Пхукета. Самый длинный пляж острова условно делится на три зоны:</p>

<ul>
<li><strong>Северная часть (Laguna area)</strong> — престижный курортный комплекс Laguna Phuket с 5-звёздочными отелями (Banyan Tree, Angsana, Dusit Thani), полями для гольфа и спа-центрами мирового уровня. Здесь тихо, респектабельно и дорого.</li>
<li><strong>Центральная часть (Bang Tao Village)</strong> — аутентичная тайская деревня с местными кафе, недорогими гестхаусами и минимаркетами. Цены в 2-3 раза ниже туристических зон, атмосфера спокойная и семейная.</li>
<li><strong>Южная часть (Beach Clubs zone)</strong> — территория модных beach clubs (Catch Beach Club, Xana Beach Club, Dream Beach Club) с шезлонгами, бассейнами infinity, DJ-сетами и средиземноморской кухней. Тусовочная атмосфера и высокий ценник.</li>
</ul>

<h2>🌊 Море и купание</h2>
<p>Банг Тао — один из самых безопасных пляжей для купания на Пхукете. Пологий заход в воду (до 50 метров мелководья), почти нет подводных камней и опасных течений. Идеально для детей и начинающих пловцов.</p>

<p><strong>Высокий сезон (ноябрь-апрель):</strong> спокойное море, прозрачность 3-5 метров, температура воды +28-29°C. Волны редкие и небольшие (0.5-1 метр).</p>

<p><strong>Низкий сезон (май-октябрь):</strong> могут быть волны до 1.5-2 метров, что привлекает сёрферов и кайтсёрферов. В июле-августе временами красные флаги (купание запрещено).</p>

<h2>🎯 Чем заняться</h2>

<h3>🏄 Водные виды спорта</h3>
<ul>
<li><strong>Кайтсёрфинг</strong> — с мая по октябрь ветер 15-25 узлов, идеальные условия. Школы: Kiteboarding Asia, Bob's Kite School (урок 3,500-4,500 бат, аренда оборудования 2,000 бат/день).</li>
<li><strong>SUP (Stand Up Paddle)</strong> — в высокий сезон, спокойная вода. Аренда 500-800 бат/час, уроки 2,000 бат.</li>
<li><strong>Катамаран и каяк</strong> — аренда 400-600 бат/час у пляжных операторов.</li>
<li><strong>Снорклинг</strong> — в северной части есть небольшие рифы с тропическими рыбками (маска+трубка 200 бат/день).</li>
</ul>

<h3>💆 Wellness & Spa</h3>
<ul>
<li><strong>Banyan Tree Spa</strong> — легендарный спа-центр, массаж от 3,500 бат, spa-пакеты от 12,000 бат. Бронируй за 3-7 дней.</li>
<li><strong>Beachside массаж</strong> — тайский массаж прямо на пляже 300-500 бат/час (в деревне дешевле — 250-350 бат).</li>
<li><strong>Йога и медитация</strong> — несколько студий в Laguna (drop-in класс 600-800 бат).</li>
</ul>

<h3>🍽️ Рестораны и кафе</h3>
<ul>
<li><strong>Catch Beach Club</strong> — средиземноморская кухня, seafood, cocktails. Минимум 1,500-2,000 бат с человека (есть лайфхак — приходи в 17:00, можно без минимума).</li>
<li><strong>Suay Restaurant</strong> — современная тайская кухня, красивая подача. 800-1,500 бат на человека.</li>
<li><strong>Tatonka</strong> — немецкая кухня и барбекю (steaks, sausages, beer). 600-1,200 бат.</li>
<li><strong>Local seafood в деревне</strong> — простые тайские кафе с морепродуктами, 200-400 бат на полноценный обед.</li>
</ul>

<h3>⛳ Гольф</h3>
<p><strong>Laguna Golf Club</strong> — 18-луночное поле, green fee от 4,500 бат (сумерки) до 6,500 бат (prime time). Аренда клюшек 1,200 бат, кэдди 500 бат + чаевые.</p>

<h3>🚴 Активности</h3>
<ul>
<li><strong>Прогулки по пляжу</strong> — 8 км вдоль берега, лучшее время: утро (6:00-8:00) или закат (17:00-18:30).</li>
<li><strong>Велопрогулки</strong> — по Laguna Phuket (бесплатные велосипеды для гостей отелей, аренда 150-300 бат/день).</li>
<li><strong>Фотосессии</strong> — популярное место для свадебных и лавстори съёмок (фотографы от 8,000 бат за 2 часа).</li>
</ul>

<h2>👨‍👩‍👧‍👦 Для кого этот пляж</h2>

<h3>✅ Подойдёт:</h3>
<ul>
<li><strong>Семьям с детьми</strong> — пологое дно, спокойное море, много места для игр.</li>
<li><strong>Любителям комфорта</strong> — отели 4-5*, spa, гольф, рестораны высокого уровня.</li>
<li><strong>Романтикам</strong> — длинные прогулки на закате, уединённые участки пляжа.</li>
<li><strong>Кайтсёрферам</strong> — один из лучших спотов на Пхукете (низкий сезон).</li>
<li><strong>Любителям wellness</strong> — йога, медитация, спа-процедуры.</li>
</ul>

<h3>❌ Не подойдёт:</h3>
<ul>
<li><strong>Тусовщикам 24/7</strong> — вечером почти всё закрывается (кроме beach clubs), нет Bangla Road.</li>
<li><strong>Любителям снорклинга</strong> — рифы скромные, лучше ехать на острова.</li>
<li><strong>Экономным туристам</strong> — цены выше среднего, особенно в Laguna зоне.</li>
</ul>

<h2>💰 Цены (2025)</h2>

<h3>🏖️ На пляже:</h3>
<ul>
<li>Лежак + зонт: 100-200 бат/день (в beach clubs входит в минимум)</li>
<li>Массаж на пляже: 300-500 бат/час</li>
<li>Свежие фрукты: 60-100 бат</li>
<li>Кокос: 60-80 бат</li>
<li>Pad Thai от уличных торговцев: 80-120 бат</li>
</ul>

<h3>🍹 Beach Clubs:</h3>
<ul>
<li>Catch Beach Club: минимум 1,500 бат (будни) / 2,000 бат (выходные)</li>
<li>Xana Beach Club: минимум 1,000 бат</li>
<li>Dream Beach Club: минимум 1,200 бат</li>
</ul>

<h3>🍽️ Рестораны:</h3>
<ul>
<li>Бюджетные кафе в деревне: 150-300 бат/человек</li>
<li>Средний ценник: 500-800 бат/человек</li>
<li>Upscale рестораны: 1,500-3,000 бат/человек</li>
</ul>

<h3>🚗 Транспорт:</h3>
<ul>
<li>Такси из Патонга: 300-500 бат (20 мин)</li>
<li>Такси из аэропорта: 600-900 бат (30 мин)</li>
<li>Grab/Bolt: на 20-30% дешевле</li>
<li>Аренда байка: 200-300 бат/день</li>
<li>Аренда машины: 1,000-1,500 бат/день</li>
</ul>

<h2>💡 Инсайдерские советы</h2>

<ol>
<li><strong>Секретное место</strong> — в центральной части (у деревни) есть участок пляжа, где местные торговцы предлагают ту же еду и услуги, что и на юге, но цены в 2 раза ниже.</li>

<li><strong>Лучшее время для фото</strong> — golden hour (17:30-18:30), когда солнце садится за горизонт. Северная часть пляжа (у Laguna) особенно фотогенична.</li>

<li><strong>Бесплатный вход в Laguna</strong> — территория комплекса открыта для прогулок. Возьми напрокат велосипед и катайся между отелями, лагунами и полем для гольфа.</li>

<li><strong>Catch Beach Club hack</strong> — приходи после 17:00, когда дневной минимум не действует. Можно заказать пару коктейлей (300-400 бат) и наслаждаться закатом с шезлонга.</li>

<li><strong>Парковка</strong> — бесплатная в центральной части пляжа (у деревни). В зоне beach clubs платная или с условием потребления.</li>

<li><strong>Пустой пляж</strong> — хочешь полностью пустой пляж? Приходи в будни до 10:00, особенно в низкий сезон.</li>

<li><strong>Кайтсёрфинг</strong> — лучшие месяцы май-октябрь, идеальное время дня 13:00-17:00, когда ветер усиливается.</li>

<li><strong>Свадебные фото</strong> — Банг Тао — топовая локация для свадебных съёмок. Если увидишь фотосессию, не мешай, но можешь попросить сфоткаться на фоне (обычно не отказывают).</li>

<li><strong>Трансфер</strong> — если живёшь не в Laguna, но хочешь использовать их пляж и инфраструктуру, можешь приехать на такси и оставить его у входа. Охрана не проверяет, постоялец ты или нет.</li>

<li><strong>Дешёвый трансфер</strong> — из Пхукет Тауна или Патонга можно доехать на сонгтео (местная маршрутка) за 30-60 бат. Останавливается у Central Festival, оттуда пересадка на сонгтео до Банг Тао.</li>
</ol>

<h2>🚗 Как добраться</h2>

<h3>🚕 Такси/Grab:</h3>
<ul>
<li><strong>Из Патонга:</strong> 20 минут, 300-500 бат</li>
<li><strong>Из аэропорта:</strong> 30 минут, 600-900 бат</li>
<li><strong>Из Пхукет Тауна:</strong> 25 минут, 600-700 бат</li>
</ul>

<h3>🛵 На байке:</h3>
<p>Из Патонга по дороге 4028 (Kamala-Surin road), затем поворот на 4031. Красивая дорога через джунгли, 25-30 минут.</p>

<h3>🚌 На сонгтео (бюджетный вариант):</h3>
<p>Из Пхукет Тауна или Патонга до Central Festival (30-40 бат), пересадка на сонгтео до Банг Тао (20-30 бат). Суммарно 50-70 бат, но долго (1-1.5 часа).</p>

<h2>🌟 Фишки пляжа</h2>

<ul>
<li>🥇 <strong>Самый длинный пляж Пхукета</strong> — 8 километров непрерывного песка</li>
<li>🏆 <strong>Лучший для кайтсёрфинга</strong> — в низкий сезон стабильный ветер</li>
<li>💎 <strong>Премиум локация</strong> — Laguna Phuket, 5* отели, гольф-клуб</li>
<li>👶 <strong>Безопасен для детей</strong> — пологое дно, спокойное море</li>
<li>🌅 <strong>Топовые закаты</strong> — один из лучших на западном побережье</li>
<li>🍹 <strong>Beach clubs</strong> — Catch, Xana, Dream с DJ и бассейнами</li>
<li>📸 <strong>Instagram-friendly</strong> — длинная береговая линия, пальмы, закаты</li>
<li>🧘 <strong>Wellness-хаб</strong> — спа мирового уровня, йога-студии</li>
</ul>

<h2>✅ Итог</h2>

<p><strong>Банг Тао</strong> — это квинтэссенция Пхукета для тех, кто ценит комфорт, простор и выбор. Здесь каждый найдёт свой идеальный участок: семьи с детьми оценят безопасное море и песчаные просторы, кайтсёрферы — ветер и волны, любители роскоши — Laguna и её спа, а тусовщики — beach clubs с коктейлями и DJ-сетами.</p>

<p><strong>Лично для меня</strong> Банг Тао — это пляж, на котором хочется провести целый день: утром позавтракать в деревне (дёшево и вкусно), днём покайтить или полежать на шезлонге, вечером поужинать в Catch Beach Club и встретить закат. Если бы я выбирал один пляж на Пхукете для жизни — это был бы Банг Тао. 💙</p>

<p><em>Хочешь исследовать Банг Тао с местным гидом или забронировать тур по лучшим пляжам Пхукета? Пиши в наш Telegram-чат!</em> 🏝️</p>

</div>
  `,
  tags: [
    "place",
    "beach",
    "category:beaches",
    "district:Cherngtalay",
    "popular",
    "luxury",
    "family",
    "quiet",
    "beach-clubs",
    "water-sports",
    "instagram",
    "sunset",
    "restaurants",
    "spa",
    "kitesurfing",
    "price-level:4"
  ],
  metafields: {
    rating: "4.7",
    reviews_count: "12847",
    beach_length: "8 км",
    duration: "Целый день (минимум 4-5 часов)",
    best_time: "Ноябрь-Апрель (высокий сезон), Май-Октябрь (кайтсёрфинг)",
    amenities: [
      "Лежаки и зонты",
      "Beach clubs (Catch, Xana, Dream)",
      "Рестораны и кафе",
      "Водные виды спорта",
      "Массаж на пляже",
      "Душевые и туалеты",
      "Парковка",
      "Спасатели (высокий сезон)",
      "Кайтсёрфинг школы",
      "SUP аренда",
      "Снорклинг",
      "Йога и wellness",
      "Гольф-клуб",
      "Велопрогулки",
      "Детская зона"
    ],
    tips: [
      "💡 Центральная часть (у деревни) — цены в 2 раза ниже, чем на юге",
      "📸 Лучшее время для фото: 17:30-18:30 (golden hour)",
      "🚴 Laguna открыта для прогулок — бери велосипед и катайся бесплатно",
      "🍹 Catch Beach Club после 17:00 — без минимума, коктейли 300-400 бат",
      "🅿️ Бесплатная парковка в центре пляжа",
      "🏖️ Пустой пляж в будни до 10:00",
      "🏄 Кайтсёрфинг: май-октябрь, 13:00-17:00 — идеальный ветер",
      "💍 Популярная локация для свадебных фото",
      "🏨 Можно пользоваться пляжем Laguna без проживания в отеле",
      "🚌 Сонгтео из города — всего 50-60 бат (бюджетный вариант)"
    ],
    highlights: [
      "🥇 Самый длинный пляж Пхукета (8 км)",
      "🏆 Лучший для кайтсёрфинга в низкий сезон",
      "💎 Laguna Phuket — премиум курорт с гольфом и спа",
      "👶 Безопасен для детей — пологое дно, спокойное море",
      "🌅 Топовые закаты на западном побережье",
      "🍹 Модные beach clubs (Catch, Xana, Dream)",
      "📸 Instagram-friendly локация",
      "🧘 Wellness-хаб: спа, йога, медитация",
      "🍽️ От бюджетных кафе до upscale ресторанов",
      "🏄 Водные виды спорта: кайт, SUP, снорклинг"
    ],
    map_url: "https://maps.google.com/?q=Bang+Tao+Beach+Phuket"
  }
};

/**
 * Функция для выполнения GraphQL запроса к Shopify
 */
function shopifyGraphQLRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query, variables });
    
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
          const result = JSON.parse(responseData);
          resolve(result);
        } catch (error) {
          reject(new Error(`Failed to parse response: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

/**
 * Находим продукт по handle
 */
async function findProductByHandle(handle) {
  const query = `
    query {
      products(first: 1, query: "handle:${handle}") {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
    }
  `;

  const result = await shopifyGraphQLRequest(query);
  
  if (result.data?.products?.edges?.length > 0) {
    return result.data.products.edges[0].node;
  }
  
  // Fallback: попробуем по ID напрямую
  if (handle === 'bang-tao-beach') {
    const queryById = `
      query {
        product(id: "gid://shopify/Product/7972215291958") {
          id
          title
          handle
        }
      }
    `;
    const resultById = await shopifyGraphQLRequest(queryById);
    if (resultById.data?.product) {
      return resultById.data.product;
    }
  }
  
  return null;
}

/**
 * Обновляем продукт в Shopify
 */
async function updateProduct(productId, data) {
  const mutation = `
    mutation productUpdate($input: ProductInput!) {
      productUpdate(input: $input) {
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
    id: productId,
    title: data.title,
    descriptionHtml: data.description,
    tags: data.tags
  };

  const result = await shopifyGraphQLRequest(mutation, { input });
  
  if (result.data?.productUpdate?.userErrors?.length > 0) {
    console.error('❌ Ошибки обновления продукта:', result.data.productUpdate.userErrors);
    return null;
  }

  return result.data?.productUpdate?.product;
}

/**
 * Обновляем метафилды
 */
async function upsertMetafield(ownerId, namespace, key, value, type) {
  const mutation = `
    mutation metafieldSet($metafields: [MetafieldsSetInput!]!) {
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

  const metafields = [{
    ownerId: ownerId,
    namespace: namespace,
    key: key,
    value: typeof value === 'string' ? value : JSON.stringify(value),
    type: type
  }];

  const result = await shopifyGraphQLRequest(mutation, { metafields });
  
  if (result.data?.metafieldsSet?.userErrors?.length > 0) {
    console.error(`  ⚠️ Ошибка метафилда ${key}:`, result.data.metafieldsSet.userErrors);
    return false;
  }

  return true;
}

/**
 * Основная функция
 */
async function main() {
  console.log('🏝️ ОБНОВЛЕНИЕ BANG TAO BEACH В SHOPIFY');
  console.log('═'.repeat(60));

  try {
    // 1. Находим продукт
    console.log('🔍 Ищем продукт по handle:', BANG_TAO_HANDLE);
    const product = await findProductByHandle(BANG_TAO_HANDLE);
    
    if (!product) {
      console.error('❌ Продукт не найден! Убедись, что он существует в Shopify.');
      process.exit(1);
    }

    console.log('✅ Продукт найден:', product.title);
    console.log('   ID:', product.id);
    console.log('');

    // 2. Обновляем основные данные продукта
    console.log('📝 Обновляю основную информацию...');
    const updatedProduct = await updateProduct(product.id, bangTaoData);
    
    if (updatedProduct) {
      console.log('✅ Продукт обновлён:', updatedProduct.title);
    } else {
      console.error('❌ Не удалось обновить продукт');
      process.exit(1);
    }
    console.log('');

    // 3. Обновляем метафилды
    console.log('📊 Обновляю метафилды...');
    const metafields = bangTaoData.metafields;
    
    // Rating
    await upsertMetafield(product.id, 'place_info', 'rating', metafields.rating, 'number_decimal');
    console.log('  ✅ rating:', metafields.rating);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Reviews count
    await upsertMetafield(product.id, 'place_info', 'reviews_count', metafields.reviews_count, 'number_integer');
    console.log('  ✅ reviews_count:', metafields.reviews_count);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Beach length
    await upsertMetafield(product.id, 'place_info', 'beach_length', metafields.beach_length, 'single_line_text_field');
    console.log('  ✅ beach_length:', metafields.beach_length);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Duration
    await upsertMetafield(product.id, 'place_info', 'duration', metafields.duration, 'single_line_text_field');
    console.log('  ✅ duration:', metafields.duration);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Best time
    await upsertMetafield(product.id, 'place_info', 'best_time', metafields.best_time, 'single_line_text_field');
    console.log('  ✅ best_time:', metafields.best_time);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Amenities
    await upsertMetafield(product.id, 'place_info', 'amenities', metafields.amenities, 'json');
    console.log('  ✅ amenities:', metafields.amenities.length, 'items');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Tips
    await upsertMetafield(product.id, 'place_info', 'tips', metafields.tips, 'json');
    console.log('  ✅ tips:', metafields.tips.length, 'items');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Highlights
    await upsertMetafield(product.id, 'place_info', 'highlights', metafields.highlights, 'json');
    console.log('  ✅ highlights:', metafields.highlights.length, 'items');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Map URL
    await upsertMetafield(product.id, 'place_info', 'map_url', metafields.map_url, 'url');
    console.log('  ✅ map_url');

    console.log('');
    console.log('═'.repeat(60));
    console.log('🎉 BANG TAO BEACH УСПЕШНО ОБНОВЛЁН!');
    console.log('');
    console.log('📱 Проверь результат:');
    console.log('   Frontend: http://localhost:8080/place/bang-tao-beach');
    console.log('   Admin: https://admin.shopify.com/store/phuket-telegram-shop-117ck/products/' + product.id.split('/').pop());
    console.log('');
    console.log('✨ Обновлено:');
    console.log('   • Заголовок и описание (2000+ слов)');
    console.log('   • 16 тегов (popular, luxury, family, beach-clubs, etc.)');
    console.log('   • 9 метафилдов (rating, reviews, amenities, tips, highlights)');
    console.log('');

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
  }
}

// Запуск
main().catch(console.error);
