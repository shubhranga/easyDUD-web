import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";

const router = getRouter();

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
});
