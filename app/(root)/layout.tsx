import Sidebar from "@/components/shared/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import React from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="root">
      {/* <Sidebar /> */}
      <div className="w-full overflow-hidden">
        <div className="w-full overflow-hidden">{children}</div>
      </div>
      <Toaster />
    </main>
  );
};

export default RootLayout;