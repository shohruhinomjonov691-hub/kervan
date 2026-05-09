import { ObjectId } from "mongoose";
import { BranchName, BranchStatus } from "../enums/branch.enum";

export interface Branch {
  _id: ObjectId;
  branchName: BranchName;
  branchStatus: BranchStatus;
  branchAddress: string;
  branchPhone: string;
  branchDesc?: string;
  branchImage?: string;
  branchMapUrl?: string;
  branchHours?: string; 
  branchRating?: number; 
  branchStaffCount?: number; 
  createdAt: Date;
  updatedAt: Date;
}

export interface BranchInput {
  branchName: BranchName;
  branchStatus?: BranchStatus;
  branchAddress: string;
  branchPhone: string;
  branchDesc?: string;
  branchImage?: string;
  branchMapUrl?: string;
  branchHours?: string; 
  branchRating?: number; 
  branchStaffCount?: number; 
}

export interface BranchUpdateInput {
  _id: ObjectId;
  branchStatus?: BranchStatus;
  branchAddress?: string;
  branchPhone?: string;
  branchDesc?: string;
  branchImage?: string;
  branchMapUrl?: string;
  branchHours?: string;
  branchRating?: number;
  branchStaffCount?: number;
}

export interface BranchStats {
  totalBranches: number;
  totalStaff: number;
  avgRating: number;
}
