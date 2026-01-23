import "./globals.css";
import { AuthProvider } from "./providers/AuthContext";
import Navbar from "./components/Navbar";

export default function RootLayout({ children }) {
    return (
        <html lang="pt">
        <body>
        <AuthProvider>
            <Navbar />
            {children}
        </AuthProvider>
        </body>
        </html>
    );
}
