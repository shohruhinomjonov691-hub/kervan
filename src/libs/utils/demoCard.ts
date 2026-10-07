import { randomInt } from "crypto";
import { MemberPayment } from "../types/member";

// Demo/portfolio karta — real bank kartasi emas, pul yechilmaydi.
// To'liq raqam umuman yaratilmaydi/saqlanmaydi: faqat UI'da ko'rsatiladigan last4
export const DEMO_CARD_BRAND = "DEMO";
const DEMO_CARD_YEARS = 3;
const CARD_HOLDER_MAX = 40;

const formatExpiry = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear() % 100).padStart(2, "0");
  return `${month}/${year}`;
};

export const generateDemoCard = (
  cardHolder: string,
  now: Date = new Date(),
): MemberPayment => {
  const expiry = new Date(now.getFullYear() + DEMO_CARD_YEARS, now.getMonth(), 1);
  return {
    cardBrand: DEMO_CARD_BRAND,
    cardLast4: String(randomInt(0, 10000)).padStart(4, "0"),
    cardHolder: cardHolder.trim().slice(0, CARD_HOLDER_MAX),
    cardExpiry: formatExpiry(expiry),
  };
};

export const isValidCardHolder = (cardHolder: string): boolean => {
  const value = cardHolder.trim();
  return value.length >= 2 && value.length <= CARD_HOLDER_MAX;
};

export const isValidExpiry = (expiry: string, now: Date = new Date()): boolean => {
  const match = /^(\d{2})\/(\d{2})$/.exec(expiry);
  if (!match) return false;

  const month = Number(match[1]);
  const year = Number(match[2]) + 2000;
  if (month < 1 || month > 12) return false;

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;

  return true;
};
