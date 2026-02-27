"use client";
import { baselightTheme } from "@/utils/theme/DefaultColors";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Provider } from "react-redux"
import { store } from "@/store";
import './global.css'
import { CacheProvider } from "@emotion/react";
import rtlCache from "@/rtlCache ";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa">
      <body>
        <CacheProvider value={rtlCache}>
          <ThemeProvider theme={baselightTheme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Provider store={store}>
              {children}
            </Provider>
          </ThemeProvider>
        </CacheProvider>
      </body>
    </html>
  );
}
