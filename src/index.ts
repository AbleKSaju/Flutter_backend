import express from "express";
import user from "./routes/user";
import admin from "./routes/admin";
import bodyParser from "body-parser";
import connectDB from "./config/db";
import * as dotenv from "dotenv";
import session, { SessionOptions } from "express-session";
import { MemoryStore } from "express-session";
import cookieParser from 'cookie-parser';
import cors from 'cors'
import path from 'path'


const app = express();
const port = 3000;
dotenv.config();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
connectDB();
const store = new MemoryStore();
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
}))
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 72 * 60 * 60 * 1000,
      httpOnly: true,
    },
    store: store,
  } as SessionOptions)
);

app.use("/", user);
app.use("/admin",admin)
app.listen(port, () => console.log(`server is running on port ${port}`));
