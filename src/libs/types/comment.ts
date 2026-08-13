import { ObjectId } from "mongoose";

// Sharh muallifi haqida faqat OCHIQ ma'lumot — parol/karta kabi maxfiy
// fieldlar bu yerga hech qachon qo'shilmasligi kerak (public endpoint)
export interface CommentAuthor {
  _id: ObjectId;
  memberNick: string;
  memberImage?: string;
}

export interface Comment {
  _id: ObjectId;
  commentText: string;
  commentRating: number;
  memberId: ObjectId;
  productId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  /** from aggregation **/
  memberData?: CommentAuthor[];
}

export interface CommentInput {
  commentText: string;
  commentRating: number;
  productId: ObjectId | string;
}
