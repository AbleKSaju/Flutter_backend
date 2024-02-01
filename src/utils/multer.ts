import multer from "multer";

const category = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, "public/uploads/categories");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const product = multer.diskStorage({
    destination: (req, file, cb) => {
      return cb(null, "public/uploads/products");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname)
    },
  })

const categories = multer({ storage: category });
const products = multer({ storage: product });

export default {
    categories,
    products
};
