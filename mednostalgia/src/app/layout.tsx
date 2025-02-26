
import type { Metadata } from "next";
import Navbar from '../components/navigation/Navbar';
import "./globals.css";
import ReduxProvider from "@/app/ReduxProvider";
import LoadUser from "@/components/LoadUser";
export const metadata: Metadata = {
  title: "Med Nostalgia",
  description: "Generated by create next app",
};

export default function RootLayout({

  children,
  
}: Readonly<{
  children: React.ReactNode;
  
}>) 
{

  
  return (
    <html lang="en">
      <body>
      <ReduxProvider>
      
      <LoadUser />
        <Navbar />
       {children}
       </ReduxProvider>
      </body>
    </html>
  );
}