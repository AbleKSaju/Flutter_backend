import express from 'express';
const router=express.Router()

router.get('/',(req,res)=>{
    console.log("Enter");
    res.json("Hello World")
})


export default router;    