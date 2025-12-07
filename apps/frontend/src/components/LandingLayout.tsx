import { Outlet, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";

import bg from "@/assets/image.png";
import { Navbar } from "./Navbar";

interface LandingLayoutProps {
  children?: React.ReactNode;
  isSignInPage?: boolean;
}

const LandingLayout = ({ children, isSignInPage = false }: LandingLayoutProps) => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-dvh w-full relative overflow-hidden">

     \
      <div
        className="fixed inset-0 w-full h-screen z-0
                   bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: `url(${bg})`,
          opacity: 1
        }}
      />

      {/* NAVBAR */}
      <Navbar isSignInPage={isSignInPage} />

      {/* PAGE CONTENT */}
      <main
        className={cn(
          "relative z-20 min-h-screen flex flex-col",
          location.pathname === "/about-us" && "h-[calc(100vh-4rem)] overflow-hidden"
        )}
      >
        {children || <Outlet />}
      </main>

      {!isHome && null}
    </div>
  );
};

export default LandingLayout;
