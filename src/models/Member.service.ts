import MemberModel from "../schema/Member.model";
import { Member, MemberInput, MemberUpdateInput } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import { LoginInput } from "../libs/types/member";
import * as bcrypt from "bcryptjs";
import { shapeIntoMongooseObjectId } from "../libs/config";

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

    try {
      // const result = await this.memberModel.create(input);
      const result = await this.memberModel.create(input); // call pass-(argument)
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
      .findById({ _id: memberId, memberStatus: MemberStatus.ACTIVE })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  public async updateMember(
    member: Member,
    input: MemberUpdateInput,
  ): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const result = await this.memberModel
      .findOneAndUpdate({ _id: memberId }, input, { new: true })
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
      .sort({ memberPoints: -1 })
      .limit(4)
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  public async addUserPoint(member: Member, point: number): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);

    return await this.memberModel
      .findByIdAndUpdate(
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
  public async getUsers(): Promise<Member[]> {
    // Promisda Memberdi qaytaradi
    // memberSkimaModel- class, find-static method (classdi),
    const result = await this.memberModel
      .find({ memberType: MemberType.USER })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  // Define(parametr)
  // getUsers+async+public+metnodi
  public async updateChosenUser(input: MemberUpdateInput): Promise<Member> {
    // Promisda Memberdi qaytaradi
    input._id = shapeIntoMongooseObjectId(input._id);
    // memberSkimaModel- class, find-static method (classdi),
    const result = await this.memberModel
      .findByIdAndUpdate({ _id: input._id }, input, {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    return result;
  }
}

export default MemberService;
