import { z } from "zod";

export const signupSchema = z.object({
  first_name: z.string({
    required_error: "First name is requred"
  }),
  last_name: z.string({
    required_error: "Last name is requred"
  }),
  email: z.string({required_error: "Email is required"}).email({message: "Email is not valid"}),
  password: z.string().min(5)
}).strict();

export const loginSchema = signupSchema.omit({ first_name: true, last_name: true });

export const updateArticle = z.object({
  content: z.string().optional(),
  title: z.string().optional(),
}).refine(data => Object.keys(data).some(key => key !== undefined), { message: "One of content or title is requierd", path: ['update'] });

export const generateArticle = z.object({
  link: z.string()
});
