import BranchModel from "../schema/Branch.model";
import {
  Branch,
  BranchInput,
  BranchStats,
  BranchUpdateInput,
} from "../libs/types/branch";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { shapeIntoMongooseObjectId } from "../libs/config";

class BranchService {
  private readonly branchModel;

  constructor() {
    this.branchModel = BranchModel;
  }

  /** SSR + SPA */

  public async createBranch(input: BranchInput): Promise<Branch> {
    try {
      const result = await this.branchModel.create(input);
      return result;
    } catch (err) {
      console.log("Error, model:createBranch:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async getAllBranches(): Promise<Branch[]> {
    const result = await this.branchModel
      .find()
      .sort({ branchName: 1 }) // COEX → FAMILLE → ITAEWON (A-Z tartib)
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  public async updateChosenBranch(input: BranchUpdateInput): Promise<Branch> {
    input._id = shapeIntoMongooseObjectId(input._id);
    const result = await this.branchModel
      .findByIdAndUpdate({ _id: input._id }, input, {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }

  // ✅ YANGI — Branch sahifasi uchun umumiy statistika
  public async getBranchStats(): Promise<BranchStats> {
    const branches = await this.branchModel.find().exec();

    const totalBranches = branches.length;

    const totalStaff = branches.reduce((sum, branch) => {
      return sum + (branch.branchStaffCount ?? 0);
    }, 0);

    const avgRating =
      totalBranches > 0
        ? branches.reduce((sum, branch) => {
            return sum + (branch.branchRating ?? 0);
          }, 0) / totalBranches
        : 0;

    return {
      totalBranches,
      totalStaff,
      avgRating: Math.round(avgRating * 10) / 10, // 4.7 formatida
    };
  }
}

export default BranchService;
