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
productDetails:[]
},{
  timestamps:true,
})

const Order = mongoose.model("order", orderSchema);
export default Order;
