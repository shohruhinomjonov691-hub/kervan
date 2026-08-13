import OrderItemModel from "../schema/OrderItem.model";
import OrderModel from "../schema/Order.model";
import { Member } from "../libs/types/member";
import {
  OrderItemInput,
  Order,
  OrderInquiry,
  OrderUpdateInput,
} from "../libs/types/order";
import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { OrderStatus } from "../libs/enums/order.enum";
import { ObjectId } from "mongoose";
import MemberService from "./Member.service";

// Har bir target statusga o'tish faqat berilgan current statusdan ruxsat etiladi —
// shu bilan bir buyurtmani ikki marta "to'lash", statusni sakrab o'tkazish yoki
// orqaga qaytarish (masalan FINISH -> PAUSE) oldini oladi
const REQUIRED_CURRENT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  [OrderStatus.PROCESS]: OrderStatus.PAUSE, // to'lov: faqat PAUSE'dan
  [OrderStatus.FINISH]: OrderStatus.PROCESS, // qabul qilindi: faqat PROCESS'dan
  [OrderStatus.DELETE]: OrderStatus.PAUSE, // bekor qilish: faqat PAUSE'dan
};

class OrderService {
  private readonly orderModel;
  private readonly orderItemModel;
  private readonly memberService;

  constructor() {
    this.orderModel = OrderModel;
    this.orderItemModel = OrderItemModel;
    this.memberService = new MemberService();
  }

  public async createOrder(
    member: Member,
    input: OrderItemInput[],
  ): Promise<Order> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const amount = input.reduce((accumulator: number, item: OrderItemInput) => {
      return accumulator + item.itemPrice * item.itemQuantity;
    }, 0);
    const delivery = amount < 100 ? 5 : 0;

    try {
      const newOrder: Order = await this.orderModel.create({
        orderTotal: amount + delivery,
        orderDelivery: delivery,
        memberId: memberId,
      });

      const orderId = newOrder._id;
      console.log("newOrder:", orderId);
      await this.recordOrderItem(orderId, input);

      return newOrder;
    } catch (err) {
      console.log("Error, model:createOrder:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  private async recordOrderItem(
    orderId: ObjectId,
    input: OrderItemInput[],
  ): Promise<void> {
    const promisedList = input.map(async (item: OrderItemInput) => {
      item.orderId = orderId;
      item.productId = shapeIntoMongooseObjectId(item.productId);
      await this.orderItemModel.create(item);
      return "INSERTED";
    });

    const orderItemsState = await Promise.all(promisedList);
    console.log("orderItemsState:", orderItemsState);
  }

  public async getMyOrders(
    member: Member,
    inquiry: OrderInquiry,
  ): Promise<Order[]> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const matches = { memberId: memberId, orderStatus: inquiry.orderStatus };

    const result = await this.orderModel
      .aggregate([
        { $match: matches },
        { $sort: { updatedAt: -1 } },
        { $skip: (inquiry.page - 1) * inquiry.limit },
        { $limit: inquiry.limit },
        {
          $lookup: {
            from: "orderItems",
            localField: "_id",
            foreignField: "orderId",
            as: "orderItems",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "orderItems.productId",
            foreignField: "_id",
            as: "productData",
          },
        },
      ])
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  public async updateOrder(
    member: Member,
    input: OrderUpdateInput,
  ): Promise<Order> {
    const memberId = shapeIntoMongooseObjectId(member._id),
      orderId = shapeIntoMongooseObjectId(input.orderId),
      orderStatus = input.orderStatus;

    const requiredCurrentStatus = REQUIRED_CURRENT_STATUS[orderStatus];
    if (!requiredCurrentStatus) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.INVALID_ORDER_STATUS);
    }

    // "To'lash" (PAUSE -> PROCESS) faqat saqlangan payment method mavjud bo'lsa
    if (orderStatus === OrderStatus.PROCESS) {
      const hasPayment = await this.memberService.hasPaymentMethod(memberId);
      if (!hasPayment) {
        throw new Errors(HttpCode.BAD_REQUEST, Message.NO_PAYMENT_METHOD);
      }
    }

    // Filter ichida joriy statusni ham talab qilish — shu orqali bir buyurtma
    // ikki marta process qilinishi yoki noto'g'ri statusdan sakrashi mumkin emas
    const result = await this.orderModel
      .findOneAndUpdate(
        {
          memberId: memberId,
          _id: orderId,
          orderStatus: requiredCurrentStatus,
        },
        {
          orderStatus: orderStatus,
        },
        { new: true },
      )
      .exec();

    // 304 status body olib tashlanadi (HTTP spec) — replay/noto'g'ri o'tish
    // urinishida frontend aniq xabar ololmay qoladi, shuning uchun bu yerda 400 ishlatiladi
    if (!result) throw new Errors(HttpCode.BAD_REQUEST, Message.INVALID_ORDER_STATUS);

    if (orderStatus === OrderStatus.PROCESS) {
      await this.memberService.addUserPoint(member, 1);
    }
    return result;
  }
}

export default OrderService;
