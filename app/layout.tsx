import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { PermissionProvider } from "@/contexts/PermissionContext";
import { ShiftProvider } from "@/contexts/ShiftContext";

const kanit = Kanit({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin", "thai"],
  variable: "--font-kanit",
});

export const metadata: Metadata = {
  title: "POS Restaurant System",
  description: "ระบบจัดการร้านอาหาร Point of Sale",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body
        className={`${kanit.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <PermissionProvider>
            <LanguageProvider>
              <SidebarProvider>
                <CartProvider>
                  <ShiftProvider>
                    {children}
                  </ShiftProvider>
                </CartProvider>
              </SidebarProvider>
            </LanguageProvider>
          </PermissionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
