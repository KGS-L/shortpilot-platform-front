import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <div className="flex min-h-screen"><Sidebar/><main className="min-w-0 flex-1 p-5 md:p-8 lg:p-10">{children}</main></div>;
}
