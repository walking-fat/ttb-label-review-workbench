import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Label Triage Pilot",
  description: "AI-assisted alcohol label review prototype."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
