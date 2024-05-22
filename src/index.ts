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

const allowedOrigins = [
  'https://admin-web-ec121.web.app',
  'https://flutter-backend-sym1.onrender.com',
  'https://kicks-cart-web.web.app'
];

app.use(cors({
  origin: (origin:any, callback) => {
    // Check if the origin is in the allowed origins array
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));
app.use(express.static("public/uploads/"));
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
