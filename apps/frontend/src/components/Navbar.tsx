import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, Menu, X } from "lucide-react";
import Logo from "@/assets/Group 113.svg";
import { cn } from "../lib/utils";
import { useAuth } from "../contexts/AuthContext";

interface NavbarProps {
  isSignInPage?: boolean;
  className?: string;
}

const navItems = [
  { name: "Home", path: "/" },
  { name: "Rules", path: "/rules" },
  { name: "About Us", path: "/about-us" },
  { name: "Leaderboard", path: "/leaderboard" },
  { name: "Play", path: "/play" },
];

export function Navbar({ isSignInPage = false, className }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, signOut } = useAuth();
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const isAboutUsPage = location.pathname === "/about-us";
  const isRulesPage = location.pathname === "/rules";
  const hasCustomScroll = isAboutUsPage || isRulesPage;

  useEffect(() => {
    lastScrollY.current = 0;
    setVisible(true);
    
    const getScrollElement = (): HTMLElement | null => {
      if (isAboutUsPage) {
        return document.querySelector('[data-about-us-scroll]') as HTMLElement;
      } else if (isRulesPage) {
        return document.querySelector('[data-rules-scroll]') as HTMLElement;
      }
      return null;
    };
    
    const handleScroll = () => {
      let current: number;
      
      if (hasCustomScroll) {
        const scrollElement = getScrollElement();
        if (!scrollElement) return;
        current = scrollElement.scrollTop;
      } else {
        current = window.scrollY;
      }
      
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          if (current <= 0) {
            setVisible(true);
          } else if (current > lastScrollY.current && current > 50) {
            setVisible(false);
          } else if (current < lastScrollY.current) {
            setVisible(true);
          }
          lastScrollY.current = current;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    if (hasCustomScroll) {
      let scrollElement: HTMLElement | null = null;
      let timeoutIds: NodeJS.Timeout[] = [];
      let observer: MutationObserver | null = null;
      
      const setupScrollListener = () => {
        const element = getScrollElement();
        if (element && !scrollElement) {
          scrollElement = element;
          scrollElement.addEventListener("scroll", handleScroll, { passive: true });
          handleScroll();
          return true;
        }
        return false;
      };
      
      if (!setupScrollListener()) {
        for (let i = 0; i < 5; i++) {
          const timeoutId = setTimeout(() => {
            setupScrollListener();
          }, 50 * (i + 1));
          timeoutIds.push(timeoutId);
        }
        
        observer = new MutationObserver(() => {
          if (setupScrollListener() && observer) {
            observer.disconnect();
          }
        });
        
        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
      }
      
      return () => {
        timeoutIds.forEach(id => clearTimeout(id));
        if (observer) observer.disconnect();
        if (scrollElement) {
          scrollElement.removeEventListener("scroll", handleScroll);
        }
      };
    } else {
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [hasCustomScroll, isAboutUsPage, isRulesPage]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to sign out", error);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b border-black transition-transform duration-300",
        // force consistent navbar background
        "bg-[#FFF2E4]",
        visible ? "translate-y-0" : "-translate-y-full",
        className
      )}
    >
      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" aria-label="Enigma home" className="flex items-center justify-start">
            <img
              src={Logo}
              alt="Enigma logo"
              className="h-7 sm:h-8 md:h-9 w-auto object-contain select-none -ml-1"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-x-10">
            <nav className="flex items-center gap-x-10">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "text-sm tracking-wide transition-colors relative group",
                      "font-semibold",
                      isActive ? "text-black font-bold" : "text-black font-normal hover:text-black"
                    )}
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
                  </Link>
                );
              })}
            </nav>

            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center" aria-label="Open account menu">
                    <Avatar className="h-9 w-9 border border-black/10">
                      <AvatarImage src={currentUser.photoURL ?? undefined} />
                      <AvatarFallback className="bg-black text-white">
                        {currentUser.displayName?.[0]?.toUpperCase() ||
                          currentUser.email?.[0]?.toUpperCase() ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48 bg-white border border-black/10">
                  <DropdownMenuItem className="text-black" aria-disabled>
                    {currentUser.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : !isSignInPage ? (
              <Link
                to="/signin"
                className="text-sm font-medium rounded-md border border-black text-black px-4 py-1.5 hover:bg-black hover:text-white transition"
              >
                Sign Up
              </Link>
            ) : null}
          </div>

          {/* Mobile menu button and user auth */}
          <div className="lg:hidden flex items-center gap-3">
            {currentUser && (
              <Link to="/play" aria-label="User profile">
                <Avatar className="h-8 w-8 border border-black/10">
                  <AvatarImage src={currentUser.photoURL ?? undefined} />
                  <AvatarFallback className="bg-black text-white text-xs">
                    {currentUser.displayName?.[0]?.toUpperCase() ||
                      currentUser.email?.[0]?.toUpperCase() ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
            {!currentUser && !isSignInPage && (
              <Link
                to="/signin"
                className="text-xs font-medium rounded-md border border-black text-black px-3 py-1.5 hover:bg-black hover:text-white transition"
              >
                Sign Up
              </Link>
            )}
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              className="p-2"
            >
              {open ? <X className="h-6 w-6 text-black" /> : <Menu className="h-6 w-6 text-black" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - rendered via portal */}
      {typeof document !== 'undefined' && createPortal(
        <>
          {/* Mobile menu overlay */}
          {open && (
            <div
              className="fixed top-16 left-0 right-0 bottom-0 bg-black/20 backdrop-blur-sm z-[60] lg:hidden"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Mobile menu slide-out */}
          <div
            className="fixed top-16 left-0 w-full bottom-0 bg-[#FFF2E4] shadow-xl transition-transform duration-300 ease-in-out z-[70] overflow-y-auto lg:hidden"
            style={{ 
              transform: open ? 'translateX(0)' : 'translateX(-100%)',
              willChange: 'transform'
            }}
            role="dialog"
            aria-modal={open}
            aria-label="Mobile navigation menu"
            aria-hidden={!open}
          >
            <div className="flex flex-col h-full">
              {/* Mobile nav items */}
              <nav className="flex flex-col">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "px-6 py-4 text-black font-medium flex justify-between items-center border-b border-black/10 transition-colors",
                        isActive ? "bg-black/5 font-bold" : "hover:bg-black hover:text-white"
                      )}
                    >
                      {item.name}
                      <span className="text-black/40">{isActive ? "•" : "›"}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile user section */}
              {currentUser && (
                <div className="mt-auto border-t border-black/10 pt-4 px-6 pb-6">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-black/10">
                    <Avatar className="h-10 w-10 border border-black/10">
                      <AvatarImage src={currentUser.photoURL ?? undefined} />
                      <AvatarFallback className="bg-black text-white">
                        {currentUser.displayName?.[0]?.toUpperCase() ||
                          currentUser.email?.[0]?.toUpperCase() ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-black truncate">
                        {currentUser.displayName || "User"}
                      </p>
                      <p className="text-xs text-black/60 truncate">{currentUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 text-sm font-medium text-red-500 py-3 border border-red-500/20 rounded-md hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </>,
        document.body
      )}
    </header>
  );
}