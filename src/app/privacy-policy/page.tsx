// app/privacy-policy/page.tsx
import { Markdown } from "@/components/Markdown";
import { getPrivacyPolicy } from "@/api/apiProduct";

export default async function Page() {
  const data = await getPrivacyPolicy();

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Loading privacy policy...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-0">
        <article className="bg-white rounded-xl border border-slate-200/80 shadow-sm px-8 py-10">
          <div className="prose-policy">
            <Markdown>{data}</Markdown>
          </div>
        </article>
      </div>
    </main>
  );
}
