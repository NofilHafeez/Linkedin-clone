import type { Metadata } from "next";
import { Source_Sans_3,  Source_Code_Pro  } from "next/font/google";
import { AuthProvider } from "../../context/AuthContext";
import "./globals.css";
import { SocketProvider } from "../../context/SocketContext";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

const sourceMono = Source_Code_Pro({
  variable: "--font-source-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Linkedin-Clone",
  description: "Professional Networking Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sourceSans.variable} ${sourceMono.variable}antialiased`}
      >
        <SocketProvider>
          <AuthProvider>
              {children}
          </AuthProvider>
       </SocketProvider> 
      </body>
    </html>
  );
}
