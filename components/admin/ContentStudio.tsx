"use client";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ExternalLink, Loader2, MonitorSmartphone, RotateCcw, Save } from "lucide-react";
import type { Content, ContentKey } from "@/lib/types";
import { CMS } from "@/lib/cms-schema";
import { saveContent } from "@/lib/actions";
import { PageTitle } from "./AdminShell";
import { FieldGrid, ListEditor } from "./Fields";
import { useToast } from "./ui";

type Obj = Record<string, unknown>;

const PREVIEW_PATH: Partial<Record<ContentKey, string>> = { about: "/about", calculator: "/calculator", projects: "/projects", services: "/services" };

export default function ContentStudio({ content }: { content: Content }) {
  const params = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const initialTab = (CMS.find((s) => s.key === params.get("tab"))?.key ?? "hero") as ContentKey;
  const [tab, setTab] = useState<ContentKey>(initialTab);
  const [drafts, setDrafts] = useState<Content>(() => structuredClone(content));
  const [saved, setSaved] = useState<Content>(content);
  const [pending, start] = useTransition();
  const [preview, setPreview] = useState(true);
  const frame = useRef<HTMLIFrameElement>(null);

  const schema = CMS.find((s) => s.key === tab)!;
  const dirtyKeys = useMemo(
    () => CMS.filter((s) => JSON.stringify(drafts[s.key]) !== JSON.stringify(saved[s.key])).map((s) => s.key),
    [drafts, saved]
  );
  const dirty = dirtyKeys.includes(tab);

  const setValue = (v: unknown) => setDrafts((d) => ({ ...d, [tab]: v }));

  const save = () => {
    start(async () => {
      try {
        await saveContent(tab, drafts[tab] as never);
        setSaved((s) => ({ ...s, [tab]: structuredClone(drafts[tab]) }));
        toast(`${schema.title} published`);
        frame.current?.contentWindow?.location.reload();
        router.refresh();
      } catch {
        toast("Could not save", "err");
      }
    });
  };

  const value = drafts[tab];
  const previewPath = `${PREVIEW_PATH[tab] ?? "/"}?preview=1`;

  return (
    <div>
      <PageTitle
        title="Website"
        subtitle="Edit every section of the public site. Changes go live the moment you publish."
        actions={
          <>
            <button onClick={() => setPreview((p) => !p)} className="btn hidden bg-white !px-4 !py-2.5 text-sm ring-1 ring-black/[0.07] 2xl:inline-flex">
              <MonitorSmartphone className="h-4 w-4" /> {preview ? "Hide" : "Show"} preview
            </button>
            <a href={PREVIEW_PATH[tab] ?? "/"} target="_blank" className="btn bg-white !px-4 !py-2.5 text-sm ring-1 ring-black/[0.07]">
              <ExternalLink className="h-4 w-4" /> Open site
            </a>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[220px_1fr] 2xl:grid-cols-[220px_1fr_420px]">
        {/* section list */}
        <nav className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:gap-0.5 lg:px-0">
          {CMS.map((s) => (
            <button
              key={s.key}
              onClick={() => setTab(s.key)}
              className={`relative flex shrink-0 items-center justify-between gap-2 rounded-full px-4 py-2 text-left text-sm lg:rounded-xl lg:px-3 lg:py-2.5 ${tab === s.key ? "text-white lg:text-ink" : "bg-white text-ink/70 ring-1 ring-black/[0.06] lg:bg-transparent lg:ring-0"}`}
            >
              {tab === s.key && <motion.span layoutId="cms-tab" className="absolute inset-0 rounded-full bg-ink lg:rounded-xl lg:bg-white lg:shadow-sm lg:ring-1 lg:ring-black/[0.06]" />}
              <span className={`relative whitespace-nowrap ${tab === s.key ? "font-medium" : ""}`}>{s.title}</span>
              {dirtyKeys.includes(s.key) && <span className="relative h-2 w-2 rounded-full sun-bg" title="Unsaved changes" />}
            </button>
          ))}
        </nav>

        {/* editor */}
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
              <div className="rounded-3xl bg-white p-5 ring-1 ring-black/[0.05] md:p-7">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold tracking-tight">{schema.title}</h2>
                  <p className="text-sm text-muted">{schema.description}</p>
                </div>
                {schema.kind === "object" ? (
                  <FieldGrid fields={schema.fields} value={value as Obj} onChange={setValue} />
                ) : schema.primitive ? (
                  <ListEditor
                    items={(value as string[]).map((v) => ({ value: v }))}
                    fields={schema.fields}
                    blank={schema.blank}
                    itemTitle="value"
                    onChange={(items) => setValue(items.map((i) => String(i.value ?? "")))}
                  />
                ) : (
                  <ListEditor items={value as Obj[]} fields={schema.fields} blank={schema.blank} itemTitle={schema.itemTitle} itemSubtitle={schema.itemSubtitle} onChange={setValue} />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* live preview */}
        {preview && (
          <div className="hidden 2xl:block">
            <div className="sticky top-8 overflow-hidden rounded-[2.2rem] bg-night p-2.5 shadow-2xl">
              <div className="mx-auto mb-2 h-1.5 w-16 rounded-full bg-white/20" />
              <iframe ref={frame} key={previewPath} src={previewPath} title="Live preview" className="h-[760px] w-full rounded-[1.7rem] bg-paper" />
            </div>
            <p className="mt-3 text-center text-xs text-muted">Live mobile preview · refreshes on publish</p>
          </div>
        )}
      </div>

      {/* sticky save bar */}
      <AnimatePresence>
        {dirty && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-3 bottom-24 z-40 mx-auto flex max-w-md items-center justify-between gap-3 rounded-full bg-ink p-2 pl-5 text-white shadow-2xl lg:bottom-6 lg:left-64"
          >
            <span className="text-sm">Unsaved changes</span>
            <div className="flex gap-1.5">
              <button onClick={() => setDrafts((d) => ({ ...d, [tab]: structuredClone(saved[tab]) }))} className="btn !px-3 !py-2 text-sm text-white/70 hover:text-white">
                <RotateCcw className="h-4 w-4" />
              </button>
              <button onClick={save} disabled={pending} className="btn btn-sun !px-5 !py-2 text-sm">
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Publish
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
