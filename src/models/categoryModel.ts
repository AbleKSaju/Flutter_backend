import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  blocked:{
    type:Boolean,
    default:false,
  },
  image:{
    type:String,
    require:true
},
},{
  timestamps:true,
})

const Category = mongoose.model("category", categorySchema);
export default Category;
