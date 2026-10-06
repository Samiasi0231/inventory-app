import { Outlet } from "react-router-dom";
 
/** Single-column layout: content centered on the page, no side image. */
export function CenteredLayout() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 py-12">
      <div className="w-full max-w-[520px]">
        <Outlet />
      </div>
    </main>
  );
}