import { IWorkoutTemplate } from "../@types/template";
import { Template } from "../database/model/template";
import { ZenFitError } from "../error/app-error";

export const createTemplate = async (
  templateData: IWorkoutTemplate,
  userId: string,
  imageUrl: string
) => {
  const template = new Template(templateData);
  template.userId = userId;
  template.image = imageUrl;
  if (!imageUrl) {
    template.image =
      "https://images.unsplash.com/photo-1578762560042-46ad127c95ea?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  }
  const savedTemplate = await template.save();
  return savedTemplate;
};

export const getUserTemplates = async (userId: string) => {
  const templates = await Template.find({ userId: userId });
  if (!templates) {
    throw new Error("User doesn't have any templates");
  }
  return templates;
};

export const deleteTemplate = async (templateId: string) => {
  const template = await Template.findByIdAndDelete(
    { _id: templateId },
    { new: true }
  );
  if (!template) {
    throw new Error("template not found");
  }
  return template;
};

export const updateTemplate = async (
  templateId: string,
  templateData: any,
  imgUrl: string
) => {
  if (imgUrl) {
    templateData.image = imgUrl;
  }
  const template = await Template.findByIdAndUpdate(
    { _id: templateId },
    templateData,
    { new: true }
  ).lean();

  if (!template) {
    throw new ZenFitError("Template doesn't exist", 404);
  }

  return template;
};

export const getRandomUsersTemplates = async () => {
  const randomTemplates = await Template.aggregate([{ $sample: { size: 6 } }]);

  if (!randomTemplates) {
    throw new ZenFitError("No Users Found", 404);
  }
  return randomTemplates;
};

export const getTemplateById = async (templateId: string) => {
  const template = await Template.findById({ _id: templateId });
  if (!template) {
    throw new ZenFitError("Template not found", 404);
  }
  return template;
};
