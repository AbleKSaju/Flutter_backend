import mongoose from "mongoose";
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  mobile: string;
  isAdmin: boolean;
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
  mobile: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
},{
  timestamps:true
})

const User = mongoose.model("User", userSchema);
export default User;
