import express from "express"
import { addCategory, addProduct, adminLogin, changeStatus, deleteCategory, deleteProduct, editCategory, editProduct, getAllOrders, getCategory, getProduct, getSearchedProducts } from "../controller/adminController"
import authMiddlewareForAdmin from "../middleware/auth"
import multers from "../utils/multer"
import authMiddleware from "../utils/authMiddleware"
const router=express.Router()
const category = multers.categories;
const products = multers.products;


router.post('/adminLogin',adminLogin)

router.post('/addCategory',authMiddleware,category.single("image"),addCategory)

router.get('/getCategory',authMiddleware,getCategory)

router.get('/getSearchedProducts/:product',authMiddleware,getSearchedProducts)

router.delete('/deleteCategory/:id',authMiddleware,deleteCategory)

router.post('/editCategory',authMiddleware,category.single("image"),editCategory)

router.post('/addProduct',authMiddleware,products.array("image", 4),addProduct)

router.get('/getProduct',authMiddleware,getProduct)

router.get('/getAllOrders',authMiddleware,getAllOrders)     

router.delete('/deleteProduct/:id',authMiddleware,deleteProduct)

router.patch('/editProduct',authMiddleware,products.array("image", 4),editProduct)

router.post('/changeStatus',authMiddleware,changeStatus)

export default router
