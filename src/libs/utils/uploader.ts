import path from "path";
import multer from "multer"; // file upload qilish uchun middleware
import { v4 } from "uuid"; // bu random unique id yaratadi

/** MULTER IMAGE UPLOADER  Dynamic - O'zgaruvchan **/
function getTargetImageStorage(address: any) {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./uploads/${address}`);
    },
    filename: function (req, file, cb) {
      const extension = path.parse(file.originalname).ext;
      const random_name = v4() + extension;
      cb(null, random_name);
    },
  });
}

const makeUploader = (address: string) => {
  const storage = getTargetImageStorage(address);
  return multer({ storage: storage });
};

export default makeUploader;

/**  static - o'zgarmas
const product_storage = multer.diskStorage({
  // fileni diskda saqla
  destination: function (req, file, cb) {
    // file qaysi papkaga tushsin
    cb(null, "./uploads/products"); // shuni aytadi
  },
  filename: function (req, file, cb) {
    // file qanday nom bilan saqlansin?
    console.log(file);
    const extension = path.parse(file.originalname).ext;
    // fileni orginal nomini ajiratib oladi(.png,.jpg)
    const random_name = v4() + extension;
    // random UUID beradi va ustiga extensiondi qoshayapti(.jpg,.png)
    cb(null, random_name); // error yoq, file shu nom bilan saqlansin
  },
});

export const uploadProductImage = multer({ storage: product_storage });
// Bu tayyor middleware yaratadi
*/
