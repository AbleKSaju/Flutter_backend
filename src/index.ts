import express from 'express';
import user from './routes/user';
import bodyParser from 'body-parser'
import connectDB from './config/db'

const app=express()
const port=3000
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
connectDB()
app.use('/',user)

app.listen(port, () => console.log(`server is running on port ${port}`));
