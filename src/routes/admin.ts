import express from "express"
import { addCategory, addProduct, adminLogin } from "../controller/adminController"
import authMiddleware from "../middleware/auth"
const router=express.Router()

router.post('/login',adminLogin)

router.post('/addCategory',authMiddleware,addCategory)

router.post('/addProduct',addProduct)

export default router
