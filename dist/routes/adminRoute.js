"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const adminController_1 = require("../controllers/adminController");
router.post("/invite_admin", adminController_1.inviteAdmin);
router.post("/admin_auth", adminController_1.adminSignup);
router.post("/verify_otp", adminController_1.verifyOTP);
exports.default = router;
