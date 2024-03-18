import { Router } from "express";
import { getAllExercises } from "../service/exercises-service";
import { validateToken } from "../middleware/validate-token";
const router = Router();

//get all exrcises
router.get("/", validateToken, async (req, res, next) => {
  try {
    const exercises = await getAllExercises();
    res.status(201).json({ message: "OK", exercises: exercises });
  } catch (err) {
    next(err);
  }
});

export { router as exercisesRouter };
