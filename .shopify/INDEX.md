# 📁 SHOPIFY ДОКУМЕНТАЦИЯ - БЫСТРАЯ НАВИГАЦИЯ

> **Вся информация по работе с Shopify CMS в одной папке!**

---

## 🚀 БЫСТРЫЙ СТАРТ

**Новый агент? Читай в этом порядке:**

1. **TOKENS.txt** (30 сек) - скопируй токены
2. **CREDENTIALS.md** (1 мин) - логин/пароль для Admin
3. **README.md** (5 мин) - основы API, примеры запросов
4. **CATEGORY_MIGRATION_GUIDE.md** (15 мин) - ПОЛНЫЙ гайд по переносу категорий

---

## 📚 ФАЙЛЫ В ЭТОЙ ПАПКЕ

### 1. **TOKENS.txt** 
**Что:** Токены для быстрого copy-paste  
**Когда:** Нужен быстрый доступ к API токенам  
**Содержит:**
- Admin API Token
- Storefront API Token

### 2. **CREDENTIALS.md**
**Что:** Логин/пароль для Shopify Admin  
**Когда:** Нужно зайти в админку вручную  
**Содержит:**
- Email
- Password
- Admin URL

### 3. **README.md**
**Что:** Основная документация по Shopify API  
**Когда:** Нужно понять как работать с API  
**Содержит:**
- Примеры API запросов
- GraphQL queries
- Product structure
- Best practices

### 4. **CATEGORY_MIGRATION_GUIDE.md** 🔥
**Что:** ПОЛНОЕ руководство по переносу категорий  
**Когда:** Переносишь категорию с phuket-insider.com  
**Содержит:**
- Пошаговая инструкция
- Шаблоны кода
- Чеклисты
- Частые ошибки
- Эталон (категория Shopping)

### 5. **CHANGELOG_V2.1.md** & **CHANGELOG_V2.2.md**
**Что:** История изменений  
**Когда:** Интересует что менялось  

### 6. **TELEGRAM_BOT_INFO.md**
**Что:** Информация о Telegram боте  
**Когда:** Работаешь с ботом  

### 7. **PHOTO_UPLOAD_GUIDE.md** 📸
**Что:** ПОЛНОЕ руководство по загрузке фото и описаний  
**Когда:** Нужно добавить фото к месту или обновить описание  
**Содержит:**
- Автоматическое скачивание фото
- Загрузка в Shopify через base64
- Генерация SEO-описаний
- Troubleshooting Trial Account
- Готовые скрипты

### 8. **AUTO_PHOTO_PARSING_GUIDE.md** 🤖 **НОВОЕ!**
**Что:** ПОЛНАЯ АВТОМАТИЗАЦИЯ парсинга фото  
**Когда:** Нужно обработать много мест быстро  
**Содержит:**
- Google Custom Search API настройка
- Автоматический поиск качественных фото
- Массовая загрузка в Shopify
- Готовые мастер-скрипты
- Troubleshooting API

---

## 🎯 ЧАСТЫЕ ЗАДАЧИ - БЫСТРЫЕ ССЫЛКИ

### Создать новый продукт (место)?
→ Читай **CATEGORY_MIGRATION_GUIDE.md** → Раздел "ЭТАП 2"

### Нужен API токен?
→ Открой **TOKENS.txt** → copy-paste

### Забыл пароль от админки?
→ Открой **CREDENTIALS.md**

### Не понимаешь GraphQL запрос?
→ Читай **README.md** → Раздел "Common Operations"

### Хочешь перенести всю категорию?
→ Читай **CATEGORY_MIGRATION_GUIDE.md** ПОЛНОСТЬЮ!

### Нужно добавить фото и описание к месту?
→ Читай **PHOTO_UPLOAD_GUIDE.md** → Запусти `auto-enhance-place.cjs`

