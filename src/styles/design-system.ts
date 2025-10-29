/**
 * 🎨 DESIGN SYSTEM - PhuketDa
 * 
 * Философия:
 * - Perplexity AI: Минимализм, фокус на контент
 * - Steve Jobs: Каждый пиксель имеет значение
 * - iOS 26: Нативный дизайн Apple
 * - Telegram Wallet: Компактность, профессионализм
 * 
 * Правила:
 * 1. #007AFF для ВСЕХ интерактивных элементов (НИКАКИХ других цветов!)
 * 2. Lucide React иконки ТОЛЬКО (НЕТ эмодзи!)
 * 3. SF Pro шрифт (system-ui fallback)
 * 4. Glassmorphism для важных блоков
 * 5. Touch targets минимум 44px
 */

// ═══════════════════════════════════════════════════════════════
// COLORS
// ═══════════════════════════════════════════════════════════════

export const Colors = {
  // Primary (iOS Blue - ЕДИНСТВЕННЫЙ для интерактива!)
  primary: '#007AFF',
  primaryHover: '#0051D5',
  primaryActive: '#003D99',
  primaryLight: '#E5F1FF',
  
  // Status colors (только для статусов, НЕ для кнопок!)
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  info: '#5AC8FA',
  
  // Grayscale
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Semantic
  white: '#FFFFFF',
  black: '#000000',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  text: {
    primary: 'rgba(0, 0, 0, 0.85)',
    secondary: 'rgba(0, 0, 0, 0.6)',
    tertiary: 'rgba(0, 0, 0, 0.4)',
    disabled: 'rgba(0, 0, 0, 0.25)',
    inverse: '#FFFFFF',
  }
} as const;

// ═══════════════════════════════════════════════════════════════
// SPACING (8px базовая сетка)
// ═══════════════════════════════════════════════════════════════

export const Spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
} as const;

// ═══════════════════════════════════════════════════════════════
// BORDER RADIUS (iOS 26 стиль)
// ═══════════════════════════════════════════════════════════════

export const BorderRadius = {
  none: '0',
  sm: '0.5rem',   // 8px
  md: '0.75rem',  // 12px
  lg: '1rem',     // 16px
  xl: '1.5rem',   // 24px
  full: '9999px',
} as const;

// ═══════════════════════════════════════════════════════════════
// SHADOWS (мягкие, iOS 26)
// ═══════════════════════════════════════════════════════════════

export const Shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  card: '0 2px 8px rgba(0, 0, 0, 0.08)',
  elevated: '0 8px 30px rgba(0, 0, 0, 0.12)',
} as const;

// ═══════════════════════════════════════════════════════════════
// TYPOGRAPHY
// ═══════════════════════════════════════════════════════════════

export const Typography = {
  // Font Family (SF Pro → system-ui fallback)
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  
  // Font Sizes
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
  },
  
  // Font Weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Line Heights
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
  
  // Letter Spacing
  letterSpacing: {
    tight: '-0.01em',
    normal: '0',
    wide: '0.01em',
  },
  
  // Готовые стили для текста
  styles: {
    h1: 'text-2xl font-bold leading-tight tracking-tight',
    h2: 'text-xl font-semibold leading-tight tracking-tight',
    h3: 'text-lg font-semibold leading-snug',
    body: 'text-base font-normal leading-relaxed',
    bodyLarge: 'text-lg font-normal leading-relaxed',
    bodySmall: 'text-sm font-normal leading-normal',
    caption: 'text-sm text-gray-500 leading-normal',
    tiny: 'text-xs text-gray-400',
    button: 'text-base font-semibold leading-none',
  }
} as const;

// ═══════════════════════════════════════════════════════════════
// COMPONENTS (готовые стили)
// ═══════════════════════════════════════════════════════════════

