// Хелперы для инфо-карточек Insider (категория shopping и другие)

export function isInfoProduct(tags: string[] = []) {
  return tags.map(t => t.toLowerCase()).includes('info');
}

export function getCategoryFromTags(tags: string[] = []) {
  const t = tags.map(x => x.toLowerCase());
  const cat = t.find(x => x.startsWith('category:'))?.split(':')[1] || null;
  const labels: Record<string, string> = {
    beaches: 'Пляжи',
    temples: 'Храмы',
    restaurants: 'Рестораны',
    viewpoints: 'Смотровые',
    nightlife: 'Ночная жизнь',
    shopping: 'Торговые центры',
    attractions: 'Достопримечательности',
    aquaparks: 'Аквапарки',
    waterfalls: 'Водопады'
  };
  return { key: cat, label: cat ? (labels[cat] || cat) : null };
}

export function getDistrictLabel(tags: string[] = [], mfDistrict?: string | null) {
  const t = tags.map(x => x.toLowerCase());
  const fromTag = t.find(x => x.startsWith('district:'))?.split(':')[1] || null;
  const key = (mfDistrict || fromTag || '').toLowerCase();
  const labels: Record<string, string> = {
    kathu: 'Кату',
    patong: 'Патонг',
    cherngtalay: 'Банг Тао',
    thalang: 'Тхаланг',
    chalong: 'Чалонг',
    rawai: 'Раваи',
    karon: 'Карон',
    kamala: 'Камала',
    kata: 'Ката',
    phukettown: 'Пхукет Таун',
    'phuket-town': 'Пхукет Таун'
  };
  return key ? (labels[key] || key) : null;
}

export function mapTagChips(tags: string[] = []) {
  const map: Record<string, string> = {
    shopping: 'shopping',
    mall: 'mall',
    'food-court': 'food court',
    aircon: 'кондиционер',
    'open-air': 'open air',
    kids: 'детям',
    parking: 'парковка',
    free: 'бесплатно',
    luxury: 'премиум',
    budget: 'бюджетно'
  };
  const lower = tags.map(t => t.toLowerCase());
  return Object.entries(map).filter(([k]) => lower.includes(k)).map(([, v]) => v);
}

export function getMfValue(
  metafields: { key: string; value: string }[] | undefined,
  key: string
) {
  return metafields?.find(m => m.key === key)?.value ?? null;
}
