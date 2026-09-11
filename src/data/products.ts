export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  hue: number;
  badge?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "nova-anc",
    name: "هدفون نویزکنسلینگ نوا",
    description: "صدای فضایی، ۳۰ ساعت شارژ، بدنه آلومینیومی",
    price: 4_290_000,
    hue: 250,
    badge: "پرفروش",
  },
  {
    id: "pulse-watch",
    name: "ساعت هوشمند پالس",
    description: "ECG، GPS داخلی و نمایشگر AMOLED",
    price: 3_150_000,
    hue: 200,
  },
  {
    id: "urban-pack",
    name: "کوله ضدآب شهری",
    description: "۱۵ لیتر، محفظه لپ‌تاپ ۱۶ اینچ",
    price: 1_890_000,
    hue: 30,
  },
  {
    id: "aura-lamp",
    name: "لامپ هوشمند RGB",
    description: "۱۶ میلیون رنگ، همگام با موسیقی",
    price: 640_000,
    hue: 320,
  },
  {
    id: "mech-keys",
    name: "کیبورد مکانیکال نوا",
    description: "سوئیچ لمسی، نورپردازی جداگانه هر کلید",
    price: 2_450_000,
    hue: 160,
    badge: "جدید",
  },
  {
    id: "boom-speaker",
    name: "اسپیکر بلوتوث بوم",
    description: "۲۴ وات، مقاوم در برابر پاشش آب",
    price: 1_120_000,
    hue: 12,
  },
];
