import Errors, { HttpCode } from "../libs/Errors";
import { AUTH_TIMER } from "../libs/config";
import { Member } from "../libs/types/member";
import jwt from "jsonwebtoken";
import { ErrorReason, Message } from "../libs/Errors";

class AuthService {
  private readonly secretToken;
  constructor() {
    this.secretToken = process.env.SECRET_TOKEN as string;
  }

  // MEMBER > TOKEN
  public async createToken(payload: Member): Promise<string> {
    return new Promise((resolve, reject) => {
      const duration = `${AUTH_TIMER}h`;
      jwt.sign(
        payload,
        process.env.SECRET_TOKEN as string,
        { expiresIn: duration },
        (err, token) => {
          if (err)
            reject(
              new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CREATION_FAILED),
            );
          else resolve(token as string);
        },
      );
    });
  }

  // TOKEN > MEMBER
  public async checkAuth(token: string): Promise<Member> {
    // Secret yo'qligi — server konfiguratsiya xatosi (500). jsonwebtoken buni
    // ham JsonWebTokenError qilib tashlaydi, shuning uchun oldindan ajratiladi;
    // aks holda pastda 401 bo'lib, frontend barcha userlarni logout qilardi
    if (!this.secretToken) {
      throw new Error("SECRET_TOKEN is not configured");
    }

    let result: Member;
    try {
      result = jwt.verify(token, this.secretToken) as Member;
    } catch (err) {
      // Faqat token o'zi yaroqsiz bo'lsa 401: buzilgan/imzosi noto'g'ri
      // (JsonWebTokenError), muddati o'tgan (TokenExpiredError) yoki hali
      // aktiv emas (NotBeforeError) — ikkalasi ham JsonWebTokenError'dan.
      // Boshqa kutilmagan xatolar 500 bo'lib qolishi uchun qayta tashlanadi
      if (err instanceof jwt.JsonWebTokenError) {
        throw new Errors(
          HttpCode.UNAUTHORIZED,
          Message.NOT_AUTHENTICATED,
          ErrorReason.AUTH_REQUIRED,
        );
      }
      throw err;
    }
    console.log(`--- [AUTH] memberNick: ${result.memberNick} ---`);
    return result;
  }
}

export default AuthService;

// YORDAMCHI (SERVICE)> AUTH + LIKE + COMMMENT
