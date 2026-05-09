import { T } from "../libs/types/common";
import { shapeIntoMongooseObjectId } from "../libs/config";
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
      match.productName = { $regex: new RegExp(inquiry.search, "i") }; // i => case insensitive"flag"
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

  // Product.service.ts ichida getALLProduct() ni shu bilan almashtiring:

  public async getALLProduct(
    inquiry: AdminProductInquiry,
  ): Promise<AdminProductResult> {
    // Pagination bilan mahsulotlar
    const products = await this.productModel
      .find()
      .sort({ createdAt: -1 }) // eng yangi tepada
      .skip((inquiry.page - 1) * inquiry.limit)
      .limit(inquiry.limit)
      .exec();

    // Status counts — Promise.all bilan parallel so'rov (tezroq)
    const [totalCount, processCount, pauseCount, deleteCount] =
      await Promise.all([
        this.productModel.countDocuments(),
        this.productModel.countDocuments({ productStatus: "PROCESS" }),
        this.productModel.countDocuments({ productStatus: "PAUSE" }),
        this.productModel.countDocuments({ productStatus: "DELETE" }),
      ]);

    // Trending — eng ko'p ko'rilgan mahsulot
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

  public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      return await this.productModel.create(input);
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
    const result = await this.productModel
      .findOneAndUpdate({ _id: id }, input, { new: true })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }
}

export default ProductService;
