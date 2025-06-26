import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeLangProvider } from "@/context/ThemeLangContext";
import { ThemeProvider } from 'next-themes';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata = {
//   title: 'Mon App',
//   description: 'Thème dark/light avec next-themes',
// };

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={geistSans.variable}>
      <body>
        <ThemeLangProvider>
          <ThemeProvider
            attribute="data-theme"
            defaultTheme="system"
            enableSystem={true}
            themes={['light', 'dark-orange', 'dark-blue', 'light-orange']}
          >
            {children}
          </ThemeProvider>
        </ThemeLangProvider>
      </body>
    </html>
  );
}
