import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, { message: "First name must be at least 2 characters" }),
    lastName: z
      .string()
      .trim()
      .min(2, { message: "Last name must be at least 2 characters" }),
    email: z.string().trim().email({ message: "Invalid email address" }),
    phone: z
      .string()
      .trim()
      .min(11, { message: "Phone number must be at least 11 digits" }),
    gender: z.enum(["MALE", "FEMALE"], { message: "Please select a gender" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const forgetPasswordSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
});

export const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits" }),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, { message: "Old password is required" }),
    newPassword: z
      .string()
      .min(8, { message: "New password must be at least 8 characters" }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .trim()
    .min(2, { message: "Last name must be at least 2 characters" }),
  gender: z.enum(["MALE", "FEMALE"], { message: "Please select a gender" }),
  phone: z
    .string()
    .trim()
    .min(11, { message: "Phone number must be at least 11 digits" }),
});

export const confirmPasswordSchema = z.object({
  password: z.string().min(1, { message: "Password is required" }),
});
