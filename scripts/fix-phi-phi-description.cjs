#!/usr/bin/env node
// Исправляет описаниеHtml тура Пхи‑Пхи премиальным шаблоном

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

function template() {
  return `<section class="prose prose-lg max-w-none">
    <h1>Пхи‑Пхи 2 дня / 1 ночь — лучший островной трип</h1>
    <p>Двухдневное путешествие по архипелагу Пхи‑Пхи с ночевкой в отеле: Майя Бэй, снорклинг в лагунах, фотоспоты и прозрачная вода Андаманского моря.</p>

    <h2>Что включено</h2>
    <ul>
      <li>Скоростной катер + лицензированный капитан</li>
      <li>Проживание в 3★ отеле (1 ночь) — двухместное размещение</li>
      <li>Питание: завтрак, 2 обеда, ужин</li>
      <li>Снаряжение для снорклинга, спасжилеты</li>
      <li>Русскоязычный гид, страховка, питьевая вода</li>
      <li>Трансфер от/до отеля на Пхукете</li>
    </ul>

    <h2>Программа</h2>
    <h3>День 1</h3>
    <ol>
      <li>08:00 — выезд из отеля, причал</li>
      <li>10:00 — Пхи‑Пхи Дон, заселение, пляж Лох Далам</li>
      <li>Снорклинг у рифов, закат у скал</li>
      <li>Ужин и прогулка по набережной</li>
    </ol>
    <h3>День 2</h3>
    <ol>
      <li>08:00 — завтрак</li>
      <li>Майя Бэй, Пиле Лагун, Пещера Викингов</li>
      <li>Снорклинг в бирюзовых лагунах</li>
      <li>15:00 — обратный путь на Пхукет</li>
    </ol>

    <h2>Не включено</h2>
    <ul>
      <li>Личные расходы, напитки в ресторанах</li>
      <li>Нац.парк (взрослый 400 ฿, ребенок 200 ฿)</li>
    </ul>

    <h2>Полезно знать</h2>
    <p>Дети 4+; возьмите купальник, солнцезащитный крем и полотенце. Возможны погодные корректировки маршрута для вашей безопасности.</p>

    <div class="not-prose mt-4 grid gap-3 sm:grid-cols-3">
      <a href="/services/car-rental" class="inline-flex items-center justify-center rounded-xl px-4 py-3 bg-[#007AFF] text-white">Аренда авто</a>
      <a href="/services/currency-exchange" class="inline-flex items-center justify-center rounded-xl px-4 py-3 bg-emerald-600 text-white">Обмен валюты</a>
      <a href="/phuket" class="inline-flex items-center justify-center rounded-xl px-4 py-3 bg-slate-900 text-white">Консьерж в Telegram</a>
    </div>
  </section>`;
}

(async () => {
  try {
    console.log("🔍 Получаю тур Пхи-Пхи...");
    const p = await getProductByHandle("phi-phi-2-days-1-night");
    if (!p) throw new Error("Product not found");
    console.log("✅ Найден:", p.title);

    console.log("🔄 Обновляю описание...");
    const updated = await updateDescriptionHtml(p.id, template());
    console.log("✅ Обновлен:", updated.id);

    console.log("🎉 Готово! Обновите страницу в браузере.");
  } catch (e) {
    console.error("❌ Ошибка:", e.message);
  }
})();
