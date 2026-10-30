// KERVAN — haqiqiy menyu bo'limlari (kervan-menu.json categories[].key, sortOrder tartibida)
export enum ProductCollection {
  LUNCH = "LUNCH",
  SALAD_APPETIZER = "SALAD_APPETIZER",
  BREAD_SIDES = "BREAD_SIDES",
  KEBAB_STEAK = "KEBAB_STEAK",
  PIDE = "PIDE",
  CURRY_LAVASH = "CURRY_LAVASH",
  KERVAN_SPECIAL = "KERVAN_SPECIAL",
  COUPLE_SET = "COUPLE_SET",
  DESSERT = "DESSERT",
  DRINK = "DRINK",
  COFFEE_TEA = "COFFEE_TEA",
}

// Menyudagi belgilar: 추천, NEW, VEGGY, 🌶, "1.5"
export enum ProductTag {
  RECOMMENDED = "RECOMMENDED",
  NEW = "NEW",
  VEGGY = "VEGGY",
  SPICY = "SPICY",
  SIZE_1_5 = "SIZE_1_5",
}

export enum ProductSize {
  SMALL = "SMALL",
  NORMAL = "NORMAL",
  LARGE = "LARGE",
  SET = "SET", 
}

export enum ProductStatus {
  PAUSE = "PAUSE",
  PROCESS = "PROCESS",
  DELETE = "DELETE", 
}

export enum ProductVolume {
  HALF = 0.5,
  ONE = 1,
  ONE_POINT_TWO = 1.2,
  TWO = 2, 
}
