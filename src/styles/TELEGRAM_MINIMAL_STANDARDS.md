# 📏 СТАНДАРТЫ РАЗМЕРОВ ДЛЯ TELEGRAM MINI APPS

## 🎯 ГЛАВНОЕ ПРАВИЛО

**Компактность ≠ Мелкий текст!**

Мы делаем Telegram WebApp, который должен быть:
- ✅ **Компактным** (как Exchange24)
- ✅ **Читаемым** (стандарты iOS/Android/Telegram)
- ✅ **Touch-friendly** (минимум 44px для кнопок)

---

## 📱 СТАНДАРТЫ МОБИЛЬНЫХ ПЛАТФОРМ

### iOS (Apple Human Interface Guidelines):
- **Body текст:** Минимум **17px** для комфортного чтения
- **Secondary текст:** 15px
- **Captions:** 12-13px
- **Touch targets:** Минимум **44x44 pt**

### Android (Material Design):
- **Body текст:** Минимум **16px** (14sp)
- **Secondary текст:** 14px
- **Captions:** 12px
- **Touch targets:** Минимум **48x48 dp** (44px на большинстве экранов)

### Telegram Mini Apps:
- Следуют **iOS стандартам** (17px для body)
- Но допускают **15px** для компактных приложений (компромисс)
- **Иконки:** 16px (w-4 h-4) - стандарт
- **Touch targets:** 44px минимум

---

## ✅ НАШИ СТАНДАРТЫ (КОМПРОМИСС)

### Размеры текста (Exchange24 Style):
```css
body, p, span, div: 14px (text-sm)  /* Компактно как Exchange24, но читаемо */
h1: 18px (text-lg)                  /* Заголовки страниц */
h2: 16px (text-base)                 /* Секции */
h3: 14px (text-sm)                   /* Подсекции */
captions, badges: 12px (text-xs)     /* Только для второстепенного */
```

### Размеры элементов (Exchange24 Style):
```css
Кнопки: min-h-[44px], text-sm (14px), px-3 py-2
Карточки: p-2.5 (10px padding) - компактно как Telegram Wallet
Иконки: w-4 h-4 (16px)
Input поля: text-sm (14px), min-h-[44px]
```

### Отступы:
```css
Между секциями: space-y-2 (8px)
Внутри карточек: p-3 (12px)
Между элементами списка: space-y-1 (4px)
```

---

## ❌ ЧТО НЕ ДЕЛАТЬ

❌ **НЕ использовать text-xs (12px) для основного текста!**
- 12px слишком мелко для body на мобильных
- Можно ТОЛЬКО для captions, badges, metadata

❌ **НЕ уменьшать padding меньше p-3 (12px) для карточек!**
- Слишком тесно выглядит
- Плохая читаемость

❌ **НЕ делать кнопки меньше 44px по высоте!**
- Нарушает accessibility стандарты
- Плохой UX на мобильных

❌ **НЕ использовать текст меньше 14px в body!**
- iOS/Android стандарт: минимум 16-17px
- 14px - это компромисс Exchange24 для максимальной компактности (но все еще читаемо)

---

## ✅ ЧТО ДЕЛАТЬ

✅ **Использовать text-sm (14px) для body**
- Компактно как Exchange24/Telegram Wallet
- Читаемо для большинства пользователей
- Компромисс между плотностью и читаемостью

✅ **Использовать text-base (16px) для заголовков секций**
- Хорошая иерархия
- Читаемо на всех устройствах

✅ **Использовать p-3 (12px) для padding карточек**
- Комфортное пространство
- Не слишком тесно

✅ **Использовать min-h-[44px] для всех кнопок**
- Touch-friendly
- Соответствует стандартам accessibility

✅ **Использовать w-4 h-4 (16px) для иконок**
- Стандарт для Telegram Mini Apps
- Хорошо видно на всех экранах

---

## 🔍 ПРОВЕРКА

Перед коммитом проверь:

1. ✅ Все кнопки имеют `min-h-[44px]`?
2. ✅ Body текст НЕ меньше 14px (text-sm)?
3. ✅ Заголовки h2 НЕ меньше 16px (text-base)?
4. ✅ Padding карточек p-2.5 (10px) - компактно как Exchange24?
5. ✅ Иконки w-4 h-4 (16px) или w-3.5 h-3.5 для маленьких?
6. ✅ text-xs (12px) ТОЛЬКО для captions/badges?

---

## 📚 ИСТОЧНИКИ

- **iOS Human Interface Guidelines:** https://developer.apple.com/design/human-interface-guidelines/
- **Android Material Design:** https://material.io/design
- **Telegram Mini Apps:** https://core.telegram.org/bots/webapps
- **WCAG 2.1:** Минимум 16px для body текста

---

**Last Updated:** 2025-11-01  
**Status:** ✅ Актуальные стандарты

