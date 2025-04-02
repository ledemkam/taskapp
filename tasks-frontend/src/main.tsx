import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { NextUIProvider } from "@nextui-org/react";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { QueryProvider } from "./tanskquery/QueryProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
   <QueryProvider>

      <NextUIProvider>
        {/* Dark Mode */}
        <div className="dark text-foreground bg-background min-h-screen min-w-screen flex justify-center items-center">
          <App />
        </div>
      </NextUIProvider>
   </QueryProvider>
  </BrowserRouter>
);
