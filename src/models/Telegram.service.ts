import Errors, { HttpCode, Message } from "../libs/Errors";
import { BookingInput, ContactInput } from "../libs/types/contact";

// Bot token/chat id ilgari frontend'ning REACT_APP_ o'zgaruvchilarida edi —
// Create React App bu qiymatlarni build vaqtida bundle ichiga tekis
// joylashtiradi, ya'ni har qanday ziyoratchi brauzer konsolidan tokenni
// o'qib ola olardi. Shu sabab yuborish backendga ko'chirildi.
class TelegramService {
  private readonly apiUrl: string;
  private readonly chatId: string | undefined;

  constructor() {
    this.apiUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    this.chatId = process.env.TELEGRAM_CHAT_ID;
  }

  public async sendBooking(input: BookingInput): Promise<void> {
    const message =
      `📅 <b>NEW RESERVATION</b>\n\n` +
      `👤 <b>Name:</b> ${input.name}\n` +
      `📞 <b>Phone:</b> ${input.phone}\n` +
      `📍 <b>Branch:</b> ${input.branch}\n` +
      `📆 <b>Date:</b> ${input.date}\n` +
      `🕐 <b>Time:</b> ${input.time}\n` +
      `👥 <b>Guests:</b> ${input.guests}`;

    await this.send(message);
  }

  public async sendContact(input: ContactInput): Promise<void> {
    const message =
      `📩 <b>NEW INQUIRY</b>\n\n` +
      `👤 <b>Name:</b> ${input.name}\n` +
      `📧 <b>Email:</b> ${input.email}\n` +
      `💬 <b>Message:</b> ${input.message}`;

    await this.send(message);
  }

  private async send(text: string): Promise<void> {
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: this.chatId,
          text,
          parse_mode: "HTML",
        }),
      });
      if (!response.ok) throw new Error(`Telegram API ${response.status}`);
    } catch (err) {
      console.log("Error, TelegramService:send:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
}

export default TelegramService;
