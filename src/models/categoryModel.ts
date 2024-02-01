import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
