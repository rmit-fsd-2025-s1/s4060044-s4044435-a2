import { Router } from "express";
import { candidate } from "../controller/candidateController";

const router = Router();

router.route("/candidate").get(candidate).post(candidate);

export default router;