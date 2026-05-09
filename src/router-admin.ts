import express from "express";
const routerAdmin = express.Router();
import restaurantController from "./controllers/restaurant.controller";
import productController from "./controllers/product.controller";
import branchController from "./controllers/branch.controller";
import makeUploader from "./libs/utils/uploader";

/** Restaurant */
routerAdmin.get("/", restaurantController.goHome);
// get - pagelarga oborayapti
// post - login qilganimizda ishga tushayapti
routerAdmin
  .get("/login", restaurantController.getLogin)
  // post method orqali and point login qoniqtirilsa
  // restaurantController+Objectini.+processLogin+Methodini+Call qilayapmiz
  .post("/login", restaurantController.processLogin);
routerAdmin
  .get("/signup", restaurantController.getSignup)
  // // Call qismi (shartliy ravishda)
  .post(
    "/signup",
    makeUploader("members").single("memberImage"), // req.+file bitta file
    restaurantController.processSignup,
  );
// type: Tradition (html-form)
// Method: post
// Structure: Header(localhost:3003), Body (Kiritilgan malumotlar)
routerAdmin.get(
  "/dashboard/stats",
  restaurantController.verifyRestaurant,
  restaurantController.getDashboardStats,
);

routerAdmin.get("/logout", restaurantController.logout);
routerAdmin.get("/check-me", restaurantController.checkAuthSession);

/** Product */ // Customized Middleware (utilities)
routerAdmin.get(
  "/product/all",
  restaurantController.verifyRestaurant,
  restaurantController.getAllProductsAdmin, // ← o'zgardi
);
routerAdmin.post(
  "/product/create",
  restaurantController.verifyRestaurant, // Customized Middleware req.+member AUTHORIZATION
  makeUploader("products").array("productImages", 5), // req.+files birnechta files UPLOADER
  productController.createNewProduct, // bu yerda req.member req.feles di ishlatayapmiz
);
routerAdmin.post(
  "/product/:id",
  restaurantController.verifyRestaurant, // Customized Middleware req.+member AUTHORIZATION
  productController.updateChosenProduct, // // bu yerda req.member di ishlatayapmiz
);

/** User */
routerAdmin.get(
  "/user/all",
  restaurantController.verifyRestaurant,
  restaurantController.getUsers, // ← filter + stats bilan
);
routerAdmin.post(
  "/user/edit",
  restaurantController.verifyRestaurant,
  restaurantController.updateChosenUser,
);

/** Branch */
routerAdmin.get(
  "/branch/all",
  restaurantController.verifyRestaurant,
  restaurantController.getAllBranchesAdmin, // ← stats bilan
);
routerAdmin.post(
  "/branch/create",
  restaurantController.verifyRestaurant,
  makeUploader("branches").single("branchImage"),
  branchController.createBranch,
);
routerAdmin.post(
  "/branch/edit",
  restaurantController.verifyRestaurant,
  branchController.updateChosenBranch,
);

export default routerAdmin;
