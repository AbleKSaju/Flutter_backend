import express from "express"
import { addCategory, addProduct, adminLogin, deleteCategory, deleteProduct, editCategory, editProduct, getCategory, getProduct, getSearchedProducts } from "../controller/adminController"
import authMiddlewareForAdmin from "../middleware/auth"
import multers from "../utils/multer"
const router=express.Router()
const category = multers.categories;
const products = multers.products;


router.post('/login',adminLogin)

router.post('/addCategory',category.single("image"),addCategory)

router.get('/getCategory',getCategory)

router.get('/getSearchedProducts/:product',getSearchedProducts)

router.delete('/deleteCategory/:id',deleteCategory)

router.post('/editCategory',category.single("image"),editCategory)

router.post('/addProduct',products.array("image", 4),addProduct)

router.get('/getProduct',getProduct)

router.delete('/deleteProduct/:id',deleteProduct)

router.patch('/editProduct',products.array("image", 4),editProduct)

export default router