export const Components = {
  // BUTTONS
  button: {
    // Primary (ОСНОВНАЯ кнопка - #007AFF ТОЛЬКО!)
    primary: 'bg-[#007AFF] text-white h-11 px-6 rounded-xl font-semibold hover:bg-[#0051D5] active:bg-[#003D99] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
    
    // Secondary (серая)
    secondary: 'bg-gray-100 text-gray-900 h-11 px-6 rounded-xl font-semibold hover:bg-gray-200 active:bg-gray-300 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
    
    // Ghost (прозрачная с #007AFF текстом)
    ghost: 'text-[#007AFF] h-11 px-6 rounded-xl font-semibold hover:bg-blue-50 active:bg-blue-100 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
    
    // Outline (#007AFF border)
    outline: 'border-2 border-[#007AFF] text-[#007AFF] bg-white h-11 px-6 rounded-xl font-semibold hover:bg-blue-50 active:bg-blue-100 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
    
    // Danger (только для деструктивных действий!)
    danger: 'bg-red-500 text-white h-11 px-6 rounded-xl font-semibold hover:bg-red-600 active:bg-red-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
    
    // Icon button (квадратная)
    icon: 'w-11 h-11 rounded-xl flex items-center justify-center text-[#007AFF] hover:bg-blue-50 active:bg-blue-100 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
  },
  
  // CARDS
  card: {
    // Default (белая с тенью)
    default: 'bg-white rounded-2xl p-4 shadow-card border border-gray-100',
    
    // Glass (glassmorphism)
    glass: 'bg-white/70 backdrop-blur-md backdrop-saturate-180 rounded-2xl p-4 shadow-card border border-gray-100',
    
    // Elevated (приподнятая)
    elevated: 'bg-white rounded-2xl p-6 shadow-elevated border border-gray-100',
    
    // Flat (без тени)
    flat: 'bg-white rounded-2xl p-4 border border-gray-100',
    
    // Interactive (кликабельная)
    interactive: 'bg-white rounded-2xl p-4 shadow-card border border-gray-100 hover:shadow-lg hover:border-[#007AFF]/20 active:scale-[0.98] transition-all duration-150 cursor-pointer',
  },
  
  // INPUTS
  input: {
    // Default input
    default: 'h-11 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#007AFF] focus:ring-2 focus:ring-blue-50 outline-none transition-colors duration-150 disabled:bg-gray-50 disabled:cursor-not-allowed',
    
    // With icon
    withIcon: 'h-11 pl-11 pr-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#007AFF] focus:ring-2 focus:ring-blue-50 outline-none transition-colors duration-150',
    
    // Textarea
    textarea: 'px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#007AFF] focus:ring-2 focus:ring-blue-50 outline-none transition-colors duration-150 resize-none disabled:bg-gray-50 disabled:cursor-not-allowed',
  },
  
  // BADGES
  badge: {
    // Base
    base: 'px-2 py-1 rounded-lg text-xs font-medium inline-flex items-center gap-1',
    
    // Primary
    primary: 'bg-blue-50 text-[#007AFF]',
    
    // Success
    success: 'bg-green-50 text-green-600',
    
    // Warning
    warning: 'bg-orange-50 text-orange-600',
    
    // Danger
    danger: 'bg-red-50 text-red-600',
    
    // Gray
    gray: 'bg-gray-100 text-gray-600',
  },
  
  // CHIPS (для фильтров)
  chip: {
    // Inactive
    inactive: 'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium bg-white/70 backdrop-blur-md text-gray-700 border border-gray-200 hover:border-[#007AFF]/50 transition-all duration-200 cursor-pointer',
    
    // Active
    active: 'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium bg-[#007AFF] text-white shadow-md transition-all duration-200 cursor-pointer',
  },
  
  // LIST ITEMS (Telegram Wallet style)
  listItem: {
    // Default
    default: 'flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0',
    
    // With icon
    withIcon: 'flex items-center gap-3 p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0',
    
    // Clickable
    clickable: 'flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer',
  },
  
  // ICON CONTAINERS
  iconContainer: {
    // Small (для списков)
    sm: 'w-10 h-10 rounded-xl flex items-center justify-center',
    
    // Medium
    md: 'w-12 h-12 rounded-xl flex items-center justify-center',
    
    // Large
    lg: 'w-16 h-16 rounded-2xl flex items-center justify-center',
    
    // Colors
    primary: 'bg-blue-50',
    success: 'bg-green-50',
    warning: 'bg-orange-50',
    danger: 'bg-red-50',
    purple: 'bg-purple-50',
    gray: 'bg-gray-100',
  },
} as const;

// ═══════════════════════════════════════════════════════════════
// BREAKPOINTS (responsive)
// ═══════════════════════════════════════════════════════════════

export const Breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ═══════════════════════════════════════════════════════════════
// TOUCH TARGETS (iOS HIG минимумы)
// ═══════════════════════════════════════════════════════════════

export const TouchTargets = {
  min: '44px',  // Минимальный размер touch target
  recommended: '48px',  // Рекомендуемый
} as const;

// ═══════════════════════════════════════════════════════════════
// Z-INDEX (слои)
// ═══════════════════════════════════════════════════════════════

export const ZIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  toast: 70,
} as const;

// ═══════════════════════════════════════════════════════════════
// HELPER ФУНКЦИИ
// ═══════════════════════════════════════════════════════════════

/**
 * Объединить классы (с проверкой)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Получить полный стиль кнопки
 */
export function getButtonClass(variant: keyof typeof Components.button = 'primary', className?: string): string {
  return cn(Components.button[variant], className);
}

/**
 * Получить полный стиль карточки
 */
export function getCardClass(variant: keyof typeof Components.card = 'default', className?: string): string {
  return cn(Components.card[variant], className);
}

/**
 * Получить стиль иконки контейнера
 */
export function getIconContainerClass(
  size: 'sm' | 'md' | 'lg' = 'md',
  color: 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'gray' = 'primary',
  className?: string
): string {
  return cn(Components.iconContainer[size], Components.iconContainer[color], className);
}

// ═══════════════════════════════════════════════════════════════
// EXPORT ALL
// ═══════════════════════════════════════════════════════════════

export const DesignSystem = {
  Colors,
  Spacing,
  BorderRadius,
  Shadows,
  Typography,
  Components,
  Breakpoints,
  TouchTargets,
  ZIndex,
  // Helpers
  cn,
  getButtonClass,
  getCardClass,
  getIconContainerClass,
} as const;

export default DesignSystem;

