import express from "express"
import { addCategory, addProduct, adminLogin, deleteCategory, deleteProduct, getCategory, getProduct } from "../controller/adminController"
import authMiddleware from "../middleware/auth"
import multers from "../utils/multer"
const router=express.Router()
const category = multers.categories;
const products = multers.products;


router.post('/login',adminLogin)

router.post('/addCategory',authMiddleware,category.single("image"),addCategory)

router.get('/getCategory',authMiddleware,getCategory)



router.post('/deleteCategory',authMiddleware,deleteCategory)

router.post('/addProduct',products.array("image", 4),addProduct)

router.get('/getProduct',authMiddleware,getProduct)

router.post('/deleteProduct',authMiddleware,deleteProduct)

export default router
