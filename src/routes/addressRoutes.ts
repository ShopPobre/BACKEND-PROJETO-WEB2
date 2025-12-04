import { AddressRepository } from "../repository/AddressRepository";
import { AddressService } from "../services/AddressService";
import { AddressController } from "../controllers/AddressController";
import { UserRepository } from "../repository/UserRepository";
import { asyncHandler } from "../middleware/errorHandler";
import { Request, Response, NextFunction, Router } from "express"


const router = Router({ mergeParams: true }); 

const userRepository = new UserRepository();
const addressRepository = new AddressRepository();
const addressService = new AddressService(addressRepository, userRepository);
const addressController = new AddressController(addressService);


router.post("/", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await addressController.createAddress(req, res);
}));

router.get("/", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await addressController.getAddresses(req, res);
}));

router.put("/:addressId", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await addressController.updateAddress(req, res);
}));

router.delete("/:addressId", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await addressController.deleteAddress(req, res);
}));


export default router;