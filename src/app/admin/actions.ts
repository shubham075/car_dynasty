"use server";

import { redirect } from "next/navigation";
import { login, logout, safeNext } from "@/cms/auth";

export type LoginState = { message?: string; email?: string } | undefined;

export async function loginAction(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { message: "Enter your email and password.", email };
  if (email.length > 254 || password.length > 200) return { message: "Incorrect email or password.", email };

  const result = await login(email, password);
  if (!result.ok) return { message: result.message, email };
  redirect(safeNext(form.get("next")));
}

export async function logoutAction() {
  await logout();
  redirect("/admin/login");
}
