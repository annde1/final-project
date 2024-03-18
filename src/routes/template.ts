import { Router } from "express";
import { isPremium } from "../middleware/is-premium";
import { validateToken } from "../middleware/validate-token";
import { isOwnerOrAdmin } from "../middleware/is-owner-template";
import { validateTemplateData } from "../middleware/validation";
import {
  createTemplate,
  deleteTemplate,
  getRandomUsersTemplates,
  getTemplateById,
  getUserTemplates,
  updateTemplate,
} from "../service/template-service";
import { Template } from "../database/model/template";
import { isAdmin } from "../middleware/is-admin";
import upload from "../middleware/upload";
import { uploadToFirebase } from "../service/upload-service";
const router = Router();

//Route for creating new template
router.post(
  "/",
  isPremium,
  upload.single("file"),
  validateTemplateData,
  async (req, res, next) => {
    try {
      const userId = req.user._id;
      //Upload the template image to firebase storage and get link to it
      const imageUrl = await uploadToFirebase(req, "template");
      //Create the template and save it in the database
      const template = await createTemplate(req.body.data, userId, imageUrl);
      res.status(201).json({ message: "Templated Saved", template: template });
    } catch (err) {
      next(err);
    }
  }
);

//Route for getting 6 random templates (for homepage):
router.get("/random-templates", async (req, res, next) => {
  try {
    const templates = await getRandomUsersTemplates();
    res.status(201).json({ message: "OK", templates: templates });
  } catch (err) {
    next(err);
  }
});

//Get all templates (only for admin)
router.get("/", isAdmin, async (req, res, next) => {
  try {
    const templates = await Template.find({});
    res.status(201).json({ message: "OK", templates: templates });
  } catch (err) {
    next(err);
  }
});

//Route for getting all user's templates
router.get("/my-templates", validateToken, async (req, res, next) => {
  try {
    const { _id } = req.user;
    //Find templates
    const templates = await getUserTemplates(_id);
    res.status(201).json({ message: "OK", templates: templates });
  } catch (err) {
    next(err);
  }
});

//Route for deleting user template
router.delete("/:id", isOwnerOrAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const template = await deleteTemplate(id);
    res.status(201).json({ message: "Template Deleted", template: template });
  } catch (err) {
    next(err);
  }
});

//Route for updating template
router.put(
  "/:id",
  isOwnerOrAdmin,
  upload.single("file"),
  validateTemplateData,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      //Save the mage in firebase storage
      const imageUrl = await uploadToFirebase(req, "template");
      //Update the template in the databse
      const template = await updateTemplate(id, req.body.data, imageUrl);
      res.status(201).json({ message: "Template Updated", template: template });
    } catch (err) {
      next(err);
    }
  }
);

//Route to get template by id:
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const template = await getTemplateById(id);
    res.status(201).json({ message: "OK", templateDetails: template });
  } catch (err) {
    next(err);
  }
});
export { router as templateRouter };
