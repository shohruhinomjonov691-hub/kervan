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
