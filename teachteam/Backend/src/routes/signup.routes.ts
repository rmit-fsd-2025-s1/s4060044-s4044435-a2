import express from "express";
import  {signUp}  from "../controller/SignupController";

const router = express.Router();

router.post("/", signUp);

export default router;
