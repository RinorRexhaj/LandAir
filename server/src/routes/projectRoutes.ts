// routes/projects.ts
import { Router } from "express";
import { verifySupabaseUser } from "../middleware/verifySupabaseUser";
import {
  getUserProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projects.controller";

const router = Router();

router.use(verifySupabaseUser); // Protect all routes below

router.get("/", getUserProjects);
router.get("/:id", getProjectById);
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
