import { Link, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Clock, Star } from "lucide-react";

interface PlaceCard {
  id: string;
  title: string;
  description: string;
  image: string;
  rating?: number;
  distance?: string;
  duration?: string;
  tags?: string[];
  handle: string;
}

const categoryData: Record<string, { title: string; description: string; places: PlaceCard[] }> = {
  elephants: {
    title: "Слоны",
    description: "Парки и центры для общения со слонами на Пхукете",
    places: [
      {
        id: "1",
        title: "Заповедник слонов Phuket Elephant Sanctuary",
        description: "Этичный заповедник для спасенных слонов, где можно наблюдать за ними в естественной среде, кормить и купать их. Без катания на слонах.",
        image: "/placeholder.svg",
        rating: 4.9,
        distance: "25 км от центра Пхукета",
        duration: "Полдня",
        tags: ["Этичное общение", "Кормление", "Купание"],
        handle: "phuket-elephant-sanctuary"
      },
      {
        id: "2",
        title: "Elephant Retirement Park Phuket",
        description: "Дом для пожилых слонов, спасенных из туристической индустрии. Можно кормить, гулять и купаться со слонами в их естественной среде.",
        image: "/placeholder.svg",
        rating: 4.8,
        distance: "30 км от Патонга",
        duration: "3-4 часа",
        tags: ["Этичный туризм", "Фотографии", "Природа"],
        handle: "elephant-retirement-park"
      },
      {
        id: "3",
        title: "Phang Nga Elephant Park",
        description: "Центр реабилитации слонов в провинции Пханг-Нга. Экскурсии включают кормление, купание слонов и прогулку по джунглям.",
        image: "/placeholder.svg",
        rating: 4.7,
        distance: "60 км от Пхукета",
        duration: "Полдня",
        tags: ["Купание", "Джунгли", "Трансфер"],
        handle: "phang-nga-elephant"
      }
    ]
  },
  aquaparks: {
    title: "Аквапарки",
    description: "Водные развлечения для всей семьи",
    places: [
      {
        id: "1",
        title: "Splash Jungle Waterpark",
        description: "Крупнейший аквапарк Пхукета с 13 горками, ленивой рекой, волновым бассейном и детской зоной. Идеально для семейного отдыха.",
        image: "/placeholder.svg",
        rating: 4.5,
        distance: "20 км от Патонга",
        duration: "Весь день",
        tags: ["Для детей", "Горки", "Бассейны"],
        handle: "splash-jungle"
      },
      {
        id: "2",
        title: "Andamanda Phuket",
        description: "Новейший тематический аквапарк с уникальным дизайном в стиле тайской мифологии. Экстремальные горки и семейные аттракционы.",
        image: "/placeholder.svg",
        rating: 4.6,
        distance: "15 км от аэропорта",
        duration: "Весь день",
        tags: ["Новый", "Экстрим", "Тематический"],
        handle: "andamanda"
      }
    ]
  },
  amusement: {
    title: "Парки развлечений",
    description: "Развлекательные парки и активности на Пхукете",
    places: [
      {
        id: "1",
        title: "Парк развлечений Phuket FantaSea",
        description: "Тематический парк с грандиозным шоу, рестораном-буфетом и торговым центром. Вечернее шоу включает акробатику, слонов и спецэффекты.",
        image: "/placeholder.svg",
        rating: 4.6,
        distance: "Камала Бич",
        duration: "Вечер",
        tags: ["Шоу", "Ужин", "Слоны"],
        handle: "phuket-fantasea"
      },
      {
        id: "2",
        title: "Carnival Magic",
        description: "Новый карнавальный парк с впечатляющим шоу птиц, акробатикой и фейерверками. Ночное световое шоу и парад.",
        image: "/placeholder.svg",
        rating: 4.7,
        distance: "Камала",
        duration: "Вечер",
        tags: ["Новое", "Световое шоу", "Карнавал"],
        handle: "carnival-magic"
      },
      {
        id: "3",
        title: "Hanuman World Phuket",
        description: "Приключенческий парк с зиплайнами, веревочными трассами и роллерглайдером над джунглями. 33 платформы и живописные виды.",
        image: "/placeholder.svg",
        rating: 4.8,
        distance: "Чалонг",
        duration: "2-3 часа",
        tags: ["Зиплайн", "Адреналин", "Природа"],
        handle: "hanuman-world"
      }
    ]
  },
  viewpoints: {
    title: "Смотровые площадки",
    description: "Панорамные виды на остров и Андаманское море",
    places: [
      {
        id: "1",
        title: "Карон Вьюпойнт (Три пляжа)",
        description: "Самая знаменитая смотровая площадка Пхукета с видом на три пляжа: Ката Ной, Ката и Карон. Идеально для фото на закате.",
        image: "/placeholder.svg",
        rating: 4.8,
        distance: "Между Ката и Карон",
        duration: "30 минут",
        tags: ["Фото", "Закат", "Бесплатно"],
        handle: "karon-viewpoint"
      },
      {
        id: "2",
        title: "Мыс Промтеп (Promthep Cape)",
        description: "Самая южная точка Пхукета с захватывающими видами на закат. Маяк, статуя слона и смотровая площадка 360°.",
        image: "/placeholder.svg",
        rating: 4.7,
        distance: "Раваи",
        duration: "1 час",
        tags: ["Закат", "Маяк", "Популярное"],
        handle: "promthep-cape"
      },
      {
        id: "3",
        title: "Ранг Хилл (Rang Hill)",
        description: "Холм в центре Пхукет Тауна с панорамным видом на город и горы. Парк для прогулок, фитнес-площадки и кафе.",
        image: "/placeholder.svg",
        rating: 4.4,
        distance: "Пхукет Таун",
        duration: "1 час",
        tags: ["Город", "Парк", "Фитнес"],
        handle: "rang-hill"
      },
      {
        id: "4",
        title: "Ветряная мельница (Windmill Viewpoint)",
        description: "Тихая смотровая площадка с видом на пляж Най Харн и ветряными мельницами. Меньше туристов, отличное место для фото.",
        image: "/placeholder.svg",
        rating: 4.5,
        distance: "Най Харн",
        duration: "30 минут",
        tags: ["Тихо", "Пляж", "Мельницы"],
        handle: "windmill-viewpoint"
      }
    ]
  },
  temples: {
    title: "Храмы",
    description: "Священные буддийские храмы Пхукета",
    places: [
      {
        id: "1",
        title: "Большой Будда (Big Buddha)",
        description: "45-метровая статуя сидящего Будды на вершине холма Наккерд. Главная достопримечательность острова с панорамным видом 360°.",
        image: "/placeholder.svg",
        rating: 4.7,
        distance: "10 км от Чалонга",
        duration: "1-2 часа",
        tags: ["Святыня", "Вид", "Бесплатно"],
        handle: "big-buddha"
      },
      {
        id: "2",
        title: "Ват Чалонг (Wat Chalong)",
        description: "Самый большой и важный буддийский храм Пхукета. Красивая архитектура, пагода с реликвией Будды и музей монахов.",
        image: "/placeholder.svg",
        rating: 4.6,
        distance: "Чалонг",
        duration: "1 час",
        tags: ["История", "Архитектура", "Музей"],
        handle: "wat-chalong"
      },
      {
        id: "3",
        title: "Храм Пхра Тонг (Wat Phra Thong)",
        description: "Древний храм с легендарной статуей золотого Будды, наполовину погруженной в землю. Священное место для местных жителей.",
        image: "/placeholder.svg",
        rating: 4.5,
        distance: "Тхаланг",
        duration: "45 минут",
        tags: ["Легенда", "Золотой Будда", "Древний"],
        handle: "wat-phra-thong"
      }
    ]
  },
  museums: {
    title: "Музеи",
    description: "Музеи и культурные центры Пхукета",
    places: [
      {
        id: "1",
        title: "Thai Hua Museum",
        description: "Музей китайско-тайской культуры в историческом здании китайской школы. Рассказывает об истории китайских иммигрантов на Пхукете.",
        image: "/placeholder.svg",
        rating: 4.4,
        distance: "Старый город Пхукета",
        duration: "1 час",
        tags: ["История", "Культура", "Архитектура"],
        handle: "thai-hua-museum"
      },
      {
        id: "2",
        title: "Музей оловянных рудников Kathu Mining Museum",
        description: "Интерактивный музей о истории добычи олова на Пхукете. Экспозиции, старое оборудование и видео.",
        image: "/placeholder.svg",
        rating: 4.3,
        distance: "Катху",
        duration: "1 час",
        tags: ["Интерактивный", "Горное дело", "Бесплатно"],
        handle: "kathu-mining-museum"
      }
    ]
  },
  nightmarkets: {
    title: "Ночные рынки",
    description: "Рынки с едой, сувенирами и развлечениями",
    places: [
      {
        id: "1",
        title: "Ночной рынок Пхукет Таун (Lard Yai)",
        description: "Аутентичный воскресный рынок на улице Thalang в старом городе. Уличная еда, сувениры, одежда и живая музыка.",
        image: "/placeholder.svg",
        rating: 4.6,
        distance: "Старый город",
        duration: "2-3 часа",
        tags: ["Еда", "Сувениры", "Воскресенье"],
        handle: "phuket-walking-street"
      },
      {
        id: "2",
        title: "Чиллва Маркет (Chillva Market)",
        description: "Хипстерский ночной рынок с винтажной одеждой, стрит-артом, живой музыкой и творческими кафе. Работает вечерами.",
        image: "/placeholder.svg",
        rating: 4.5,
        distance: "Пхукет Таун",
        duration: "2 часа",
        tags: ["Винтаж", "Музыка", "Молодежный"],
        handle: "chillva-market"
      },
      {
        id: "3",
        title: "Ночной рынок Макасан (Malin Plaza)",
        description: "Популярный ночной рынок с морепродуктами, тайской едой и дешевыми сувенирами. Работает каждый вечер.",
        image: "/placeholder.svg",
        rating: 4.3,
        distance: "Патонг",
        duration: "1-2 часа",
        tags: ["Морепродукты", "Ежедневно", "Доступно"],
        handle: "malin-plaza"
      }
    ]
  },
  walking: {
    title: "Прогулочные места",
    description: "Места для прогулок и отдыха на Пхукете",
    places: [
      {
        id: "1",
        title: "Променад Патонг",
        description: "3-километровая набережная вдоль пляжа Патонг с видом на море, барами, ресторанами и уличными музыкантами.",
        image: "/placeholder.svg",
        rating: 4.3,
        distance: "Патонг Бич",
        duration: "1-2 часа",
        tags: ["Набережная", "Закат", "Бесплатно"],
        handle: "patong-promenade"
      },
      {
        id: "2",
        title: "Старый город Пхукета",
        description: "Исторический район с португальской и китайской архитектурой, цветными домами, арт-галереями и кафе.",
        image: "/placeholder.svg",
        rating: 4.7,
        distance: "Пхукет Таун",
        duration: "2-3 часа",
        tags: ["История", "Фото", "Архитектура"],
        handle: "old-phuket-town"
      },
      {
        id: "3",
        title: "Сад бабочек и аквариум",
        description: "Тропический сад с сотнями бабочек, аквариум с морскими обитателями и сад орхидей.",
        image: "/placeholder.svg",
        rating: 4.4,
        distance: "Панва",
        duration: "1-2 часа",
        tags: ["Природа", "Семейное", "Фото"],
        handle: "butterfly-garden"
      }
    ]
  },
  shopping: {
    title: "Торговые центры",
    description: "Шопинг и развлекательные центры Пхукета",
    places: [
      {
        id: "1",
        title: "Central Phuket",
        description: "Крупнейший торговый центр южного Таиланда. 300+ магазинов, рестораны, кинотеатр, аквариум и детская зона.",
        image: "/placeholder.svg",
        rating: 4.5,
        distance: "Пхукет Таун",
        duration: "3-4 часа",
        tags: ["Шопинг", "Еда", "Кондиционер"],
        handle: "central-phuket"
      },
      {
        id: "2",
        title: "Jungceylon Shopping Mall",
        description: "Большой ТЦ в центре Патонга с магазинами одежды, электроники, супермаркетом и фуд-кортом.",
        image: "/placeholder.svg",
        rating: 4.3,
        distance: "Патонг",
        duration: "2-3 часа",
        tags: ["Центр Патонга", "Удобно", "Большой"],
        handle: "jungceylon"
      },
      {
        id: "3",
        title: "Premium Outlet Phuket",
        description: "Аутлет с брендовой одеждой и обувью со скидками до 70%. Nike, Adidas, Levi's и другие марки.",
        image: "/placeholder.svg",
        rating: 4.4,
        distance: "По дороге в аэропорт",
        duration: "2 часа",
        tags: ["Скидки", "Бренды", "Аутлет"],
        handle: "premium-outlet"
      }
    ]
  },
  events: {
    title: "Афиша событий",
    description: "Мероприятия и события на Пхукете",
    places: [
      {
        id: "1",
        title: "Вегетарианский фестиваль",
        description: "Ежегодный 9-дневный фестиваль в октябре с процессиями, огненными ритуалами и вегетарианской едой по всему острову.",
        image: "/placeholder.svg",
        rating: 4.8,
        distance: "По всему острову",
        duration: "9 дней",
        tags: ["Фестиваль", "Культура", "Октябрь"],
        handle: "vegetarian-festival"
      },
      {
        id: "2",
        title: "Songkran - Тайский Новый год",
        description: "Водный фестиваль 13-15 апреля. Уличные водные битвы, религиозные церемонии и празднования по всему острову.",
        image: "/placeholder.svg",
        rating: 4.9,
        distance: "Везде",
        duration: "3 дня",
        tags: ["Апрель", "Вода", "Веселье"],
        handle: "songkran"
      },
      {
        id: "3",
        title: "Loy Krathong - Фестиваль света",
        description: "Ноябрьский фестиваль с запуском плавучих свечей на воду и фонариков в небо. Романтичная атмосфера.",
        image: "/placeholder.svg",
        rating: 4.7,
        distance: "Пляжи и озера",
        duration: "Вечер",
        tags: ["Ноябрь", "Романтика", "Свечи"],
        handle: "loy-krathong"
      }
    ]
  },
  
  // Массажи и СПА
  spa: {
    title: "Лучшие СПА",
    description: "Премиальные СПА-центры Пхукета с мировым именем",
    places: [
      {
        id: "1",
        title: "Banyan Tree Spa Phuket",
        description: "Легендарный СПА в тропическом саду с отдельными павильонами. Signature массажи, spa-ритуалы и аюрведа.",
        image: "/placeholder.svg",
        rating: 4.9,
        distance: "Лагуна Банг Тао",
        duration: "2-4 часа",
        tags: ["Премиум", "Павильоны", "Аюрведа"],
        handle: "banyan-tree-spa"
      },
      {
        id: "2",
        title: "Oasis Spa Phuket",
        description: "Тропический оазис с балийским дизайном. Травяные ванны, тайский массаж и уходовые процедуры.",
        image: "/placeholder.svg",
        rating: 4.8,
        distance: "Камала",
        duration: "2-3 часа",
        tags: ["Балийский стиль", "Травяные ванны", "Романтика"],
        handle: "oasis-spa"
      }
    ]
  },
  
  massage: {
    title: "Массажные салоны",
    description: "Традиционный тайский массаж по районам Пхукета",
    places: [
      {
        id: "1",
        title: "Let's Relax Spa (сеть)",
        description: "Популярная сеть массажных салонов с хорошим соотношением цена-качество. Тайский, масляный, ароматический массаж.",
        image: "/placeholder.svg",
        rating: 4.6,
        distance: "Патонг, Карон, Ката",
        duration: "1-2 часа",
        tags: ["Сеть", "Доступно", "Качественно"],
        handle: "lets-relax"
      },
      {
        id: "2",
        title: "Oriental Massage Patong",
        description: "Массажный салон в центре Патонга с опытными мастерами. Foot massage, Thai massage, oil massage.",
        image: "/placeholder.svg",
        rating: 4.5,
        distance: "Патонг",
        duration: "1-2 часа",
        tags: ["Центр Патонга", "Опытные", "Недорого"],
        handle: "oriental-massage"
      }
    ]
  },
  
  sauna: {
    title: "Бани и сауны",
    description: "Традиционные бани, сауны и хаммамы",
    places: [
      {
        id: "1",
        title: "Banya Hot Springs Phuket",
        description: "Русская баня на Пхукете с горячими источниками. Парилка, бассейн, массаж и ресторан русской кухни.",
        image: "/placeholder.svg",
        rating: 4.4,
        distance: "Чалонг",
        duration: "2-3 часа",
        tags: ["Русская баня", "Источники", "Русская кухня"],
        handle: "banya-hot-springs"
      }
    ]
  },
  
  // Кафе и рестораны
  "restaurants-districts": {
    title: "Рестораны по районам",
    description: "Лучшие рестораны в каждом районе Пхукета",
    places: [
      {
        id: "1",
        title: "Baan Rim Pa (Патонг)",
        description: "Легендарный тайский ресторан на скале с видом на залив Патонг. Королевская тайская кухня и романтическая атмосфера.",
        image: "/placeholder.svg",
        rating: 4.7,
        distance: "Патонг",
        duration: "Ужин",
        tags: ["Вид на море", "Тайская кухня", "Романтика"],
        handle: "baan-rim-pa"
      },
      {
        id: "2",
        title: "Mor Mu Dong (Пхукет Таун)",
        description: "Популярный местный ресторан в старом городе. Северо-тайская кухня, свиные ребрышки и аутентичная атмосфера.",
        image: "/placeholder.svg",
        rating: 4.6,
        distance: "Пхукет Таун",
        duration: "Обед/Ужин",
        tags: ["Местное", "Недорого", "Аутентично"],
        handle: "mor-mu-dong"
      }
    ]
  },
  
  "restaurants-view": {
    title: "Видовые рестораны",
    description: "Рестораны с панорамным видом на море и острова",
    places: [
      {
        id: "1",
        title: "360° Bar at The Nai Harn",
        description: "Бар на крыше с видом 360° на залив Най Харн. Коктейли на закате и средиземноморская кухня.",
        image: "/placeholder.svg",
        rating: 4.8,
        distance: "Най Харн",
        duration: "Закат",
        tags: ["Вид 360°", "Коктейли", "Закат"],
        handle: "360-bar-nai-harn"
      },
      {
        id: "2",
        title: "Black Ginger at The Slate",
        description: "Ресторан на плоту посреди озера. Тайская кухня, романтическая атмосфера и трансфер на лодке.",
        image: "/placeholder.svg",
        rating: 4.7,
        distance: "Най Янг",
        duration: "Ужин",
        tags: ["На воде", "Романтика", "Уникально"],
        handle: "black-ginger"
      }
    ]
  },
  
  "restaurants-instagram": {
    title: "Инстаграмные кафе",
    description: "Красивые места для фото и вкусной еды",
    places: [
      {
        id: "1",
        title: "The Coffee Tribe",
        description: "Хипстерская кофейня с минималистичным дизайном. Specialty coffee, бранчи и растительное молоко.",
        image: "/placeholder.svg",
        rating: 4.6,
        distance: "Чалонг",
        duration: "Завтрак/Бранч",
        tags: ["Кофе", "Инстаграм", "Бранч"],
        handle: "coffee-tribe"
      },
      {
        id: "2",
        title: "Torry's Ice Cream",
        description: "Яркое кафе-мороженое с тропическим декором. Домашнее мороженое, смузи-боулы и фото-зоны.",
        image: "/placeholder.svg",
        rating: 4.5,
        distance: "Раваи",
        duration: "Десерт",
        tags: ["Мороженое", "Яркое", "Фото"],
        handle: "torrys-ice-cream"
      }
    ]
  },
  
  "restaurants-best": {
    title: "Лучшие рестораны",
    description: "Топовые заведения острова с мишленовским уровнем",
    places: [
      {
        id: "1",
        title: "PRU Restaurant",
        description: "Ресторан farm-to-table с мишленовской звездой. Сезонное меню из продуктов собственной фермы.",
        image: "/placeholder.svg",
        rating: 4.9,
        distance: "Тхаланг",
        duration: "Ужин",
        tags: ["Мишлен", "Farm-to-table", "Премиум"],
        handle: "pru-restaurant"
      }
    ]
  },
  
  "restaurants-romantic": {
    title: "Романтичные рестораны",
    description: "Идеальные места для романтических ужинов",
    places: [
      {
        id: "1",
        title: "La Gritta at Amari Phuket",
        description: "Итальянский ресторан на пляже Патонг. Столики на песке, свечи, живая музыка и морепродукты.",
        image: "/placeholder.svg",
        rating: 4.7,
        distance: "Патонг",
        duration: "Ужин",
        tags: ["На пляже", "Итальянская", "Свечи"],
        handle: "la-gritta"
      }
    ]
  },
  
  coffee: {
    title: "Кофейни",
    description: "Лучший specialty coffee на Пхукете",
    places: [
      {
        id: "1",
        title: "Cafe del Mar Phuket",
        description: "Пляжный клуб с кафе на Камала Бич. Кофе, завтраки, обеды и sunset session с диджеем.",
        image: "/placeholder.svg",
        rating: 4.6,
        distance: "Камала",
        duration: "Весь день",
        tags: ["Пляж", "Музыка", "Закат"],
        handle: "cafe-del-mar"
      },
      {
        id: "2",
        title: "Gallery Cafe by Pinky",
        description: "Уютная кофейня-галерея в старом городе. Авторский кофе, десерты и арт-выставки.",
        image: "/placeholder.svg",
        rating: 4.5,
        distance: "Старый город",
        duration: "Кофе",
        tags: ["Арт", "Уютно", "Десерты"],
        handle: "gallery-cafe"
      }
    ]
  },
  
  "restaurants-kids": {
    title: "С детской комнатой",
    description: "Рестораны с игровыми зонами для детей",
    places: [
      {
        id: "1",
        title: "The Kids Club Cafe",
        description: "Кафе с большой детской комнатой, игрушками и аниматорами. Детское меню и Wi-Fi для родителей.",
        image: "/placeholder.svg",
        rating: 4.4,
        distance: "Чалонг",
        duration: "2-3 часа",
        tags: ["Детская комната", "Аниматоры", "Семейное"],
        handle: "kids-club-cafe"
      }
    ]
  },
  
  // Отдых и развлечения
  fishing: {
    title: "Рыбалка",
    description: "Морская и озерная рыбалка на Пхукете",
    places: [
      {
        id: "1",
        title: "Deep Sea Fishing Phuket",
        description: "Морская рыбалка на яхте. Ловля тунца, барракуды и марлина. Оборудование и егерь включены.",
        image: "/placeholder.svg",
        rating: 4.7,
        distance: "Чалонг Пирс",
        duration: "Полдня/Весь день",
        tags: ["Морская", "Яхта", "Крупная рыба"],
        handle: "deep-sea-fishing"
      },
      {
        id: "2",
        title: "Phuket Fishing Park",
        description: "Платный пруд для рыбалки с гарантированным уловом. Карп, сом, барракуда. Аренда снастей на месте.",
        image: "/placeholder.svg",
        rating: 4.4,
        distance: "Чалонг",
        duration: "2-4 часа",
        tags: ["Озеро", "Для начинающих", "Гарантия улова"],
        handle: "fishing-park"
      }
    ]
  },
  
  diving: {
    title: "Дайвинг",
    description: "Дайв-центры и места для снорклинга",
    places: [
      {
        id: "1",
        title: "Sea Bees Diving Phuket",
        description: "Профессиональный дайв-центр с PADI-курсами. Дайвинг к островам Пхи-Пхи, Симиланам и Рача Яй.",
        image: "/placeholder.svg",
        rating: 4.8,
        distance: "Чалонг",
        duration: "Полдня/Весь день",
        tags: ["PADI", "Острова", "Профи"],
        handle: "sea-bees-diving"
      },
      {
        id: "2",
        title: "Coral Island Snorkeling",
        description: "Снорклинг у острова Корал (Хей). Прозрачная вода, коралловые рифы и тропические рыбы.",
        image: "/placeholder.svg",
        rating: 4.6,
        distance: "15 минут на лодке",
        duration: "Полдня",
        tags: ["Снорклинг", "Близко", "Кораллы"],
        handle: "coral-snorkeling"
      }
    ]
  },
  
  yacht: {
    title: "Аренда яхт",
    description: "Яхты и катера напрокат для морских прогулок",
    places: [
      {
        id: "1",
        title: "Phuket Yacht Charter",
        description: "Аренда парусных и моторных яхт на день или несколько дней. С капитаном, питанием и снорклинг-оборудованием.",
        image: "/placeholder.svg",
        rating: 4.7,
        distance: "Чалонг/Ао По",
        duration: "От 4 часов",
        tags: ["Яхта", "Капитан", "Острова"],
        handle: "yacht-charter"
      },
      {
        id: "2",
        title: "Speedboat Rental Phuket",
        description: "Аренда скоростного катера для поездок к островам. Пхи-Пхи, Джеймс Бонд, Рача Яй - на выбор.",
        image: "/placeholder.svg",
        rating: 4.6,
        distance: "Чалонг Пирс",
        duration: "Весь день",
        tags: ["Быстро", "Острова", "Приватно"],
        handle: "speedboat-rental"
      }
    ]
  },
  
  zoos: {
    title: "Зоопарки",
    description: "Контактные зоопарки и фермы с животными",
    places: [
      {
        id: "1",
        title: "Phuket Zoo",
        description: "Зоопарк с крокодилами, тиграми, слонами и экзотическими птицами. Шоу животных и кормление.",
        image: "/placeholder.svg",
        rating: 4.3,
        distance: "Чалонг",
        duration: "2-3 часа",
        tags: ["Животные", "Шоу", "Для детей"],
        handle: "phuket-zoo"
      },
      {
        id: "2",
        title: "Phuket Sheep Farm",
        description: "Ферма с овцами, кроликами и альпаками. Кормление животных, детская площадка и кафе с видом.",
        image: "/placeholder.svg",
        rating: 4.5,
        distance: "Катху",
        duration: "1-2 часа",
        tags: ["Ферма", "Овцы", "Фото"],
        handle: "sheep-farm"
      }
    ]
  },
  
  gaming: {
    title: "Компьютерные клубы",
    description: "Gaming-зоны с PlayStation, Xbox и PC",
    places: [
      {
        id: "1",
        title: "Cyber Gaming Lounge Patong",
        description: "Современный киберклуб с мощными ПК, PlayStation 5 и Xbox. VR-зона и турниры.",
        image: "/placeholder.svg",
        rating: 4.4,
        distance: "Патонг",
        duration: "По часам",
        tags: ["PC Gaming", "PS5", "VR"],
        handle: "cyber-gaming"
      }
    ]
  },
  
  biking: {
    title: "Аренда байков",
    description: "Прокат мотобайков и велосипедов",
    places: [
      {
        id: "1",
        title: "Patong Bike Rental",
        description: "Прокат скутеров и мотобайков в Патонге. Honda PCX, Yamaha Aerox от 200 бат/день. Доставка к отелю.",
        image: "/placeholder.svg",
        rating: 4.5,
        distance: "Патонг",
        duration: "От 1 дня",
        tags: ["Скутеры", "Недорого", "Доставка"],
        handle: "patong-bike"
      },
      {
        id: "2",
        title: "Phuket E-Bike Tours",
        description: "Прокат электровелосипедов и велотуры по острову. Групповые туры в старый город и на viewpoints.",
        image: "/placeholder.svg",
        rating: 4.6,
        distance: "Пхукет Таун",
        duration: "2-4 часа",
        tags: ["Велосипеды", "Туры", "Эко"],
        handle: "ebike-tours"
      }
    ]
  },
  
  parties: {
    title: "Ночная жизнь",
    description: "Клубы, бары и вечеринки на Пхукете",
    places: [
      {
        id: "1",
        title: "Illuzion Nightclub Patong",
        description: "Крупнейший ночной клуб Пхукета. 4 танцпола, лазерное шоу, известные диджеи и go-go dancers.",
        image: "/placeholder.svg",
        rating: 4.5,
        distance: "Патонг",
        duration: "Ночь",
        tags: ["Клуб", "Танцы", "Шоу"],
        handle: "illuzion"
      },
      {
        id: "2",
        title: "Catch Beach Club",
        description: "Пляжный клуб на Банг Тао с бассейном. Дневные вечеринки, sunset session и ночная музыка.",
        image: "/placeholder.svg",
        rating: 4.7,
        distance: "Банг Тао",
        duration: "День/Вечер",
        tags: ["Пляжный клуб", "Бассейн", "Закат"],
        handle: "catch-beach-club"
      }
    ]
  }
};

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = categoryId ? categoryData[categoryId] : null;

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Категория не найдена</h2>
          <Link to="/categories">
            <Button>Вернуться к категориям</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="relative h-[30vh] bg-gradient-to-br from-primary/20 via-primary/10 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-10" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {category.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {category.description}
          </p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">
            Главная
          </Link>
          <span>→</span>
          <Link to="/categories" className="hover:text-primary transition-colors">
            Категории
          </Link>
          <span>→</span>
          <span className="text-foreground">{category.title}</span>
        </nav>
      </div>

      {/* Places Grid */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.places.map((place) => (
            <Card key={place.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="relative h-56 overflow-hidden">
                <img
                  src={place.image}
                  alt={place.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {place.rating && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-sm">{place.rating}</span>
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {place.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {place.description}
                </p>
                
                {/* Info */}
                <div className="space-y-2 mb-4">
                  {place.distance && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {place.distance}
                    </div>
                  )}
                  {place.duration && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      {place.duration}
                    </div>
                  )}
                </div>

                {/* Tags */}
                {place.tags && place.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {place.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <Link to={`/place/${place.handle}`}>
                  <Button className="w-full group/btn">
                    Подробнее
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Скоро здесь появится больше мест из этой категории
          </p>
          <Link to="/categories">
            <Button variant="outline">Посмотреть другие категории</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
