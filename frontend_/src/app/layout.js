import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";



import "./globals.css";

export const metadata = {
    title: "Sistema de Oficinas",
    description: "Projeto PSW / TDW",
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt">
        <body>
        {children}
        </body>
        </html>
    );


}
