"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDB, resetDB, uid, updateDB } from "./db";
import {
  checkCredentials,
  createSession,
  destroySession,
  isAuthed,
} from "./auth";
import type { Content, ContentKey, Lead, LeadStage, Post } from "./types";
import { LEAD_STAGES } from "./types";

const refresh = () => revalidatePath("/", "layout");

async function guard() {
  if (!(await isAuthed())) throw new Error("Unauthorized");
}

/* ----------------------------- public: leads ----------------------------- */

export type LeadInput = {
  name: string;
  email?: string;
  phone: string;
  city?: string;
  propertyType?: string;
  monthlyBill?: number;
  systemSize?: string;
  message?: string;
  source?: string;
};

export async function submitLead(input: LeadInput) {
  const name = String(input.name ?? "").trim().slice(0, 80);
  const phone = String(input.phone ?? "").trim().slice(0, 20);
  if (name.length < 2 || phone.replace(/\D/g, "").length < 8) {
    return { ok: false as const, error: "Please share your name and a valid phone number." };
  }
  const db = await getDB();
  const bill = Math.max(0, Math.min(10_000_000, Number(input.monthlyBill) || 0));
  const kw = bill ? Math.max(1, Math.round(bill / db.calculator.tariff / db.calculator.unitsPerKw)) : 0;
  const lead: Lead = {
    id: `L-${Date.now().toString().slice(-6)}`,
    name,
    phone,
    email: String(input.email ?? "").trim().slice(0, 120),
    city: String(input.city ?? "").trim().slice(0, 60),
    propertyType: String(input.propertyType ?? "Independent House").slice(0, 40),
    monthlyBill: bill,
    systemSize: input.systemSize?.slice(0, 30) || (kw ? `${kw} kW` : ""),
    message: String(input.message ?? "").trim().slice(0, 1000),
    source: String(input.source ?? "Website").slice(0, 30),
    stage: "New",
    value: kw * db.calculator.costPerKw,
    priority: bill > 20000 ? "High" : "Medium",
    followUp: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    createdAt: new Date().toISOString(),
    notes: [],
  };
  await updateDB((d) => {
    d.leads.unshift(lead);
  });
  revalidatePath("/admin", "layout");
  return { ok: true as const };
}

/* --------------------------------- auth --------------------------------- */

export async function login(_: unknown, form: FormData) {
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  if (!checkCredentials(email, password)) {
    return { error: "Incorrect email or password." };
  }
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

/* ---------------------------------- CMS --------------------------------- */

export async function saveContent<K extends ContentKey>(key: K, value: Content[K]) {
  await guard();
  await updateDB((d) => {
    (d as Content)[key] = value;
  });
  refresh();
  return { ok: true };
}

export async function resetDemo() {
  await guard();
  await resetDB();
  refresh();
  return { ok: true };
}

/* ---------------------------------- CRM --------------------------------- */

export async function createLead(input: Partial<Lead>) {
  await guard();
  const lead: Lead = {
    id: `L-${Date.now().toString().slice(-6)}`,
    name: input.name || "Untitled lead",
    email: input.email || "",
    phone: input.phone || "",
    city: input.city || "",
    propertyType: input.propertyType || "Independent House",
    monthlyBill: Number(input.monthlyBill) || 0,
    systemSize: input.systemSize || "",
    message: input.message || "",
    source: input.source || "Manual",
    stage: (input.stage as LeadStage) || "New",
    value: Number(input.value) || 0,
    priority: input.priority || "Medium",
    followUp: input.followUp || "",
    createdAt: new Date().toISOString(),
    notes: [],
  };
  await updateDB((d) => {
    d.leads.unshift(lead);
  });
  refresh();
  return lead;
}

export async function updateLead(id: string, patch: Partial<Lead>) {
  await guard();
  if (patch.stage && !LEAD_STAGES.includes(patch.stage)) throw new Error("Bad stage");
  await updateDB((d) => {
    const l = d.leads.find((x) => x.id === id);
    if (l) Object.assign(l, patch, { id: l.id, createdAt: l.createdAt, notes: l.notes });
  });
  refresh();
  return { ok: true };
}

export async function deleteLead(id: string) {
  await guard();
  await updateDB((d) => {
    d.leads = d.leads.filter((x) => x.id !== id);
  });
  refresh();
  return { ok: true };
}

export async function addLeadNote(id: string, text: string) {
  await guard();
  const note = { id: uid("N-"), text: text.trim().slice(0, 2000), at: new Date().toISOString() };
  if (!note.text) return { ok: false };
  await updateDB((d) => {
    d.leads.find((x) => x.id === id)?.notes.unshift(note);
  });
  refresh();
  return { ok: true, note };
}

/* --------------------------------- Blog --------------------------------- */

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);

export async function savePost(post: Post) {
  await guard();
  const clean: Post = {
    ...post,
    id: post.id || uid("b"),
    slug: slugify(post.slug || post.title) || uid("post-"),
  };
  await updateDB((d) => {
    const clash = d.posts.find((p) => p.slug === clean.slug && p.id !== clean.id);
    if (clash) clean.slug = `${clean.slug}-${uid().slice(-4)}`;
    const i = d.posts.findIndex((p) => p.id === clean.id);
    if (i >= 0) d.posts[i] = clean;
    else d.posts.unshift(clean);
  });
  refresh();
  return clean;
}

export async function deletePost(id: string) {
  await guard();
  await updateDB((d) => {
    d.posts = d.posts.filter((p) => p.id !== id);
  });
  refresh();
  return { ok: true };
}
