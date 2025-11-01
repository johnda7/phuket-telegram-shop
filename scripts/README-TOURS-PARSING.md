# 📦 ИНСТРУКЦИЯ: Парсинг туров из репозитория island-travel-echo-clone

## 🎯 Цель

Загрузить все оставшиеся туры из репозитория https://github.com/johnda7/island-travel-echo-clone в наш Shopify по нашему шаблону.

## 📊 Текущая ситуация

**Уже есть в Shopify (5 туров):**
1. ✅ РАФТИНГ + СЛОНОВЬЕ СПА + ATV
2. ✅ КАО ЛАК SAFARI  
3. ✅ 11 ОСТРОВОВ МЕГА-ТУР
4. ✅ Аватар Плюс
5. ✅ Пхи-Пхи 2 дня/1 ночь

**Найдено в репозитории (18+ туров):**
- Avatar Plus Hangdong
- Cheo Lan Lake
- Dostoprimechatelnosti Phuketa (Достопримечательности Пхукета)
- Eleven Islands Mega
- Eleven Islands Standard
- Fishing Sunrise
- Five Pearls 2 Days
- James Bond Island ⭐
- Kao Lak Safari
- Krabi Secrets
- Pearls Andaman Sea (4 жемчужины) ⭐
- Phang Nga Samet
- Phang Nga Skywalk
- Phi Phi 2 Days 1 Night (уже есть)
- Phi Phi Sunrise
- Racha Coral Islands ⭐
- Racha Coral Rawai
- Racha Coral Sunrise
- Similan Islands (несколько вариантов) ⭐
- Rafting Spa 1 Day (уже есть)
- Rafting Spa Atv Tour (уже есть)

## 🚀 ДВА СПОСОБА ЗАГРУЗКИ

### Способ 1: Через GitHub API (быстро, но есть rate limits)

```bash
# 1. Проверка какие туры нужно загрузить (DRY-RUN)
node scripts/fetch-tours-from-github.cjs

# 2. Реальная загрузка в Shopify
node scripts/fetch-tours-from-github.cjs --apply
```

**Ограничения:**
- Rate limit GitHub API: 60 запросов/час без авторизации
- Может не успеть обработать все туры за один раз
- Нужно ждать 1 час между запусками или использовать GitHub token

### Способ 2: Локальный клон (рекомендуется) ⭐

```bash
# 1. Клонируем репозиторий в соседнюю папку
cd ..
git clone https://github.com/johnda7/island-travel-echo-clone.git
cd phuket-telegram-shop

# 2. Проверка какие туры нужно загрузить (DRY-RUN)
node scripts/parse-tours-from-island-repo.cjs

# 3. Если путь к репозиторию другой, укажите его:
node scripts/parse-tours-from-island-repo.cjs --repo-path=/path/to/island-travel-echo-clone

# 4. Реальная загрузка в Shopify
node scripts/parse-tours-from-island-repo.cjs --apply
```

**Преимущества:**
- ✅ Нет ограничений по rate limit
- ✅ Быстрее работает
- ✅ Можно редактировать данные перед загрузкой
- ✅ Полный доступ ко всем файлам и фотографиям

## 📋 ЧТО ДЕЛАЕТ СКРИПТ

1. **Проверяет существующие туры** в Shopify (по handle)
2. **Находит туры в репозитории** (TSX файлы в `src/pages/`)
3. **Парсит данные туров:**
   - Название (title)
   - Описание (description)
   - Цены (priceAdult, priceChild)
   - Длительность (duration)
   - Теги (tags)
4. **Фильтрует** - оставляет только туры, которых нет в Shopify
5. **Создает продукты** в Shopify с:
   - `productType: "Excursions"`
   - Тег `"tour"` + дополнительные теги
   - Варианты цен (взрослый, детский)
   - Премиум описание в HTML
6. **Публикует** продукты автоматически

## 🎨 ФОРМАТ ЗАГРУЗКИ

Каждый тур загружается с нашим премиум шаблоном:

```html
<h1>Название тура</h1>
<p><strong>🎯 О туре:</strong><br>Описание...</p>
<p><strong>⏱️ Длительность:</strong> 1 день</p>
<h2>✨ Что входит</h2>
<ul>
  <li>✓ Профессиональный русскоязычный гид</li>
  <li>✓ Трансфер из отеля и обратно</li>
  ...
</ul>
<h2>🎯 Забронировать тур</h2>
<p>Напишите нам в <a href="https://t.me/PHUKETDABOT">Telegram</a>!</p>
```

## ⚠️ ВАЖНО

1. **Handle генерируется автоматически** из названия (латиница, без эмодзи)
2. **Цены в батах (฿)** - если не указаны, используются дефолтные:
   - Пхи-Пхи 2 дня: 4500 ฿
   - James Bond: 1400 ฿
   - Симиланские: 2500 ฿
   - И т.д.
3. **Теги определяются автоматически** по имени файла:
   - `PhiPhi2Days1Night` → `islands`, `phi-phi`, `2-days`, `popular`
   - `SimilanIslands` → `islands`, `similan`, `snorkeling`, `diving`
   - `JamesBondIsland` → `islands`, `james-bond`, `phang-nga`, `popular`
4. **Пауза между запросами:** 1.5 секунды (чтобы не превысить rate limit Shopify)

## 🔍 ПРИОРИТЕТНЫЕ ТУРЫ ДЛЯ ЗАГРУЗКИ

**Топ-5 туров которые нужно загрузить первыми:**

1. ⭐ **James Bond Island** - популярный тур
2. ⭐ **4 Pearls Andaman Sea** - премиум тур
3. ⭐ **Similan Islands** - дайвинг и снорклинг
4. ⭐ **Racha Coral Islands** - близко к Пхукету
5. **Phi Phi Sunrise** - альтернатива 2-дневному туру

**После загрузки первых 5:**
- Eleven Islands Standard
- Racha Coral Rawai
- Racha Coral Sunrise
- Phang Nga Skywalk
- Krabi Secrets

## ✅ ПРОВЕРКА ПОСЛЕ ЗАГРУЗКИ

```bash
# Проверяем список всех туров в Shopify
node scripts/check-tours.cjs

# Или проверяем в браузере
npm run dev
# Откройте http://localhost:8080/phuket
```

## 🐛 ОБРАБОТКА ОШИБОК

**Если скрипт не может найти репозиторий:**
```
❌ Репозиторий не найден: /path/to/repo
```
Решение: Укажите правильный путь через `--repo-path=...`

**Если rate limit GitHub API:**
```
❌ API rate limit exceeded
```
Решение: Используйте локальный клон (Способ 2)

**Если ошибки создания в Shopify:**
```
❌ Ошибки создания: [{"field": "...", "message": "..."}]
```
Решение: Проверьте что handle уникален и соответствует правилам (латиница, без спецсимволов)

## 📝 ЛОГИ

Скрипт выводит подробные логи:
- 🔍 Что ищет
- 📝 Что находит
- ✅ Что успешно создает
- ❌ Что не удалось создать

Для сохранения логов:
```bash
node scripts/fetch-tours-from-github.cjs --apply 2>&1 | tee tours-upload.log
```

## 🎯 СЛЕДУЮЩИЕ ШАГИ

После загрузки туров:

1. **Проверьте в браузере** - все туры должны отображаться
2. **Обновите описания** - добавьте больше деталей через Shopify Admin
3. **Загрузите фотографии** - используйте `scripts/upload-photos.cjs`
4. **Добавьте metafields** - длительность, расписание через `scripts/add-metafields.cjs`

---

**Создано:** 2025-01-XX  
**Автор:** AI Agent  
**Версия:** 1.0

