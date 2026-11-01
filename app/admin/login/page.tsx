import { redirect } from "next/navigation";
import { isAuthed, ADMIN_EMAIL } from "@/lib/auth";
import { getDB } from "@/lib/db";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "Admin login" };

export default async function LoginPage() {
  if (await isAuthed()) redirect("/admin");
  const { settings, hero } = await getDB();
  const demo = !process.env.ADMIN_PASSWORD;
  return (
    <div className="grid min-h-dvh bg-paper lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-night lg:block">
        <img src={hero.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-white">
          <p className="eyebrow text-white/60">{settings.brandName} OS</p>
          <p className="display mt-4 text-6xl">
            Run your solar business <span className="serif-i sun-text">from one place.</span>
          </p>
          <p className="mt-4 max-w-md text-white/60">Leads, pipeline, website content, blog and branding — all in one calm dashboard.</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <LoginForm brand={settings.brandName} demoEmail={demo ? ADMIN_EMAIL : undefined} />
      </div>
    </div>
  );
}
