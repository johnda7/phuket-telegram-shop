#!/usr/bin/env node
// Применяет шаблон Пхи-Пхи к туру Рафтинг + Слоновье СПА + ATV

const STORE = "phuket-telegram-shop-117ck.myshopify.com";
const TOKEN = "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";
const API_VERSION = "2025-07";

async function rq(query, variables = {}) {
  const res = await fetch(`https://${STORE}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": TOKEN },
    body: JSON.stringify({ query, variables })
  });
  const data = await res.json();
  if (data.errors) throw new Error(JSON.stringify(data.errors));
  return data;
}

async function getProductByHandle(handle) {
  const q = `query($h:String!){ productByHandle(handle:$h){ id title handle descriptionHtml } }`;
  const d = await rq(q, { h: handle });
  return d.data.productByHandle;
}

async function updateDescriptionHtml(id, html) {
  const m = `mutation($input: ProductInput!){
    productUpdate(input:$input){ product{ id title descriptionHtml }
      userErrors{ field message }
    }
  }`;
  const v = { input: { id, descriptionHtml: html } };
  const d = await rq(m, v);
  if (d.data.productUpdate.userErrors?.length) {
    throw new Error(JSON.stringify(d.data.productUpdate.userErrors));
  }
  return d.data.productUpdate.product;
}

function raftingTemplate() {
  return `<section class="prose prose-lg max-w-none">
    <h1>🚣 Рафтинг + Слоновье СПА + ATV — приключения в джунглях</h1>
    <p>Незабываемое приключение в один день: сплав по горной реке, купание со слонами и драйв на квадроциклах! Идеально для любителей активного отдыха и насыщенных программ.</p>

    <h2>Что включено</h2>
    <ul>
      <li>Трансфер от/до отеля на Пхукете</li>
      <li>Рафтинг по горной реке (5 км) в окружении джунглей</li>
      <li>Поездка на мощных квадроциклах по трассе с препятствиями</li>
      <li>Посещение деревни слонов и Слоновье СПА</li>
      <li>Обед в ресторане с блюдами тайской кухни</li>
      <li>Снаряжение для рафтинга, спасжилеты, шлемы</li>
      <li>Русскоязычный гид, страховка, питьевая вода</li>
    </ul>

    <h2>Программа</h2>
    <h3>Утром</h3>
    <ol>
      <li>08:00 — выезд из отеля</li>
      <li>09:30 — пещерный храм Суван Куха с лежащим Буддой</li>
      <li>10:30 — прогулка по парку у озера с пещерами</li>
      <li>11:00 — прыжки с тарзанки для разогрева</li>
    </ol>
    
    <h3>Днем</h3>
    <ol>
      <li>12:00 — рафтинг по горной реке (5 км)</li>
      <li>13:30 — обед в ресторане</li>
      <li>14:30 — поездка на квадроциклах по бездорожью</li>
      <li>15:30 — деревня слонов и Слоновье СПА</li>
    </ol>
    
    <h3>Вечером</h3>
    <ol>
      <li>16:30 — купание со слонами, грязевые процедуры</li>
      <li>17:00 — шоу слонёнка</li>
      <li>17:30 — остановка у водопада</li>
      <li>18:00 — возвращение на Пхукет</li>
    </ol>

    <h2>Не включено</h2>
    <ul>
      <li>Личные расходы, напитки в ресторанах</li>
      <li>Вход в храм (50 бат)</li>
      <li>Фото со слонами (200-500 бат)</li>
    </ul>

    <h2>Полезно знать</h2>
    <p>Дети 8+; возьмите купальник, сменную одежду, солнцезащитный крем. Возможны погодные корректировки маршрута. Не забудьте фотоаппарат для незабываемых моментов!</p>

    <div class="not-prose mt-4 grid gap-3 sm:grid-cols-3">
      <a href="/services/car-rental" class="inline-flex items-center justify-center rounded-xl px-4 py-3 bg-[#007AFF] text-white">Аренда авто</a>
      <a href="/services/currency-exchange" class="inline-flex items-center justify-center rounded-xl px-4 py-3 bg-emerald-600 text-white">Обмен валюты</a>
      <a href="/phuket" class="inline-flex items-center justify-center rounded-xl px-4 py-3 bg-slate-900 text-white">Консьерж в Telegram</a>
    </div>
  </section>`;
}

(async () => {
  try {
    console.log("🔍 Получаю тур Рафтинг...");
    const p = await getProductByHandle("rafting-elephant-spa-atv");
    if (!p) throw new Error("Product not found");
    console.log("✅ Найден:", p.title);

    console.log("🔄 Применяю шаблон Пхи-Пхи...");
    const updated = await updateDescriptionHtml(p.id, raftingTemplate());
    console.log("✅ Обновлен:", updated.id);

    console.log("🎉 Готово! Тур Рафтинг приведен к шаблону Пхи-Пхи.");
  } catch (e) {
    console.error("❌ Ошибка:", e.message);
  }
})();
