import { ClerkProvider } from "@clerk/nextjs";
import { Playfair_Display, Lato } from "next/font/google";
import Navbar from "@/components/Navbar";
import UserSync from "@/components/UserSync";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const lato = Lato({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-lato" });

export const metadata = {
  title: "Nexus",
  description: "A modern community platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${playfair.variable} ${lato.variable} font-lato`}>
          <Navbar />
          <UserSync />
          <main className="pt-16">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}