import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

/**
 * Shell layout for all public-facing routes.
 *
 * Employs a sticky footer structure using flexbox (`min-h-screen flex-col`)
 * where `<main>` expands (`flex-1`) to push `<Footer />` to the bottom
 * of the viewport even when route content is short.
 */
export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
