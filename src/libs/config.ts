export const AUTH_TIMER = 24;
export const MORGAN_FORMAT = `:method :url :response-time [:status] \n`;
// method - get yoki post
// url - router
// response-time - qancha muddatda oberdi (tezlik muhim)
// status - qanaqa natija bergani

import mongoose from "mongoose";
export const shapeIntoMongooseObjectId = (target: any) => {
  return typeof target === "string"
    ? new mongoose.Types.ObjectId(target)
    : target;
};

// Client'dan kelgan id ni Mongoose'ga uzatishdan oldin tekshirish uchun —
// noto'g'ri formatdagi id CastError bilan 500'ga emas, 404'ga olib borsin
export const isValidObjectId = (target: any): boolean => {
  return mongoose.Types.ObjectId.isValid(target);
};
