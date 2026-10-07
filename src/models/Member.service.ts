import MemberModel from "../schema/Member.model";
import {
  Member,
  MemberInput,
  MemberPaymentInput,
  MemberUpdateInput,
  UserInquiry,
  UserStats,
} from "../libs/types/member";
import Errors, { ErrorReason, HttpCode, Message } from "../libs/Errors";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import { LoginInput } from "../libs/types/member";
import * as bcrypt from "bcryptjs";
import { shapeIntoMongooseObjectId } from "../libs/config";
import {
  generateDemoCard,
  isValidCardHolder,
  isValidExpiry,
} from "../libs/utils/demoCard";

// Public endpointlar (top-users) uchun — memberPhone, memberAddress,
// memberPayment kabi shaxsiy maydonlar tashqariga chiqmasin
const PUBLIC_MEMBER_PROJECTION = {
  memberNick: 1,
  memberImage: 1,
  memberPoints: 1,
  memberType: 1,
};

class MemberService {
  private readonly memberModel;

  constructor() {
    this.memberModel = MemberModel;
  }

  /** SPA */
  // Define-1 (parametr)
  public async getRestaurant(): Promise<Member> {
    const result = await this.memberModel
      .findOne({ memberType: MemberType.RESTAURANT })
      .lean()
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  // Define-1 (parametr)
  // public+signup+async+metnodi,uning input nomli parametri bor,
  public async signup(input: MemberInput): Promise<Member> {
    // Promisda Memberdi qaytaradi
    const salt = await bcrypt.genSalt(); // hashlash (tuzlash)
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt); // SHA-256 hash algoritimi

    // Har bir yangi user demo karta bilan yaratiladi — bitta create ichida,
    // shuning uchun "user bor, karta yo'q" degan yarim holat bo'lmaydi
    const memberPayment = generateDemoCard(String(input.memberNick ?? ""));

    try {
      const result = await this.memberModel.create({ ...input, memberPayment }); // call pass-(argument)
      // memberSkimaModel+create+method
      result.memberPassword = "";
      return result.toJSON();
    } catch (err) {
      console.log("Error, model:signup", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE); // Custimayzed Erorrlar
    }
  }

  // Define qismi
  public async login(input: LoginInput): Promise<Member> {
    // TODD: Consider member status later
    const member = await this.memberModel
      // memberSkimaModel+Static+methodi.findOne > QueryObject
      .findOne(
        // findOneStatic methodga argument pass qilayapman
        {
          memberNick: input.memberNick,
          memberStatus: { $ne: MemberStatus.DELETE },
        }, // Object, Filter
        { memberNick: 1, memberPassword: 1, memberStatus: 1 }, // Object, Projection
      )
      .exec();
    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);
    else if (member.memberStatus === MemberStatus.BLOCK) {
      throw new Errors(HttpCode.FORBIDDEN, Message.BLOCKED_USER);
    }

    console.log("member:", member);

    const isMatch = await bcrypt.compare(
      // isMatch - type boolean (true, false)
      input.memberPassword, // argument (call)
      member.memberPassword, // argument (call)
    );

