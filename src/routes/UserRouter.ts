import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { ROUTES } from "../constants/routes";


const router = Router();
const BASEURL = ROUTES.USER.BASE();


router.post(BASEURL, UserController.create)

router.get(BASEURL, UserController.getAll)
router.get(BASEURL + "/:cpf", UserController.getByCPF)

export default router;