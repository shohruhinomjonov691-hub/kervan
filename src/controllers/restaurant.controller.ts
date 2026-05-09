import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";
import { AdminRequest, MemberInput, UserInquiry } from "../libs/types/member";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import { LoginInput } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import ProductService from "../models/Product.service";
import BranchService from "../models/Branch.service";

// Controllerlar hammasi - Object ,
// Modellar hammasi - Class

// MemberService Instodni memberServicega tenglayapmiz
const memberService = new MemberService();
const productService = new ProductService();
const branchService = new BranchService();

const restaurantController: T = {}; // Object
restaurantController.goHome = (req: Request, res: Response) => {
  try {
    console.log("goHome");
    res.render("home");
    // send() | json() | redirect() | end | render()
  } catch (err) {
    console.log("Error, goHome:", err);
    res.redirect("/admin");
  }
};

restaurantController.getSignup = (req: Request, res: Response) => {
  try {
    console.log("getSignup");
    res.render("signup");
  } catch (err) {
    console.log("Error, getSignup:", err);
    res.redirect("/admin");
  }
};

restaurantController.getLogin = (req: Request, res: Response) => {
  try {
    console.log("getLogin");
    res.render("login");
  } catch (err) {
    console.log("Error, getLogin:", err);
    res.redirect("/admin");
  }
};

// Define qismi (shartliy ravishda) - aslida Callback,
restaurantController.processSignup = async (
  req: AdminRequest,
  res: Response,
) => {
  try {
    // try va catch bilan hatolikdi handle qilayapmiz (server buzulmaydi)
    console.log("processSignup");
    console.log("req.body:", req.body);

    const file = req.file;
    if (!file)
      throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);

    const newMember: MemberInput = req.body;
    newMember.memberImage = file?.path; // .replace(/\\/g, "/");
    newMember.memberType = MemberType.RESTAURANT;
    const result = await memberService.processSignup(newMember); // Call-1 pass-(argument)
    // TODO: SESSIONS AUTHENTICATION

    req.session.member = result;
    req.session.save(function () {
      res.redirect("/admin/product/all");
    });
  } catch (err) {
    console.log("Error, processSignup:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert("${message}"); window.location.replace('/admin/signup') </script>`,
    );
  }
};

// Define
// restaurantController+objectini+async+processLogin+Methodini yaratayapman
// va uni 2 ta Paramentri bor (req, res)
restaurantController.processLogin = async (
  req: AdminRequest,
  res: Response,
) => {
  // Standartga mos try va catch dan foydalanayapman
  try {
    console.log("processLogin");
    console.log("req.body:", req.body);
    // req.bodyni inputga tenglayapmiz typi LoginInput(Interface-Soya)
    const input: LoginInput = req.body;
    const result = await memberService.processLogin(input); // Call pass-(argument)
    // SESSIONS AUTHORIZATION
    req.session.member = result;
    req.session.save(function () {
      res.redirect("/admin/product/all");
    });
  } catch (err) {
    console.log("Error, processLogin:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert("${message}"); window.location.replace('/admin/login') </script>`,
    );
  }
};

restaurantController.logout = async (req: AdminRequest, res: Response) => {
  // Standartga mos try va catch dan foydalanayapman
  try {
    console.log("logout");
    req.session.destroy(function () {
      res.redirect("/admin");
    });
  } catch (err) {
    console.log("Error, logout:", err);
    res.redirect("/admin");
  }
};

// ✅ YANGI — Dashboard stats metodi
restaurantController.getDashboardStats = async (
  req: AdminRequest,
  res: Response,
) => {
  try {
    console.log("getDashboardStats");

    const [totalOrders, totalProducts, totalUsers, activeUsers] =
      await Promise.all([
        // Order model import qilish kerak
        require("../schema/Order.model").default.countDocuments(),
        require("../schema/Product.model").default.countDocuments(),
        require("../schema/Member.model").default.countDocuments({
          memberType: "USER",
        }),
        require("../schema/Member.model").default.countDocuments({
          memberType: "USER",
          memberStatus: "ACTIVE",
        }),
      ]);

    res.status(HttpCode.OK).json({
      totalOrders,
      totalProducts,
      totalUsers,
      activeUsers,
    });
  } catch (err) {
    console.log("Error, getDashboardStats:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

restaurantController.getUsers = async (req: Request, res: Response) => {
  try {
    console.log("getUsers");
    const { page = 1, limit = 10, memberStatus, sort } = req.query;

    const inquiry: UserInquiry = {
      page: Number(page),
      limit: Number(limit),
      memberStatus: memberStatus as MemberStatus,
      sort: sort as string,
    };

    const [users, stats] = await Promise.all([
      memberService.getUsers(inquiry),
      memberService.getUserStats(),
    ]);

    res.locals.memberStatus = memberStatus || "";
    res.locals.sort = sort || "createdAt";

    res.render("users", { users, stats });
  } catch (err) {
    console.log("Error, getUsers:", err);
    res.redirect("/admin/login");
  }
};

restaurantController.getAllProductsAdmin = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      page = 1,
      limit = 10,
      productCollection,
      productStatus,
    } = req.query;

    res.locals.productCollection = productCollection || "";
    res.locals.productStatus = productStatus || "";

    const result = await productService.getALLProduct({
      page: Number(page),
      limit: Number(limit),
    });

    res.render("products", { ...result });
  } catch (err) {
    console.log("Error, getAllProductsAdmin:", err);
    res.redirect("/admin/login");
  }
};

restaurantController.getAllBranchesAdmin = async (
  req: Request,
  res: Response,
) => {
  try {
    console.log("getAllBranchesAdmin");

    const [branches, stats] = await Promise.all([
      branchService.getAllBranches(),
      branchService.getBranchStats(),
    ]);

    res.render("branches", { branches, stats });
  } catch (err) {
    console.log("Error, getAllBranchesAdmin:", err);
    res.redirect("/admin/login");
  }
};
restaurantController.updateChosenUser = async (req: Request, res: Response) => {
  try {
    console.log("updateChosenUser");
    const result = await memberService.updateChosenUser(req.body);

    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error, updateChosenUser:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

restaurantController.checkAuthSession = async (
  req: AdminRequest,
  res: Response,
) => {
  // Standartga mos try va catch dan foydalanayapman
  try {
    console.log("checkAuthSession");
    if (req.session?.member)
      res.send(`<script> alert("${req.session.member.memberNick}")</script>`);
    else res.send(`<script> alert("${Message.NOT_AUTHENTICATED}")</script>`);
  } catch (err) {
    console.log("Error, checkAuthSession:", err);
    res.send(err);
  }
};

restaurantController.verifyRestaurant = (
  req: AdminRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.session?.member?.memberType === MemberType.RESTAURANT) {
    req.member = req.session.member;
    next();
  } else {
    const message = Message.NOT_AUTHENTICATED;
    res.send(
      `<script> alert("${message}"); window.location.replace('/admin/login');</script>`,
    );
  }
};

export default restaurantController;
