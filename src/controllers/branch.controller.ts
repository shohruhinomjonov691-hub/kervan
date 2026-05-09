import { Request, Response } from "express";
import { T } from "../libs/types/common";
import BranchService from "../models/Branch.service";
import { AdminRequest } from "../libs/types/member";
import { BranchInput, BranchUpdateInput } from "../libs/types/branch";
import Errors, { HttpCode, Message } from "../libs/Errors";

// Controllerlar hammasi - Object
// Modellar hammasi - Class

const branchService = new BranchService();

const branchController: T = {}; // Object

branchController.getAllBranches = async (req: Request, res: Response) => {
  try {
    console.log("getAllBranches");
    const result = await branchService.getAllBranches();
    console.log("branches:", result);

    res.render("branches", { branches: result });
  } catch (err) {
    console.log("Error, getAllBranches:", err);
    res.redirect("/admin/login");
  }
};
/** SPA - React frontend uchun **/
branchController.getBranches = async (req: Request, res: Response) => {
  try {
    console.log("getBranches");
    const result = await branchService.getAllBranches();

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getBranches:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

branchController.createBranch = async (req: AdminRequest, res: Response) => {
  try {
    console.log("createBranch");
    console.log("req.body:", req.body);

    const newBranch: BranchInput = req.body;
    if (req.file) newBranch.branchImage = req.file.path.replace(/\\/g, "/");

    await branchService.createBranch(newBranch);

    res.send(
      `<script> alert("Branch created successfully!"); window.location.replace('/admin/branch/all') </script>`,
    );
  } catch (err) {
    console.log("Error, createBranch:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert("${message}"); window.location.replace('/admin/branch/all') </script>`,
    );
  }
};

branchController.updateChosenBranch = async (req: Request, res: Response) => {
  try {
    console.log("updateChosenBranch");
    const result = await branchService.updateChosenBranch(req.body);

    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error, updateChosenBranch:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default branchController;
