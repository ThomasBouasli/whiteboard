import type { Metadata } from "next";
import "@/styles/globals.css";

import { Caveat } from "next/font/google";
import Link from "next/link";
import { Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Whiteboard",
  description: "Paper is boring",
  metadataBase: new URL("https://www.whiteboard.bouasli.com"),
  openGraph: {
    title: "Whiteboard",
    description: "Paper is boring",
    images: [
      {
        url: "/logo.png",
        width: 144,
        height: 144,
        alt: "Whiteboard",
      },
    ],
  },
};

const caveat = Caveat({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <h1
          className={`absolute bottom-2 right-4 text-2xl ${caveat.className} z-10`}
        >
          Made with <Heart className="inline" size={14} />
          by{" "}
          <Link className="underline" href="https://github.com/ThomasBouasli">
            Thomas Bouasli
          </Link>
        </h1>
        {children}
      </body>
    </html>
  );
}
