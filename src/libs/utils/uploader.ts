import path from "path";
import multer from "multer"; // file upload qilish uchun middleware
import { v4 } from "uuid"; // bu random unique id yaratadi

/** Ruxsat etilgan rasm formatlari — frontend validatsiyasi bilan bir xil (jpg, jpeg, png) */
const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png"];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

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

function imageFileFilter(
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  const extension = path.parse(file.originalname).ext.toLowerCase();
  const isAllowed =
    ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype) &&
    ALLOWED_IMAGE_EXTENSIONS.includes(extension);

  if (!isAllowed) {
    cb(new Error("Only jpg, jpeg and png image files are allowed!"));
    return;
  }
  cb(null, true);
}

const makeUploader = (address: string) => {
  const storage = getTargetImageStorage(address);
  return multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: { fileSize: MAX_IMAGE_SIZE_BYTES },
  });
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
