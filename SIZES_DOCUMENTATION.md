# 📏 ДОКУМЕНТАЦИЯ ПО РАЗМЕРАМ (Exchange24 Style)

## 🎯 ГЛАВНОЕ ПРАВИЛО

**Размеры соответствуют Telegram Wallet/Exchange24:**
- ✅ Компактно (максимальная плотность информации)
- ✅ Читаемо (не меньше минимальных стандартов)
- ✅ Touch-friendly (минимум 44px для кнопок)

---

## 📱 СТАНДАРТЫ

### iOS/Android/Telegram минимумы:
- **iOS:** минимум 17px для body
- **Android:** минимум 16px для body
- **Telegram Mini Apps:** следуют iOS (17px)
- **НО мы используем 14px** - компромисс Exchange24 для компактности

---

## ✅ НАШИ РАЗМЕРЫ (Exchange24 Style)

### Текст:
```css
body, p, span: 14px (text-sm)     /* Компактно как Exchange24 */
h1: 18px (text-lg)                 /* Заголовки страниц */
h2: 16px (text-base)               /* Секции */
h3: 14px (text-sm)                 /* Подсекции */
captions, badges: 12px (text-xs)   /* Только для второстепенного */
```

### Элементы:
```css
Кнопки: min-h-[44px], text-sm (14px), px-3 py-2
Карточки: p-2.5 (10px) - компактно как Telegram Wallet
Иконки: w-4 h-4 (16px) или w-3.5 h-3.5 (14px) для маленьких
Input: text-sm (14px), min-h-[44px], px-3 py-2
```

### Отступы:
```css
Между секциями: space-y-2 (8px)
Внутри карточек: p-2.5 (10px)
Между элементами списка: space-y-0.5 (2px)
Gap между кнопками: gap-1.5 (6px) или gap-2 (8px)
```

---

## 📚 ГДЕ ОПРЕДЕЛЕНО

1. **`src/styles/compact-global.css`** - глобальные стили
2. **`src/styles/TELEGRAM_MINIMAL_STANDARDS.md`** - полная документация
3. **`AGENTS.md`** (строки 71-78) - правила для агентов
4. **`AI_DOCS/UI_STRUCTURE.md`** (строки 441-448) - UI спецификация

---

## ✅ ЧЕКЛИСТ

Перед коммитом проверь:
- [ ] Body текст = 14px (text-sm)
- [ ] Заголовки h2 = 16px (text-base)
- [ ] Кнопки min-h-[44px]
- [ ] Карточки p-2.5 (10px)
- [ ] Иконки w-4 h-4 (16px) или w-3.5 h-3.5 (14px)
- [ ] text-xs (12px) ТОЛЬКО для captions/badges

---

**Last Updated:** 2025-11-01  
**Status:** ✅ Актуально

