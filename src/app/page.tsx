import Navbar from "@/components/navbar";
import MarkdownCardEditor from "@/components/markdown-card-editor";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <MarkdownCardEditor />
      </main>
    </div>
  );
}
