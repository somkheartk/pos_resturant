import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { AuthProvider } from "@/contexts/AuthContext";

const kanit = Kanit({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin", "thai"],
  variable: "--font-kanit",
});

export const metadata: Metadata = {
  title: "POS Restaurant System",
  description: "ระบบจัดการร้านอาหาร Point of Sale",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body
        className={`${kanit.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <SidebarProvider>
            <CartProvider>{children}</CartProvider>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
