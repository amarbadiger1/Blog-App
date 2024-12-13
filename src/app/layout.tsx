import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClerkProvider } from "@clerk/nextjs";
const inter = Inter({
  subsets: ["latin"], // Specify the subsets required
});
import { dark } from '@clerk/themes'
export const metadata: Metadata = {
  title: "Blog App",
  description: "Tech Blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{
      baseTheme: dark,
    }}>
      <html lang="en">
        <body className={inter.className}>
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
