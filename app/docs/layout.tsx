import DocsNavbar from "@/components/DocsNavbar";
import DocsSidebar from "@/components/DocsSidebar";

export const metadata = {
  title: "Docs — Artemis",
  description: "Learn how to train, simulate, and deploy AI to your ROS 2 robots with Artemis.",
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <DocsNavbar />
      <div className="flex">
        <DocsSidebar />
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
