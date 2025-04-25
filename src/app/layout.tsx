import type { Metadata } from "next";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import { CssBaseline } from "@mui/material";
import { AuthProvider } from "@features/auth/context/AuthContext";
import ProtectedRoute from "@features/auth/components/ProtectedRoute";
import Header from "@/components/Header";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Document Management",
  description: "Document Management System, built with Next.js and MUI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable}>
      <body>
        <AppRouterCacheProvider options={{ key: "css" }}>
          <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            <AuthProvider>
              <ProtectedRoute>
                <Header />
                {children}
              </ProtectedRoute>
            </AuthProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
