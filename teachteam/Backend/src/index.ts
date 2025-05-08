import express from 'express';
import cors from "cors";
import { AppDataSource } from './data-source';
import signUpRoutes from "./routes/signup.routes";
import loginRoutes from "./routes/login.routes"
const app  = express();
const PORT = 5050;
app.use(cors())
app.use(express.json());
app.get('/',(req,res)=>{
    res.send("Backend is working")
});
// const cors = require('cors')
app.use("/signup", signUpRoutes)
app.use("/login",loginRoutes)

AppDataSource.initialize().then(() => {
    console.log("Database Connected");
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Database connection failed:', error);
    });