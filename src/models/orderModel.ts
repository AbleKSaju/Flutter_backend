import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  addressId:{
    type:String,
    require:true
},
paymentMethod:{
    type:String,
    require:true
},
deliveryDate: {
  type: Date,
  default: () => {
    const currentDate = new Date();
    const deliveryDate = new Date(currentDate.setDate(currentDate.getDate() + 5));
    return deliveryDate;
  }
},
status:{
  type:String
},
productDetails:[],},
{
  timestamps:true,
})

const Order = mongoose.model("order", orderSchema);
export default Order;