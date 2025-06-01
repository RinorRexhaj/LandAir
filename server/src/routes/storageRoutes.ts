import { Router } from "express";
import multer from "multer";
import { uploadFile, getFileUrl } from "../controllers/storage.controller";
import { verifySupabaseUser } from "../middleware/verifySupabaseUser";

const upload = multer(); // memory storage
const router = Router();

router.use(verifySupabaseUser); // Protect all routes below

router.post("/upload", upload.single("file"), uploadFile);
router.get("/:filename", getFileUrl);

export default router;
