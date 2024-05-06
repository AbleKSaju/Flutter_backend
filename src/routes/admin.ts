import express from "express"
import { addCategory, addProduct, adminLogin, changeStatus, deleteCategory, deleteProduct, editCategory, editProduct, getAllOrders, getCategory, getProduct, getSearchedProducts } from "../controller/adminController"
import authMiddlewareForAdmin from "../middleware/auth"
import multers from "../utils/multer"
import authMiddleware from "../utils/authMiddleware"
const router=express.Router()
const category = multers.categories;
const products = multers.products;


router.post('/adminLogin',adminLogin)

router.post('/addCategory',category.single("image"),addCategory)

router.get('/getCategory',getCategory)

router.get('/getSearchedProducts/:product',getSearchedProducts)

router.delete('/deleteCategory/:id',deleteCategory)

router.post('/editCategory',category.single("image"),editCategory)

router.post('/addProduct',products.array("image", 4),addProduct)

router.get('/getProduct',getProduct)

router.get('/getAllOrders',authMiddleware,getAllOrders)     

router.delete('/deleteProduct/:id',deleteProduct)

router.patch('/editProduct',products.array("image", 4),editProduct)

router.post('/changeStatus',authMiddleware,changeStatus)

export default router
