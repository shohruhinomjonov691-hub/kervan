import CommentModel from "../schema/Comment.model";
import ProductModel from "../schema/Product.model";
import { Member } from "../libs/types/member";
import { Comment, CommentInput } from "../libs/types/comment";
import { isValidObjectId, shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";

class CommentService {
  private readonly commentModel;
  private readonly productModel;

  constructor() {
    this.commentModel = CommentModel;
    this.productModel = ProductModel;
  }

  public async createComment(
    member: Member,
    input: CommentInput,
  ): Promise<Comment> {
    const commentText = (input.commentText || "").trim();
    if (!commentText) throw new Errors(HttpCode.BAD_REQUEST, Message.EMPTY_COMMENT);
    if (!isValidObjectId(input.productId)) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }

    const memberId = shapeIntoMongooseObjectId(member._id);
    const productId = shapeIntoMongooseObjectId(input.productId);

    // Sharh biriktirilayotgan mahsulot haqiqatan mavjudligini tekshiramiz
    const product = await this.productModel.findById(productId).exec();
    if (!product) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    try {
      const result = await this.commentModel.create({
        commentText,
        commentRating: input.commentRating,
        memberId,
        productId,
      });

      // getCommentsByProduct bilan bir xil javob shakli bo'lishi uchun —
      // frontend har ikkala endpointni bir xil ishlata olsin. Faqat ochiq
      // ma'lumot (JWT'dan) — parol/karta hech qachon qo'shilmaydi
      const resultObj: Comment = result.toObject();
      resultObj.memberData = [
        {
          _id: member._id,
          memberNick: member.memberNick,
          memberImage: member.memberImage,
        },
      ];
      return resultObj;
    } catch (err) {
      console.log("Error, model:createComment:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async getCommentsByProduct(productId: string): Promise<Comment[]> {
    if (!isValidObjectId(productId)) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }
    const prodId = shapeIntoMongooseObjectId(productId);

    const result = await this.commentModel
      .aggregate([
        { $match: { productId: prodId } },
        { $sort: { createdAt: -1 } },
        {
          // Faqat ochiq/xavfsiz fieldlar — memberPassword, memberPayment kabi
          // maxfiy ma'lumotlar public comment javobiga hech qachon chiqmasin
          $lookup: {
            from: "members",
            let: { memberId: "$memberId" },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$memberId"] } } },
              { $project: { memberNick: 1, memberImage: 1 } },
            ],
            as: "memberData",
          },
        },
      ])
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }
}

export default CommentService;
