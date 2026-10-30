import dotenv from "dotenv";
dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import ProductModel from "./schema/Product.model";
import ProductService from "./models/Product.service";
import { ProductInput } from "./libs/types/product";
import {
  ProductCollection,
  ProductStatus,
  ProductTag,
} from "./libs/enums/product.enum";

/** KERVAN MENU SEED
 * kervan-menu/kervan-menu.json dagi haqiqiy menyuni bazaga yozadi.
 * Qayta ishga tushirsa bo'ladi — bir xil nomli mahsulot ikkinchi marta qo'shilmaydi.
 * Ishga tushirish: npm run seed:menu
 */

const MENU_DIR = "./kervan-menu";
const UPLOAD_DIR = "./uploads/products";
const PLACEHOLDER_IMAGE = "placeholder.jpeg";
const DEFAULT_LEFT_COUNT = 100;

// "15900" => "15,900₩"
const formatPrice = (price: number) => `${price.toLocaleString("en-US")}₩`;

// JSON'dagi courseOption, addOns, variants, availability, pricePer —
// alohida schema yo'q, shuning uchun productDesc oxiriga matn bo'lib qo'shiladi
function buildDesc(item: any): string {
  const lines: string[] = [item.descEn];

  if (item.pricePer === "PERSON")
    lines.push(`Price per person (${item.minPeople}–${item.maxPeople} people)`);

  if (item.variants) {
    const variants = item.variants.map((ele: any) =>
      typeof ele === "string" ? ele : `${ele.nameEn} ${formatPrice(ele.price)}`,
    );
    lines.push(`Options: ${variants.join(" / ")}`);
  }

  if (item.courseOption)
    lines.push(
      `Course: ${item.courseOption.nameEn} +${formatPrice(item.courseOption.price)}`,
    );

  if (item.addOns) {
    const addOns = item.addOns.map(
      (ele: any) => `${ele.nameEn} +${formatPrice(ele.price)}`,
    );
    lines.push(`Add-on: ${addOns.join(", ")}`);
  }

  if (item.availability) {
    const holidays = item.availability.exceptHolidays ? " (except holidays)" : "";
    lines.push(
      `Available ${item.availability.days} ${item.availability.from}–${item.availability.to}${holidays}`,
    );
  }

  return lines.join(" | ");
}

// kervan-menu/images/xxx.webp => uploads/products/xxx.webp (Multer saqlaydigan papka)
// Rasm yo'q bo'lsa — placeholder, keyin admin panel orqali almashtiriladi
function copyImage(image: string | null): string {
  if (!image) {
    const target = path.join(UPLOAD_DIR, PLACEHOLDER_IMAGE);
    if (!fs.existsSync(target))
      fs.copyFileSync("./src/public/img/default.jpeg", target);
    return `uploads/products/${PLACEHOLDER_IMAGE}`;
  }

  const target = path.join(UPLOAD_DIR, image);
  if (!fs.existsSync(target))
    fs.copyFileSync(path.join(MENU_DIR, "images", image), target);
  return `uploads/products/${image}`;
}

async function seedMenu() {
  const productService = new ProductService();
  const menu = JSON.parse(
    fs.readFileSync(path.join(MENU_DIR, "kervan-menu.json"), "utf-8"),
  );
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });

  // 1. Eski test mahsulotlari (KEBAB, MEZE, SET_MENU ...) — yangi enum'da yo'q.
  //    O'chirmaymiz, faqat DELETE statusiga o'tkazamiz — buyurtmalar tarixi buzilmaydi
  const oldResult = await ProductModel.updateMany(
    {
      productCollection: { $nin: Object.values(ProductCollection) },
      productStatus: { $ne: ProductStatus.DELETE },
    },
    { productStatus: ProductStatus.DELETE },
  ).exec();
  console.log(`Old products moved to DELETE: ${oldResult.modifiedCount}`);

  // 2. Menyudagi mahsulotlar
  let added = 0,
    updated = 0,
    skipped = 0,
    failed = 0;

  for (const item of menu.products) {
    const input: ProductInput = {
      productStatus: ProductStatus.PROCESS,
      productCollection: item.category as ProductCollection,
      productName: item.nameEn,
      productNameKo: item.nameKo,
      productPrice: item.price,
      productLeftCount: DEFAULT_LEFT_COUNT,
      productDesc: buildDesc(item),
      productDescKo: item.descKo,
      productTags: item.tags as ProductTag[],
      productSortOrder: item.sortOrder,
      productImages: [copyImage(item.image)],
    };

    try {
      const exist = await ProductModel.findOne({
        productName: item.nameEn,
      }).exec();

      if (!exist) {
        await productService.createNewProduct(input);
        console.log(`add:    ${item.nameEn}`);
        added++;
      } else if (
        exist.productStatus === ProductStatus.DELETE &&
        !Object.values(ProductCollection).includes(exist.productCollection)
      ) {
        // Eski test mahsuloti bilan nomi bir xil — unique index (productName) tufayli
        // yangisini qo'shib bo'lmaydi, shuning uchun eskisini menyu ma'lumoti bilan yangilaymiz
        await productService.updateChosenProduct(String(exist._id), {
          _id: exist._id,
          ...input,
        });
        console.log(`update: ${item.nameEn}`);
        updated++;
      } else {
        console.log(`skip:   ${item.nameEn}`);
        skipped++;
      }
    } catch (err) {
      console.log(`fail:   ${item.nameEn}`);
      failed++;
    }
  }

  console.log(
    `\nTotal: ${menu.products.length}, added: ${added}, updated: ${updated}, skipped: ${skipped}, failed: ${failed}`,
  );
}

mongoose
  .connect(process.env.MONGO_URL as string, {})
  .then(async () => {
    console.log("MongoDB connection succeed");
    await seedMenu();
  })
  .catch((err) => console.log("Error, seed-menu:", err))
  .finally(() => mongoose.disconnect());