    if (!isMatch) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
    }

    return await this.memberModel.findById(member._id).lean().exec();
    // methodga argument pass qilayapmiz,
    // lean()databasedagi malumotga ishlov beradi
  }

  public async getMemberDetail(member: Member): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const result = await this.memberModel
      .findOne({ _id: memberId, memberStatus: MemberStatus.ACTIVE })
      .exec();
    // Token yaroqli, lekin member bloklangan/o'chirilgan — frontend shu
    // reason orqali buni umumiy 404'dan ajratib, logout qiladi
    if (!result)
      throw new Errors(
        HttpCode.NOT_FOUND,
        Message.NO_DATA_FOUND,
        ErrorReason.MEMBER_INACTIVE,
      );
    return result;
  }

  public async updateMember(
    member: Member,
    input: MemberUpdateInput,
  ): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    // Faqat o'z profilini o'zgartira oladigan fieldlar — memberType/memberStatus/
    // memberPoints/_id kabi imtiyozli fieldlar bu yerdan o'zgartirilmasligi kerak
    const safeInput = {
      memberNick: input.memberNick,
      memberPhone: input.memberPhone,
      memberAddress: input.memberAddress,
      memberDesc: input.memberDesc,
      memberImage: input.memberImage,
    };
    const result = await this.memberModel
      .findOneAndUpdate({ _id: memberId }, safeInput, { new: true })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    return result;
  }

  public async getTopUsers(): Promise<Member[]> {
    const result = await this.memberModel
      .find({
        memberStatus: MemberStatus.ACTIVE,
        memberPoints: { $gte: 1 },
      })
      .select(PUBLIC_MEMBER_PROJECTION)
      .sort({ memberPoints: -1 })
      .limit(4)
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  public async addUserPoint(member: Member, point: number): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);

    return await this.memberModel
      .findOneAndUpdate(
        {
          _id: memberId,
          memberType: MemberType.USER,
          memberStatus: MemberStatus.ACTIVE,
        },
        { $inc: { memberPoints: point } },
        { new: true },
      )
      .exec();
  }

  /** SSR */

  // Define-1 (parametr)
  // processSignup+async+public+metnodi,uning input nomli parametri bor,
  public async processSignup(input: MemberInput): Promise<Member> {
    // Promisda Memberdi qaytaradi
    // memberSkimaModel- class, findOne -static method (classdi),
    const exist = await this.memberModel // class + staticMethod
      .findOne({ memberType: MemberType.RESTAURANT }) // > QueryObject
      .exec(); // QueryObject.+exec()Methodi > QueryObject
    console.log("exist:", exist); // exist Malumot(Restaurant) mavjud yoki mavjudmasligini topib beradi
    if (exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

    const salt = await bcrypt.genSalt(); // hashlash (tuzlash)
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt); // SHA-256 hash algoritimi

    try {
      const result = await this.memberModel.create(input); // call pass-(argument)
      result.memberPassword = "";

      return result;
    } catch (err) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED); // Custimayzed Erorrlar
    }
  }

  public async processLogin(input: LoginInput): Promise<Member> {
    const member = await this.memberModel // memberSkimaModel+Static+methodi.findOne > QueryObject
      .findOne(
        // findOneStatic methodga argument pass qilayapman
        { memberNick: input.memberNick, memberType: MemberType.RESTAURANT }, // Object, Filter
        { memberNick: 1, memberPassword: 1 }, // Object, Projection
      )
      .exec();
    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);

    const isMatch = await bcrypt.compare(
      // type boolean
      input.memberPassword, // argument (call)
      member.memberPassword, // argument (call)
    );

    // const isMatch = input.memberPassword === member.memberPassword;
    if (!isMatch) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
    }

    return await this.memberModel.findById(member._id).exec(); // methodga argument pass qilayapmiz
  }

  // Define(parametr)
  // getUsers+async+public+metnodi
  // Member.service.ts ichida getUsers() ni shu bilan almashtiring:

  private buildUsersMatch(inquiry: UserInquiry): any {
    const match: any = { memberType: MemberType.USER };
    if (inquiry.memberStatus) {
      match.memberStatus = inquiry.memberStatus;
    }
    return match;
  }

  public async getUsers(inquiry: UserInquiry): Promise<Member[]> {
    const match = this.buildUsersMatch(inquiry);

    // Sort: createdAt yoki memberPoints
    const sort: any =
      inquiry.sort === "memberPoints"
        ? { memberPoints: -1 }
        : { createdAt: -1 }; // default: eng yangi user tepada

    const result = await this.memberModel
      .find(match)
      .sort(sort)
      .skip((inquiry.page - 1) * inquiry.limit)
      .limit(inquiry.limit)
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  // ✅ YANGI — Users pagination uchun umumiy son (filterga mos)
  public async getUsersCount(inquiry: UserInquiry): Promise<number> {
    const match = this.buildUsersMatch(inquiry);
    return await this.memberModel.countDocuments(match).exec();
  }

  // ✅ YANGI — User sahifasi uchun status counts
  public async getUserStats(): Promise<UserStats> {
    const [activeCount, blockCount, deleteCount] = await Promise.all([
      this.memberModel.countDocuments({
        memberType: MemberType.USER,
        memberStatus: MemberStatus.ACTIVE,
      }),
      this.memberModel.countDocuments({
        memberType: MemberType.USER,
        memberStatus: MemberStatus.BLOCK,
      }),
      this.memberModel.countDocuments({
        memberType: MemberType.USER,
        memberStatus: MemberStatus.DELETE,
      }),
    ]);

    return { activeCount, blockCount, deleteCount };
  }

  // Define(parametr)
  // getUsers+async+public+metnodi
  public async updateChosenUser(input: MemberUpdateInput): Promise<Member> {
    // Promisda Memberdi qaytaradi
    const memberId = shapeIntoMongooseObjectId(input._id);
    // Admin user-edit faqat memberStatus'ni o'zgartira oladi (block/unblock/delete) —
    // memberType, memberPoints, memberPassword kabi fieldlar bu yerdan o'zgarmasligi kerak
    const safeInput = { memberStatus: input.memberStatus };
    const result = await this.memberModel
      .findOneAndUpdate({ _id: memberId }, safeInput, {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    return result;
  }

  /** PAYMENT — demo/portfolio karta: real bank kartasi talab qilinmaydi,
   * pul yechilmaydi. Raqam tizim tomonidan generatsiya qilinadi (faqat last4),
   * user faqat cardHolder va cardExpiry'ni tahrirlay oladi **/

  public async savePaymentMethod(
    member: Member,
    input: MemberPaymentInput,
  ): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const cardHolder = String(input?.cardHolder ?? "").trim();
    const cardExpiry = String(input?.cardExpiry ?? "").trim();

    if (!isValidCardHolder(cardHolder) || !isValidExpiry(cardExpiry)) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.INVALID_CARD);
    }

    // Faqat mavjud kartani tahrirlaydi — cardBrand/cardLast4 o'zgarmaydi
    const result = await this.memberModel
      .findOneAndUpdate(
        { _id: memberId, "memberPayment.cardLast4": { $exists: true } },
        {
          $set: {
            "memberPayment.cardHolder": cardHolder,
            "memberPayment.cardExpiry": cardExpiry,
          },
        },
        { new: true },
      )
      .exec();
    if (!result)
      throw new Errors(HttpCode.BAD_REQUEST, Message.NO_PAYMENT_METHOD);

    return result;
  }

  // Kartasi yo'q (eski yoki kartani o'chirgan) user uchun. Karta allaqachon
  // bo'lsa, mavjudini o'zgartirmasdan qaytaradi — takroriy bosish xavfsiz
  public async generatePaymentMethod(member: Member): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const current = await this.memberModel
      .findOne({ _id: memberId, memberStatus: MemberStatus.ACTIVE })
      .exec();
    if (!current) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    if (current.memberPayment?.cardLast4) return current;

    const memberPayment = generateDemoCard(current.memberNick);
    const result = await this.memberModel
      .findOneAndUpdate(
        { _id: memberId, "memberPayment.cardLast4": { $exists: false } },
        { $set: { memberPayment } },
        { new: true },
      )
      .exec();

    // Parallel so'rov kartani birinchi yaratgan bo'lsa — o'shani qaytaramiz
    return result ?? (await this.memberModel.findById(memberId).exec());
  }

  public async removePaymentMethod(member: Member): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);

    const result = await this.memberModel
      .findOneAndUpdate(
        { _id: memberId },
        { $unset: { memberPayment: "" } },
        { new: true },
      )
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    return result;
  }

  // OrderService orqali payment gate uchun — JWT'dagi eski (stale) member
  // ma'lumotiga emas, doim MongoDB'dagi eng yangi holatga ishonadi
  public async hasPaymentMethod(memberId: any): Promise<boolean> {
    const id = shapeIntoMongooseObjectId(memberId);
    const member = await this.memberModel
      .findById(id)
      .select("memberPayment")
      .exec();
    return !!member?.memberPayment?.cardLast4;
  }
}

export default MemberService;
