import { RequestPanel } from "@/components/RequestPanel";

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - will hold collections later*/}
      <aside className="w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="font-semibold text-gray-700"> Mt Collections</h2>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p4 overflow-auto">
        <RequestPanel />
      </main>
    </div>
  );
}