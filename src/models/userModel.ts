import mongoose from "mongoose";
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  mobile: string;
  isAdmin: boolean;
  cart: string[];
  wishlist: any
}
const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  wishlist:{
    type: Array,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  cart:[{
    id:String,
    size:String
}],
  isAdmin: {
    type: Boolean,
    default: false,
  },
},{
  timestamps:true
})

const User = mongoose.model("User", userSchema);
export default User;
