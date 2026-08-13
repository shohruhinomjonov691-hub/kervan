import { Request, Response } from "express";
import { T } from "../libs/types/common";
import Errors, { HttpCode } from "../libs/Errors";
import TelegramService from "../models/Telegram.service";
import { BookingInput, ContactInput } from "../libs/types/contact";

const telegramService = new TelegramService();

const contactController: T = {};

contactController.sendBooking = async (req: Request, res: Response) => {
  try {
    console.log("sendBooking");
    const input: BookingInput = req.body;
    await telegramService.sendBooking(input);

    res.status(HttpCode.OK).json({ sent: true });
  } catch (err) {
    console.log("Error, sendBooking:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

contactController.sendContact = async (req: Request, res: Response) => {
  try {
    console.log("sendContact");
    const input: ContactInput = req.body;
    await telegramService.sendContact(input);

    res.status(HttpCode.OK).json({ sent: true });
  } catch (err) {
    console.log("Error, sendContact:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default contactController;
