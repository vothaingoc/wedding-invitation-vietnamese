import type { Metadata } from "next";
import { headers } from "next/headers";
import { wedding } from "../src/config/wedding";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const siteUrl = host ? `${protocol}://${host}` : wedding.publicUrl;

  return {
    metadataBase: new URL(siteUrl),
    title: `Thiệp cưới ${wedding.groomName} & ${wedding.brideName}`,
    description:
      "Trân trọng kính mời quý vị đến chung vui cùng Thái Ngọc và Ngọc Linh.",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      type: "website",
      url: siteUrl,
      title: `Thiệp cưới ${wedding.groomName} & ${wedding.brideName}`,
      description:
        "Trân trọng kính mời quý vị đến chung vui cùng Thái Ngọc và Ngọc Linh.",
      images: [
        {
          url: wedding.ogImage,
          width: 1200,
          height: 630,
          alt: "Thiệp mời đám cưới Thái Ngọc và Ngọc Linh",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Thiệp cưới ${wedding.groomName} & ${wedding.brideName}`,
      description:
        "Trân trọng kính mời quý vị đến chung vui cùng Thái Ngọc và Ngọc Linh.",
      images: [wedding.ogImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
