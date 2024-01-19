import mongoose from "mongoose";
interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  stock: Number;
  category: string;
}
const productSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
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
},{
  timestamps:true
})

const Product = mongoose.model("product", productSchema);
export default Product;
