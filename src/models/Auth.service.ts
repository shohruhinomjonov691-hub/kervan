import Errors, { HttpCode } from "../libs/Errors";
import { AUTH_TIMER } from "../libs/config";
import { Member } from "../libs/types/member";
import jwt from "jsonwebtoken";
import { Message } from "../libs/Errors";

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
    let result: Member;
    try {
      result = jwt.verify(token, this.secretToken) as Member;
    } catch (err) {
      // Muddati o'tgan/buzilgan token — bu server xatosi (500) emas, 401.
      // Frontend 401'da logout qiladi, 5xx'da esa sessiyani saqlab qoladi
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
    }
    console.log(`--- [AUTH] memberNick: ${result.memberNick} ---`);
    return result;
  }
}

export default AuthService;

// YORDAMCHI (SERVICE)> AUTH + LIKE + COMMMENT
