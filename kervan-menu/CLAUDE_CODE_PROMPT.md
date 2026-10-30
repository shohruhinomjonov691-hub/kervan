# Kervan — haqiqiy menyuni productlarga qo'shish

## 1. Claude Code'ga nimalarni berasiz

Bu papkani (`kervan-menu/`) to'liq backend loyihangiz ildiziga ko'chiring:

```
kervan/                      ← backend repo
└── kervan-menu/
    ├── kervan-menu.json     ← 72 ta mahsulot, 11 ta kategoriya
    ├── images/              ← 65 ta taom rasmi (.webp, 800×600, fon olib tashlangan)
    └── CLAUDE_CODE_PROMPT.md
```

Keyin Claude Code'ni backend papkasida oching va pastdagi promptni to'liq nusxalab yuboring.

---

## 2. Prompt (shu qismni nusxalang)

```
Men Kervan restoranining haqiqiy menyusini loyihaga qo'shmoqchiman. Barcha ma'lumot
`kervan-menu/kervan-menu.json` faylida, rasmlar esa `kervan-menu/images/` papkasida.

MUHIM QOIDALAR:
- Bu loyiha Burak kodbazasidan olingan. Har bir o'zgarish Burak'ning mavjud
  fayl tuzilishi, nomlash uslubi va pattern'lariga (MVC + Service, enum fayllari,
  Mongoose schema) aynan mos bo'lsin. Yangi kutubxona yoki notanish sintaksis qo'shma.
- Men har bir qatorni intervyuda tushuntira olishim kerak — shuning uchun oddiy va
  mavjud kodga o'xshash yoz.
- Kod yozishdan OLDIN reja tuzib menga ko'rsat va tasdiqlashimni kut.

1-QADAM — Avval o'rganib chiq (hech narsani o'zgartirma):
- Product schema va product enum fayllarini top (ProductCollection va boshqalar).
- Multer rasmlarni qayerga saqlashini va productImages qanday yo'l bilan
  saqlanishini aniqla (masalan `uploads/products/...`).
- `kervan-menu.json` strukturasini o'qi.
- Hozirgi ProductCollection enum qayerlarda ishlatilishini top (backend, EJS admin
  panel, React frontend).
- Natijani qisqa yozib ber: qaysi fayllar, qaysi maydonlar mos keladi, qaysilari yo'q.

2-QADAM — Kategoriyalar (enum):
Hozirgi ProductCollection (Kebab, Pide, Meze, Soup, Salad, Dessert, Drink, Set Menu,
Other) o'rniga haqiqiy menyudagi 11 ta bo'limni qo'y, JSON'dagi `categories[].key`
bilan bir xil qiymatlarda va shu tartibda:
LUNCH, SALAD_APPETIZER, BREAD_SIDES, KEBAB_STEAK, PIDE, CURRY_LAVASH,
KERVAN_SPECIAL, COUPLE_SET, DESSERT, DRINK, COFFEE_TEA.
Enum ishlatilgan barcha joylarni (admin EJS select'lari, React tab/filtrlari) yangila.

3-QADAM — Product schema:
JSON'dagi maydonlarni mavjud schema'ga moslashtir:
  nameEn → productName, price → productPrice, descEn → productDesc,
  category → productCollection, image → productImages[0].
Schema'da yo'q, lekin kerak bo'lgan maydonlar uchun menga taklif ber (masalan
productNameKo, productDescKo, productTags, productSortOrder). Faqat men rozi
bo'lganlarini qo'sh, Burak'dagi boshqa maydonlar qanday yozilgan bo'lsa xuddi shunday.
courseOption, addOns, variants, availability — hozircha productDesc ichida matn
sifatida qolsin, alohida schema shart emas (agar boshqacha taklifing bo'lsa, ayt).

4-QADAM — Rasmlar:
`kervan-menu/images/*.webp` fayllarini Multer saqlaydigan papkaga ko'chir.
`image` qiymati null bo'lgan 5 ta mahsulot (ayran, juice, soft-drink,
sparkling-soda, americano) uchun hozircha rasmsiz yoki placeholder bilan qo'sh —
keyin admin panel orqali rasm yuklayman.

5-QADAM — Seed skript:
`kervan-menu.json`'ni o'qib, barcha 72 ta mahsulotni bazaga yozadigan seed skript
yoz (mavjud service/model orqali, Burak uslubida). Skript:
- bir xil nomli mahsulot bo'lsa ikkinchi marta qo'shmasin (qayta ishga tushirsa bo'ladi),
- package.json'ga `npm run seed:menu` buyrug'i sifatida qo'shilsin,
- oxirida nechta qo'shilgani va nechta o'tkazib yuborilganini chiqarsin.
Eski test mahsulotlarini o'chirish kerakmi — mendan so'ra.

6-QADAM — React frontend:
- Menyu sahifasida kategoriyalar JSON'dagi `sortOrder` tartibida tab bo'lib chiqsin.
- Har bir kartochkada: rasm, inglizcha nom, koreyscha nom (agar qo'shilgan bo'lsa),
  narx (₩ va mingliklar vergul bilan: 15,900₩), RECOMMENDED / NEW / VEGGY / SPICY
  belgilari.
- Mavjud dizayn tizimi va MUI theme'dan foydalan, yangi rang qo'shma.

7-QADAM — Tekshirish:
`npm run build` xatosiz o'tsin, seed'ni ishga tushir, admin panelda va React'da
mahsulotlar ko'rinishini tekshir. Oxirida qaysi fayllar o'zgarganini va har bir
o'zgarish nima uchun kerakligini qisqa tushuntirib ber.
```

---

## 3. Ma'lumot haqida eslatmalar

- **Narxlar** menyu rasmlari bilan bittama-bitta solishtirilgan (KRW).
- **Lunch** — hammasi 15,900₩, du–ju 11:00–14:00, bayramdan tashqari. Lunch, Kebab & Steak va Pide'da "Soup + Bread +2,900₩" course opsiyasi bor (`courseOption`).
- **Kervan Special** — narx 1 kishi uchun (`pricePer: PERSON`), 2–4 kishi.
- **Tags:** `RECOMMENDED` (추천), `NEW`, `VEGGY`, `SPICY` (🌶), `SIZE_1_5` (menyudagi "1.5" belgisi).
- Menyuda tavsifi yo'q mahsulotlarga (Shrimp Ring, Fried Potato, Pilaf, Mango Lassi, choylar, desertlarning bir qismi) qisqa tavsif o'zim yozdim — tekshirib chiqing.
- Menyudagi xatolar to'g'rilangan: "DUBAI CHOCOLAE" → Dubai Chocolate, "Delighty" → Delightful, "POMEGRANANTE" → Pomegranate, "갈은 소고기" → "간 소고기".

## 4. Rasm sifati (`imageQuality` maydoni)

| Holat | Soni | Mahsulotlar |
|---|---|---|
| GOOD | 53 | qolganlari |
| MEDIUM | 12 | grilled-vegetable-salad, greek-avocado-salad, daily-soup, garlic-lavash, balloon-lavash, zaatar-lavash, lahmajun, pide-bread, fried-potato, mojito, dondurma, baklava-dondurma |
| SHARED | 2 | truffle-steak-beef (truffle-steak-chicken rasmi), dubai-chocolate (cookie rasmi) |
| MISSING | 5 | ayran, juice, soft-drink, sparkling-soda, americano |

MEDIUM rasmlar menyuda boshqa taomlar ustiga qo'yilgani uchun chetlari qirqilgan. Ularni keyin restoranning o'z rasmlari yoki litsenziyasi ochiq foto saytlari (Unsplash, Pexels) dan almashtirish mumkin — fayl nomini o'zgartirmasdan `images/` ichiga qo'ysangiz bo'ldi.
