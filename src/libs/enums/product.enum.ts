// KERVAN (yangi) — turk menyu asosida
export enum ProductCollection {
  KEBAB = "KEBAB", // Shish, Mix, Lamb kebab
  PIDE = "PIDE", // Turk pidesi (Rich Pide, Cheese Pide)
  SALAD = "SALAD", // Meze, Greek salad
  DESSERT = "DESSERT", // Kunefe, Baklava
  DRINK = "DRINK", // Ayran, Lemonade
  OTHER = "OTHER",
}

export enum ProductSize {
  SMALL = "SMALL",
  NORMAL = "NORMAL",
  LARGE = "LARGE",
  SET = "SET", // O'zgarmaydi
}

export enum ProductStatus {
  PAUSE = "PAUSE",
  PROCESS = "PROCESS",
  DELETE = "DELETE", // O'zgarmaydi
}

export enum ProductVolume {
  HALF = 0.5,
  ONE = 1,
  ONE_POINT_TWO = 1.2,
  TWO = 2, // O'zgarmaydi
}
