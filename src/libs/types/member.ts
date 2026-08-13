import { ObjectId } from "mongoose";
import { MemberStatus, MemberType } from "../enums/member.enum";
import { Request } from "express";
import { Session } from "express-session";

export interface MemberPayment {
  cardBrand: string;
  cardLast4: string;
  cardHolder: string;
  cardExpiry: string;
}

// Raw form input — validated then reduced to MemberPayment; the full
// number and CVV are never persisted or logged
export interface MemberPaymentInput {
  cardNumber: string;
  cardHolder: string;
  cardExpiry: string;
  cardCvv: string;
}

export interface Member {
  _id: ObjectId;
  memberType: MemberType;
  memberStatus: MemberStatus;
  memberNick: string;
  memberPhone: string;
  memberPassword?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
  memberPoints: number;
  memberPayment?: MemberPayment;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberInput {
  memberType?: MemberType;
  memberStatus?: MemberStatus;
  memberNick: string;
  memberPhone: string;
  memberPassword: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
  memberPoints?: number;
}

export interface LoginInput {
  memberNick: string;
  memberPassword: string;
}

export interface MemberUpdateInput {
  _id: ObjectId;
  memberStatus?: MemberStatus;
  memberNick?: string;
  memberPhone?: string;
  memberPassword?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
}

export interface ExtendedRequest extends Request {
  member: Member;
  file: Express.Multer.File;
  files: Express.Multer.File[];
}

export interface AdminRequest extends Request {
  member: Member;
  session: Session & { member: Member };
  file: Express.Multer.File;
  files: Express.Multer.File[];
}

// ✅ YANGI UserInquiry type — libs/types/member.ts ga qo'shing
export interface UserInquiry {
  page: number;
  limit: number;
  memberStatus?: MemberStatus;
  sort?: string; // "createdAt" | "memberPoints"
}

// ✅ YANGI UserStats type — libs/types/member.ts ga qo'shing
export interface UserStats {
  activeCount: number;
  blockCount: number;
  deleteCount: number;
}
