import express from "express"
import { addCategory, addProduct, adminLogin, changeStatus, editCategory, editProduct, getAllOrders, getCategory, getProduct, getSearchedProducts, toggleCategoryBlockedStatus, toggleProductBlockedStatus } from "../controller/adminController"
import multers from "../utils/multer"
import authMiddleware from "../utils/authMiddleware"
const router=express.Router()
const category = multers.categories;
const products = multers.products;


router.post('/adminLogin',adminLogin)

router.post('/addCategory',authMiddleware,category.single("image"),addCategory)

router.get('/getCategory',authMiddleware,getCategory)

router.get('/getSearchedProducts/:product',getSearchedProducts)

router.patch('/changeBrandStatus/:id',authMiddleware,toggleCategoryBlockedStatus)

router.post('/editCategory',authMiddleware,category.single("image"),editCategory)

router.post('/addProduct',authMiddleware,products.array("image", 4),addProduct)

router.get('/getProduct',authMiddleware,getProduct)

router.get('/getAllOrders',authMiddleware,getAllOrders)     

router.patch('/changeProductStatus/:id',authMiddleware,toggleProductBlockedStatus)

router.patch('/editProduct',authMiddleware,products.array("image", 4),editProduct)

router.post('/changeStatus',authMiddleware,changeStatus)

export default router