### Нужно обработать много мест автоматически?
→ Читай **AUTO_PHOTO_PARSING_GUIDE.md** → Запусти `MASTER-auto-photo-parsing.cjs`

---

## 🏆 ЭТАЛОНЫ ДЛЯ КОПИРОВАНИЯ

### Категория "Shopping" - ГОТОВЫЙ ПРИМЕР! ✅

**Что посмотреть:**
- Файл данных: `../src/data/shopping-centers.ts`
- Скрипт загрузки: `../scripts/upload-shopping-centers-fixed.cjs`
- Скрипт публикации: `../scripts/publish-all-shopping-centers.cjs`
- Компонент карточки: `../src/components/PlaceCard.tsx`
- Детальная страница: `../src/pages/PlaceDetail.tsx`
- Страница категории: `../src/pages/CategoryPageDynamic.tsx`

**Живой пример:**
- Список: http://localhost:8080/category/shopping
- Детальная: http://localhost:8080/place/central-phuket-floresta

**Что работает:**
- ✅ 7 мест загружены
- ✅ Рейтинги, цены, часы на карточках
- ✅ Уникальные градиенты
- ✅ Фильтры по категориям и районам
- ✅ Google Maps интеграция
- ✅ Hero секции
- ✅ Sidebar с быстрой информацией
- ✅ iOS 26 дизайн везде

**Копируй этот подход для ВСЕХ категорий!**

---

## 🔑 КЛЮЧЕВЫЕ ПРАВИЛА (ВСЕГДА СЛЕДУЙ!)

### ПРАВИЛО 1: Всё через Shopify!
```
❌ НЕ создавай JSON/Markdown файлы с контентом
✅ ВСЕГДА используй Shopify Products
```

### ПРАВИЛО 2: Правильные типы и namespace!
```
productType: "place"           // НЕ "Information"!
namespace: "place_info"        // НЕ "custom"!
tag: "place"                   // ОБЯЗАТЕЛЬНО!
tag: "category:[id]"           // ОБЯЗАТЕЛЬНО!
```

### ПРАВИЛО 3: Публикация обязательна!
```
Создал продукт → СРАЗУ опубликуй в Online Store
Иначе он НЕ появится на сайте!
```

### ПРАВИЛО 4: Fallback данные!
```
Metafields НЕ видны в Storefront API →
Добавь fallback данные в PlaceCard.tsx
```

### ПРАВИЛО 5: Проверяй результат!
```
После загрузки → открой сайт
Если не видно → проверь publication status
```

---

## 💰 ROI ОТ КАЖДОЙ КАТЕГОРИИ

### Зачем переносить категории?

```
1 категория = 10-20 мест
1 место = 10-50 статей с SEO
1 статья = 100-1000 посетителей/месяц
1000 посетителей = 10-25 конверсий
25 конверсий = $3,000-7,500 revenue

ИТОГО: 1 категория = $3,000-7,500/мес 🤑

13 категорий = $39,000-97,500/мес
За год = $468,000-1,170,000 💰

ЭТО СТОИТ УСИЛИЙ! 🚀
```

---

## 🎓 ОБУЧАЮЩИЕ РЕСУРСЫ

### Документация:
- **Shopify Admin API:** https://shopify.dev/docs/api/admin-graphql
- **Shopify Storefront API:** https://shopify.dev/docs/api/storefront
- **GraphQL Basics:** https://graphql.org/learn/

### Инструменты:
- **Shopify Admin:** https://admin.shopify.com/store/phuket-telegram-shop-117ck
- **GraphQL Explorer:** В Shopify Admin → Apps → GraphiQL

### Примеры кода:
- **Этот проект:** `src/`, `scripts/`
- **Shopify Examples:** https://github.com/Shopify/shopify-api-js/examples

---

**🦄 Помни: Каждая категория приближает нас к $200M exit!**

**Last Updated:** October 26, 2025  
**Maintained by:** AI Agents Team  
**Status:** Living Document - обновляется постоянно


