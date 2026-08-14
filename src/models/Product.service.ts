import { T } from "../libs/types/common";
import {
  escapeRegExp,
  isValidObjectId,
  shapeIntoMongooseObjectId,
} from "../libs/config";
import Errors, { Message } from "../libs/Errors";
import ProductModel from "../schema/Product.model";
import { HttpCode } from "../libs/Errors";
import {
  AdminProductInquiry,
  AdminProductResult,
  Product,
  ProductInput,
  ProductInquiry,
  ProductUpdateInput,
} from "../libs/types/product";
import { ProductStatus } from "../libs/enums/product.enum";
import { ObjectId } from "mongoose";
import ViewService from "./View.service";
import { ViewInput } from "../libs/types/view";
import { ViewGroup } from "../libs/enums/view.enum";

class ProductService {
  private readonly productModel;
  public viewService;

  constructor() {
    this.productModel = ProductModel;
    this.viewService = new ViewService();
  }

  /** SPA */
  public async getProducts(inquiry: ProductInquiry): Promise<Product[]> {
    const match: T = { productStatus: ProductStatus.PROCESS };

    if (inquiry.productCollection)
      match.productCollection = inquiry.productCollection;

    if (inquiry.search) {
      match.productName = { $regex: new RegExp(escapeRegExp(inquiry.search), "i") }; // i => case insensitive"flag"
    }

    const sort: T =
      inquiry.order === "productPrice"
        ? { [inquiry.order]: 1 }
        : { [inquiry.order]: -1 };

    const result = await this.productModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        { $skip: (inquiry.page * 1 - 1) * inquiry.limit },
        { $limit: inquiry.limit * 1 },
      ])
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  public async getProduct(
    memberId: ObjectId | null,
    id: string,
  ): Promise<Product> {
    // Noto'g'ri formatdagi id ham xuddi "topilmadi" kabi javob olsin (500 emas)
    if (!isValidObjectId(id)) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }
    const productId = shapeIntoMongooseObjectId(id);

    let result = await this.productModel
      .findOne({
        _id: productId,
        productStatus: ProductStatus.PROCESS,
      })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    if (memberId) {
      // Check Existence
      const input: ViewInput = {
        memberId: memberId,
        viewRefId: productId,
        viewGroup: ViewGroup.PRODUCT,
      };
      const existView = await this.viewService.checkViewExistence(input);

      console.log("exist:", !!existView);
      if (!existView) {
        // Insert View
        await this.viewService.insertMemberView(input);

        // Increase Counts
        result = await this.productModel
          .findByIdAndUpdate(
            productId,
            { $inc: { productViews: +1 } },
            { new: true },
          )
          .exec();
      }
    }

    return result;
  }

  /** SSR */
  public async getALLProduct(
    inquiry: AdminProductInquiry,
  ): Promise<AdminProductResult> {
    // ✅ Filter object
    const filter: any = {};
    if (inquiry.productCollection)
      filter.productCollection = inquiry.productCollection; 
    if (inquiry.productStatus) filter.productStatus = inquiry.productStatus; 

    const products = await this.productModel
      .find(filter) 
      .sort({ createdAt: -1 })
      .skip((inquiry.page - 1) * inquiry.limit)
      .limit(inquiry.limit)
      .exec();

    const [totalCount, processCount, pauseCount, deleteCount] =
      await Promise.all([
        this.productModel.countDocuments(filter), 
        this.productModel.countDocuments({ productStatus: "PROCESS" }),
        this.productModel.countDocuments({ productStatus: "PAUSE" }),
        this.productModel.countDocuments({ productStatus: "DELETE" }),
      ]);

    const trendingProduct = await this.productModel
      .findOne({ productStatus: "PROCESS" })
      .sort({ productViews: -1 })
      .exec();

    return {
      products,
      totalCount,
      processCount,
      pauseCount,
      deleteCount,
      trendingProduct,
    };
  }

  // Admin status-o'zgartirish (AJAX) muvaffaqiyatli bo'lgandan keyin
  // stat-badge'larni sahifani qayta yuklamasdan yangilash uchun — getALLProduct
  // ichidagi hisoblash bilan bir xil, lekin ro'yxat/pagination'siz, alohida
  // chaqirilishi mumkin bo'lgan yengil metod
  public async getProductStats(): Promise<{
    totalCount: number;
    processCount: number;
    pauseCount: number;
    deleteCount: number;
  }> {
    const [totalCount, processCount, pauseCount, deleteCount] =
      await Promise.all([
        this.productModel.countDocuments({}),
        this.productModel.countDocuments({ productStatus: "PROCESS" }),
        this.productModel.countDocuments({ productStatus: "PAUSE" }),
        this.productModel.countDocuments({ productStatus: "DELETE" }),
      ]);

    return { totalCount, processCount, pauseCount, deleteCount };
  }

  public async createNewProduct(input: ProductInput): Promise<Product> {
    // updateChosenProduct bilan bir xil — productViews kabi server-boshqaruvidagi
    // fieldlar admin create formidan ham o'zgartirilmasin
    const safeInput = {
      productStatus: input.productStatus,
      productCollection: input.productCollection,
      productName: input.productName,
      productPrice: input.productPrice,
      productLeftCount: input.productLeftCount,
      productSize: input.productSize,
      productVolume: input.productVolume,
      productDesc: input.productDesc,
      productImages: input.productImages,
    };
    try {
      return await this.productModel.create(safeInput);
    } catch (err) {
      console.log("Error, model:createNewProduct:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async updateChosenProduct(
    id: string | string[],
    input: ProductUpdateInput,
  ): Promise<Product> {
    // string => ObjectId
    id = shapeIntoMongooseObjectId(id);
    // productViews va boshqa server-boshqaruvidagi fieldlar bu yerdan o'zgartirilmaydi
    const safeInput = {
      productStatus: input.productStatus,
      productCollection: input.productCollection,
      productName: input.productName,
      productPrice: input.productPrice,
      productLeftCount: input.productLeftCount,
      productSize: input.productSize,
      productVolume: input.productVolume,
      productDesc: input.productDesc,
      productImages: input.productImages,
    };
    const result = await this.productModel
      .findOneAndUpdate({ _id: id }, safeInput, { new: true })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }
}

export default ProductService;
