import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin · Car Dynasty",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#070809] font-[family-name:var(--font-body)]">{children}</div>;
}
