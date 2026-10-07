import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";
import uploader from "./libs/utils/uploader";
import productController from "./controllers/product.controller";
import orderController from "./controllers/order.controller";
import branchController from "./controllers/branch.controller";
import commentController from "./controllers/comment.controller";
import contactController from "./controllers/contact.controller";

/** Member **/
router.get("/member/restaurant", memberController.getRestaurant);
router.post("/member/login", memberController.login);
// post method orqali and point login qoniqtirilsa
// memberController+Objectini.+login+Methodini+Call qilayapmiz(argument)
router.post("/member/signup", memberController.signup);
router.post("/member/logout", memberController.logout);
router.get(
  "/member/detail",
  memberController.verifyAuth,
  memberController.getMemberDetail,
);

router.post(
  "/member/update",
  memberController.verifyAuth,
  uploader("members").single("memberImage"),
  memberController.updateMember,
);

router.get("/member/top-users", memberController.getTopUsers);

router.post(
  "/member/payment",
  memberController.verifyAuth,
  memberController.savePaymentMethod,
);
router.post(
  "/member/payment/generate",
  memberController.verifyAuth,
  memberController.generatePaymentMethod,
);
router.post(
  "/member/payment/remove",
  memberController.verifyAuth,
  memberController.removePaymentMethod,
);

/** Product **/
router.get("/product/all", productController.getProducts);
router.get(
  "/product/:id",
  memberController.retrieveAuth,
  productController.getProduct,
);

/** Order **/
router.post(
  "/order/create",
  memberController.verifyAuth,
  orderController.createOrder,
);
router.get(
  "/order/all",
  memberController.verifyAuth,
  orderController.getMyOrders,
);
router.post(
  "/order/update",
  memberController.verifyAuth,
  orderController.updateOrder,
);

/** Branch - SPA uchun (public, auth shart emas) **/
router.get("/branch/all", branchController.getBranches);

/** Comment **/
router.get("/comment/all", commentController.getComments);
router.post(
  "/comment/create",
  memberController.verifyAuth,
  commentController.createComment,
);

/** Contact - Telegram relay (public, mehmonlar ham foydalanadi) **/
router.post("/contact/booking", contactController.sendBooking);
router.post("/contact/inquiry", contactController.sendContact);

export default router;
