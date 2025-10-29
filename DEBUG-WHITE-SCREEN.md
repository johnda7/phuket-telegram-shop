# 🔍 ДИАГНОСТИКА БЕЛОГО ЭКРАНА

## ✅ ЧТО Я ПРОВЕРИЛ:

### 1. Все экспорты правильные:
- ✅ `src/config/categories.ts` - `getCategoryConfig`, `categoryExists`, `getCategoryNameInRussian`
- ✅ `src/config/services.ts` - `getAllServices`
- ✅ `src/styles/design-system.ts` - `cn`, `getButtonClass`, `getCardClass`
- ✅ `src/lib/shopify.ts` - `fetchProductsByCategory`

### 2. Все импорты правильные:
- ✅ `CategoryPageDynamic.tsx` - все импорты корректны
- ✅ `PlaceDetail.tsx` - исправлен импорт `getCategoryNameInRussian`
- ✅ `Index.tsx` - использует `getAllServices`

### 3. Сервер работает:
- ✅ `http://localhost:8080` возвращает HTML
- ✅ Vite dev server запущен
- ✅ Нет ошибок компиляции

---

## 🚨 ВОЗМОЖНЫЕ ПРИЧИНЫ БЕЛОГО ЭКРАНА:

### 1. **КЕШ БРАУЗЕРА** (самое вероятное!)
**Решение:**
1. Открой Developer Tools (F12 / Cmd+Option+I)
2. Правой кнопкой на кнопке обновления → "Empty Cache and Hard Reload"
3. ИЛИ: Cmd+Shift+R (macOS) / Ctrl+Shift+R (Windows)

### 2. **JavaScript ошибка в Runtime**
**Как проверить:**
1. F12 → Console
2. Обнови страницу
3. Посмотри красные ошибки

**Типичные ошибки:**
- `Cannot read property 'map' of undefined` - данные не загрузились
- `X is not a function` - функция не экспортируется
- `Failed to fetch` - проблема с API

### 3. **React Hot Module Replacement (HMR) глюк**
**Решение:**
1. Перезапусти сервер: `npm run dev`
2. Обнови браузер с очисткой кеша

### 4. **Данные из Shopify не загружаются**
**Проверить:**
1. Открой Network tab (F12)
2. Ищи запросы к Shopify API
3. Посмотри статус (200 OK = хорошо, 4xx/5xx = плохо)

---

## 📋 ЧТО НУЖНО ОТ ТЕБЯ:

**Открой Developer Tools и скажи:**

1. **В Console (вкладка):**
   - Есть ли красные ошибки? Какой текст?
   - Есть ли желтые предупреждения?

2. **В Network (вкладка):**
   - Загружаются ли файлы JS? (ищи `CategoryPageDynamic`)
   - Есть ли запросы к Shopify? Статус?

3. **На экране:**
   - Полностью белый?
   - Есть header/navigation?
   - Есть лоадер (крутящийся кружок)?
   - Есть footer?

---

## 🔧 БЫСТРЫЕ ФИКСЫ:

### ЕСЛИ видишь лоадер бесконечно:
→ Проблема с Shopify API (токен/permissions)

### ЕСЛИ полностью белый экран БЕЗ лоадера:
→ JavaScript ошибка при рендере (смотри Console!)

### ЕСЛИ есть header, но нет контента:
→ Данные не загружаются из Shopify

### ЕСЛИ ошибка "Cannot find module":
→ Неправильный импорт (но я проверил - всё ок!)

---

## 💡 АЛЬТЕРНАТИВА:

**Если совсем не работает, попробуй другую категорию:**
- http://localhost:8080/category/aquaparks
- http://localhost:8080/place/central-phuket-floresta
- http://localhost:8080

**Если ВСЕ страницы белые:**
→ Глобальная проблема (скорее всего кеш!)

**Если только /category/shopping белая:**
→ Проблема в данных этой категории

---

**СКАЖИ МНЕ ЧТО ВИДИШЬ - Я СРАЗУ ИСПРАВЛЮ! 🚀**

