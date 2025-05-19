import { Router } from "express";
import { lecturer} from "../controller/lecturerController";

const router = Router();

router.route("/lecturer").get(lecturer).post(lecturer);

export default router;
