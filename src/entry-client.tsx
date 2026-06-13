// // import { StrictMode } from "react";
// // import { createRoot } from "react-dom/client";
// import { hydrateRoot } from "react-dom/client";
// import { RouterProvider } from "@tanstack/react-router";
// import { getRouter } from "./router";
// // import "./styles.css";

// const router = getRouter();

// // createRoot(document.getElementById("root")!).render(
// //   <StrictMode>
// //     <RouterProvider router={router} />
// //   </StrictMode>
// // );

// hydrateRoot(document.getElementById("root")!, (
//   <RouterProvider router={router} />
// ));

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
