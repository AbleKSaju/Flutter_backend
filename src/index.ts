import { Request, Response } from "express";
import express from "express";
import user from "./routes/user";
import admin from "./routes/admin";
import bodyParser from "body-parser";
import connectDB from "./config/db";
import * as dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import cors from 'cors'

const app = express();
const port = 3000;
dotenv.config();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
connectDB();

app.use(express.static("public/uploads/"));
app.use(cors({
  // origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
}))
let timeouts:any = {};

 const debounceMiddleware = (req:Request, res:Response, next:any) => {
  const requestId:any = req.method + req.originalUrl;
  if (timeouts[requestId]) {
    clearTimeout(timeouts[requestId]);
  }
  timeouts[requestId] = setTimeout(() => {``
    delete timeouts[requestId];
    next();
  }, 10);
};

app.use(debounceMiddleware)

app.use("/", user);
app.use("/admin",admin)
app.listen(port, () => console.log(`server is running on port ${port}`));
