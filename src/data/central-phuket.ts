// Central Phuket - данные для загрузки в Shopify

export const centralPhuket = {
  title: "Central Phuket Floresta",
  handle: "central-phuket-floresta",
  description: `Central Phuket – самый большой торговый центр на острове с широким ассортиментом брендов и бесспорно одно из лучших мест для шоппинга на Пхукете. Он состоит из двух корпусов: Central Festival и Central Floresta.

В Central Festival располагаются всем известные бренды одежды, обуви и аксессуаров, а во втором корпусе Central Floresta – преимущественно люксовые бутики.

**Что здесь есть:**
- Магазины международных брендов (Zara, H&M, Uniqlo, Sephora)
- Люксовые бутики (Prada, Gucci, Louis Vuitton)
- Супермаркет Tops
- Кинотеатр
- Фуд-корт с разнообразной кухней
- Детская игровая зона
- Бесплатный Wi-Fi

**Как добраться:**
Торговый центр находится в районе Phuket Town. Можно доехать на такси или тук-туке из любой части острова.`,
  
  productType: "place",
  vendor: "PhuketDa Insider",
  
  tags: [
    "place",
    "category:shopping",
    "district:phuket-town",
    "shopping",
    "mall",
    "indoor"
  ],
  
  metafields: [
    {
      namespace: "place_info",
      key: "rating",
      value: "4.5",
      type: "number_decimal"
    },
    {
      namespace: "place_info",
      key: "reviews_count",
      value: "1250",
      type: "number_integer"
    },
    {
      namespace: "place_info",
      key: "amenities",
      value: JSON.stringify([
        "wifi",
        "parking",
        "food-court",
        "cinema",
        "kids-zone",
        "atm",
        "currency-exchange",
        "restrooms"
      ]),
      type: "json"
    },
    {
      namespace: "place_info",
      key: "hours",
      value: "10:00-22:00 ежедневно",
      type: "single_line_text_field"
    },
    {
      namespace: "place_info",
      key: "coordinates",
      value: "7.8904,98.2924",
      type: "single_line_text_field"
    },
    {
      namespace: "place_info",
      key: "price_level",
      value: "2",
      type: "number_integer"
    },
    {
      namespace: "place_info",
      key: "best_for",
      value: JSON.stringify([
        "Шопинг",
        "Семейный отдых",
        "Обед/ужин",
        "Кино"
      ]),
      type: "json"
    },
    {
      namespace: "place_info",
      key: "map_url",
      value: "https://maps.google.com/?q=7.8904,98.2924",
      type: "url"
    },
    {
      namespace: "place_info",
      key: "phone",
      value: "+66 76 291 111",
      type: "single_line_text_field"
    },
    {
      namespace: "place_info",
      key: "website",
      value: "https://www.central.co.th/en/store/central-phuket",
      type: "url"
    }
  ],
  
  // Изображения (будут загружены отдельно)
  images: [
    {
      url: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800",
      altText: "Central Phuket Floresta - главный вход"
    },
    {
      url: "https://images.unsplash.com/photo-1567958451986-2de427a4a0be?w=800",
      altText: "Интерьер торгового центра"
    },
    {
      url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
      altText: "Фуд-корт Central Phuket"
    }
  ]
};
