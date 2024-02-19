import express from "express"
import { addCategory, addProduct, adminLogin, deleteCategory, deleteProduct, editProduct, getCategory, getProduct } from "../controller/adminController"
import authMiddleware from "../middleware/auth"
import multers from "../utils/multer"
const router=express.Router()
const category = multers.categories;
const products = multers.products;


router.post('/login',adminLogin)

router.post('/addCategory',authMiddleware,category.single("image"),addCategory)

router.get('/getCategory',authMiddleware,getCategory)



router.delete('/deleteCategory/:id',authMiddleware,deleteCategory)

router.post('/addProduct',products.array("image", 4),addProduct)

router.get('/getProduct',authMiddleware,getProduct)

router.delete('/deleteProduct/:id',authMiddleware,deleteProduct)

router.post('/editProduct',products.array("image", 4),authMiddleware,editProduct)

export default router
