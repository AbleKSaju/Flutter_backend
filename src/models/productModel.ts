import mongoose from "mongoose";
// import { isStringLiteralLike } from "typescript";
// interface IProduct extends Document {
//   name: string;
//   description: string;
//   price: number;
//   stock: Number;
//   category: string;
//   image:string[]
// }
const productSchema:any = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: Array,
      required: true,
    },
    description: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    blocked:{
      type: Boolean,
      default:false,
      require:true
    }
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("product", productSchema);
export default Product;
