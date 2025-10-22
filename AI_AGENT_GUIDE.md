# 🤖 Instructions for AI Agents

Привет, AI Agent! Если ты работаешь над этим проектом, вот что нужно знать:

## 📂 Где найти Shopify доступы?

**Все credentials и инструкции в папке:**
```
.shopify/
├── README.md          # Полная документация по Shopify API
├── CREDENTIALS.md     # Быстрый доступ к логинам и токенам
└── .env.example       # Пример environment variables
```

> ⚠️ **Важно:** Папка `.shopify/` в `.gitignore` - эти файлы НЕ попадут в git!

## 🔑 Быстрый доступ

### Shopify Admin
- URL: https://admin.shopify.com/store/phuket-telegram-shop-117ck
- Credentials: см. `.shopify/CREDENTIALS.md`

### API Токены
- **Storefront API:** для чтения продуктов (публичный)
- **Admin API:** для управления магазином (приватный, полный доступ)

Токены в файле: `.shopify/CREDENTIALS.md`

## 📋 Типичные задачи

### 1. Создать новый тур
```bash
# Используй Admin API GraphQL mutation productCreate
# Пример в .shopify/README.md раздел "Create Product with Variants"
```

### 2. Изменить handle продукта
```bash
# Используй Admin API GraphQL mutation productUpdate
# Пример в .shopify/README.md раздел "Update Product"
```

### 3. Удалить продукт
```bash
# Используй Admin API GraphQL mutation productDelete
# Пример в .shopify/README.md раздел "Delete Product"
```

### 4. Получить список продуктов
```bash
# Используй Storefront API для фронтенда
# Используй Admin API для бэкенда
# Примеры в .shopify/README.md
```

## 🏗️ Структура проекта

```
src/
├── lib/shopify.ts          # Shopify API клиент (Storefront API)
├── pages/
│   ├── Tours.tsx           # Страница туров (фильтр: tag="tour")
│   ├── Insider.tsx         # Phuket Insider (фильтр: tag="info")
│   └── ProductDetail.tsx   # Детальная страница продукта
└── stores/
    └── cartStore.ts        # Zustand store для корзины
```

## 🎯 Product Types

### Tours (Туры)
- `productType: "Excursions"`
- `tags: ["tour", "islands", "2-days", ...]`
- Варианты: "Взрослый" ($120), "Детский (4-11 лет)" ($90)

### Phuket Insider (Информация)
- `productType: "Information"`
- `tags: ["info", "insider", "temples", "beaches", ...]`
- Вариант: "Default" ($0)

## 🚀 Dev Server

```bash
npm install    # Установить зависимости
npm run dev    # Запустить dev-сервер (http://localhost:8080)
npm run build  # Собрать production
```

## ⚠️ Важные правила

1. ✅ **Всегда используй Admin API для изменений** (создание/редактирование/удаление)
2. ✅ **Handle должен быть латиницей** (без эмодзи, пробелов, спецсимволов)
3. ✅ **Проставляй теги:** `tour` для туров, `info` для статей
4. ✅ **Проверяй изменения через Storefront API** (что видит сайт)
5. ❌ **Не коммить credentials в git** (они в `.gitignore`)

## 📚 Документация

- **Shopify GraphQL Admin API:** https://shopify.dev/docs/api/admin-graphql
- **Shopify Storefront API:** https://shopify.dev/docs/api/storefront
- **Локальная документация:** `.shopify/README.md`

## 🆘 Если что-то сломалось

1. Проверь токены в `.shopify/CREDENTIALS.md`
2. Протестируй API через curl (команды в `.shopify/README.md`)
3. Проверь логи dev-сервера (`npm run dev`)
4. Проверь Shopify Admin: https://admin.shopify.com/store/phuket-telegram-shop-117ck

---

**Удачи в разработке!** 🚀

*Last updated: October 22, 2025*
