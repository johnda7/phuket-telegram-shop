// Fallback описания для туров
// Используется когда Storefront API не может получить metafields

export const tourDescriptions: Record<string, string> = {
  // Emoji handle variant (target product with correct photos)
  '🏝️-пхи-пхи-2-дня-1-ночь': `
<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl mb-6">
  <h1 class="text-2xl font-bold mb-2">🏝️ Пхи-Пхи 2 дня/1 ночь</h1>
  <p class="text-lg opacity-90">Лучший тур Пхукета!</p>
</div>

<div class="space-y-6">
  <!-- Краткое описание -->
  <div class="bg-gray-50 p-4 rounded-lg">
    <p class="text-gray-700 leading-relaxed">Острова Пхи-Пхи — архипелаг из 6 островов с лазурной водой и белыми пляжами. Двухдневная экскурсия с ночёвкой позволит насладиться всеми красотами этого райского уголка.</p>
  </div>

  <!-- Ключевые моменты -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
    <div class="bg-blue-50 p-3 rounded-lg text-center">
      <div class="text-2xl mb-1">🎬</div>
      <div class="text-xs font-medium text-blue-800">Майя Бэй</div>
    </div>
    <div class="bg-green-50 p-3 rounded-lg text-center">
      <div class="text-2xl mb-1">🤿</div>
      <div class="text-xs font-medium text-green-800">Снорклинг</div>
    </div>
    <div class="bg-purple-50 p-3 rounded-lg text-center">
      <div class="text-2xl mb-1">🏖️</div>
      <div class="text-xs font-medium text-purple-800">Пляжи</div>
    </div>
    <div class="bg-orange-50 p-3 rounded-lg text-center">
      <div class="text-2xl mb-1">🌅</div>
      <div class="text-xs font-medium text-orange-800">Панорамы</div>
    </div>
  </div>

  <!-- Что входит (компактно) -->
  <div class="bg-gray-50 p-4 rounded-lg">
    <h3 class="font-semibold text-gray-800 mb-3">✅ Что входит в тур</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
      <div class="flex items-center space-x-2">
        <span class="text-green-500">✓</span>
        <span class="text-gray-700">Скоростной катер + отель</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-green-500">✓</span>
        <span class="text-gray-700">3-разовое питание</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-green-500">✓</span>
        <span class="text-gray-700">Снорклинг + маски</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-green-500">✓</span>
        <span class="text-gray-700">Русский гид + страховка</span>
      </div>
    </div>
  </div>

  <!-- Программа (свернутая) -->
  <div class="space-y-3">
    <h3 class="font-semibold text-gray-800">📅 Программа тура</h3>
    
    <div class="bg-blue-50 p-3 rounded-lg">
      <div class="font-medium text-blue-800 mb-2">День 1: Пхукет → Пхи-Пхи</div>
      <div class="text-sm text-gray-700 space-y-1">
        <div>06:50 Выезд → 09:50 Майя Бэй → 10:50 Лагуна Пиле → 14:20 Обед → 20:30 Огненное шоу</div>
      </div>
    </div>

    <div class="bg-green-50 p-3 rounded-lg">
      <div class="font-medium text-green-800 mb-2">День 2: Пхи-Пхи → Пхукет</div>
      <div class="text-sm text-gray-700 space-y-1">
        <div>07:00 Завтрак → 10:30 Смотровая площадка → 15:30 Снорклинг → 17:00 Возвращение</div>
      </div>
    </div>
  </div>

  <!-- Важная информация (компактно) -->
  <div class="bg-yellow-50 p-4 rounded-lg">
    <h3 class="font-semibold text-yellow-800 mb-2">⚠️ Важно знать</h3>
    <div class="text-sm text-gray-700 space-y-1">
      <div>• Программа может изменяться в зависимости от погодных условий</div>
      <div>• Вход на смотровую площадку: 50 бат (не включено)</div>
      <div>• Что взять: купальник, солнцезащитный крем, головной убор</div>
    </div>
  </div>
</div>
  `,
  // Legacy latin handle mapping for safety
  'phi-phi-2-days-1-night': `
<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl mb-6">
  <h1 class="text-2xl font-bold mb-2">🏝️ Пхи-Пхи 2 дня/1 ночь</h1>
  <p class="text-lg opacity-90">Лучший тур Пхукета!</p>
</div>

<div class="space-y-6">
  <div>
    <h2 class="text-xl font-semibold mb-3 text-gray-800">✨ Что вас ждёт</h2>
    <p class="text-gray-700 leading-relaxed">Острова Пхи-Пхи — это архипелаг из 6 островов с лазурной водой и белыми песчаными пляжами. Двухдневная экскурсия с ночёвкой позволит в полной мере насладиться всеми красотами этого райского уголка.</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="bg-blue-50 p-4 rounded-lg">
      <h3 class="font-semibold text-blue-800 mb-2">🎬 Майя Бэй</h3>
      <p class="text-sm text-blue-700">Знаменитая бухта из фильма "Пляж" с Леонардо Ди Каприо</p>
    </div>
    <div class="bg-green-50 p-4 rounded-lg">
      <h3 class="font-semibold text-green-800 mb-2">🤿 Снорклинг</h3>
      <p class="text-sm text-green-700">Кристально чистая вода и богатый подводный мир</p>
    </div>
    <div class="bg-purple-50 p-4 rounded-lg">
      <h3 class="font-semibold text-purple-800 mb-2">🏖️ Пляжи</h3>
      <p class="text-sm text-purple-700">Белоснежные пляжи и изумрудные лагуны</p>
    </div>
    <div class="bg-orange-50 p-4 rounded-lg">
      <h3 class="font-semibold text-orange-800 mb-2">🌅 Панорамы</h3>
      <p class="text-sm text-orange-700">Незабываемые виды с обзорных площадок</p>
    </div>
  </div>
</div>

  <div class="bg-gray-50 p-6 rounded-xl">
    <h2 class="text-xl font-semibold mb-4 text-gray-800">🎯 Что входит в тур</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div class="flex items-center space-x-2">
        <span class="text-green-500">✓</span>
        <span class="text-gray-700">Скоростной катер с кондиционером</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-green-500">✓</span>
        <span class="text-gray-700">Ночлег в 3-звездочном отеле</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-green-500">✓</span>
        <span class="text-gray-700">3-разовое питание</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-green-500">✓</span>
        <span class="text-gray-700">Снорклинг с маской и трубкой</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-green-500">✓</span>
        <span class="text-gray-700">Посещение 6 островов</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-green-500">✓</span>
        <span class="text-gray-700">Русскоговорящий гид</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-green-500">✓</span>
        <span class="text-gray-700">Страховка на весь тур</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-green-500">✓</span>
        <span class="text-gray-700">Спасательные жилеты</span>
      </div>
    </div>
  </div>

  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-gray-800">📅 Программа тура</h2>
    
    <div class="bg-blue-50 p-4 rounded-lg">
      <h3 class="font-semibold text-blue-800 mb-3">День 1: Пхукет → Пхи-Пхи</h3>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="font-medium">06:50</span>
          <span>Выезд из отеля</span>
        </div>
        <div class="flex justify-between">
          <span class="font-medium">09:50</span>
          <span>Бухта Майя (съёмки "Пляжа")</span>
        </div>
        <div class="flex justify-between">
          <span class="font-medium">10:50</span>
          <span>Лагуна Пиле (снорклинг)</span>
        </div>
        <div class="flex justify-between">
          <span class="font-medium">14:20</span>
          <span>Обед в пляжном ресторане</span>
        </div>
        <div class="flex justify-between">
          <span class="font-medium">20:30</span>
          <span>Огненное шоу + ночная жизнь</span>
        </div>
      </div>
    </div>

    <div class="bg-green-50 p-4 rounded-lg">
      <h3 class="font-semibold text-green-800 mb-3">День 2: Пхи-Пхи → Пхукет</h3>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="font-medium">07:00</span>
          <span>Завтрак в отеле</span>
        </div>
        <div class="flex justify-between">
          <span class="font-medium">10:30</span>
          <span>Смотровая площадка (панорама)</span>
        </div>
        <div class="flex justify-between">
          <span class="font-medium">15:30</span>
          <span>Снорклинг + рыбалка</span>
        </div>
        <div class="flex justify-between">
          <span class="font-medium">17:00</span>
          <span>Возвращение на Пхукет</span>
        </div>
      </div>
    </div>
  </div>

<h2>✅ Включено в стоимость</h2>

<h3>Включено</h3>
<ul>
<li>✓ 2 обеда, 1 ужин, 1 завтрак</li>
<li>✓ Транспорт (автобус и лодка)</li>
<li>✓ Входные билеты в национальные парки</li>
<li>✓ Прохладительные безалкогольные напитки</li>
<li>✓ Угощение фруктами на борту</li>
<li>✓ Страховка</li>
<li>✓ Русский гид</li>
<li>✓ Спасательные жилеты</li>
<li>✓ Маски, трубки</li>
<li>✓ Размещение в отеле</li>
</ul>

<h3>Не включено</h3>
<ul>
<li>✗ Входные билеты на смотровую площадку Пхи-Пхи Дон (50 Бат)</li>
<li>✗ Личные расходы</li>
</ul>

<h2>🎒 Что взять с собой</h2>
<ul>
<li>• Купальные принадлежности</li>
<li>• Солнцезащитные крема</li>
<li>• Крем после загара</li>
<li>• Головной убор</li>
<li>• Тапочки</li>
<li>• Личные деньги</li>
</ul>

<h2>⚠️ Важная информация</h2>
<ul>
<li>⚠ Программа и расписание могут изменяться в зависимости от погодных условий и работы национального парка</li>
<li>⚠ Гид может изменить очередность посещения локаций или заменить локации на схожие по насыщенности и красоте</li>
</ul>

<h2>🎯 Планируете поездку на Пхи-Пхи?</h2>
<div class="flex flex-wrap gap-4 mb-4">
  <a href="/phuket" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">🏝️ Забронировать тур с гидом</a>
  <a href="/services/car-rental" class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">🚗 Арендовать авто</a>
  <a href="/services/currency-exchange" class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600">💱 Обменять валюту</a>
</div>

<p><em>Пхи-Пхи 2 дня/1 ночь — это не просто тур, это незабываемое путешествие в райский уголок Андаманского моря. Идеальное сочетание приключений, отдыха и ночной жизни для создания воспоминаний на всю жизнь.</em></p>
  `
};

export const getTourDescription = (handle: string): string => {
  return tourDescriptions[handle] || '';
};
