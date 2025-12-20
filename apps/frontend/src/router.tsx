import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingLayout from "./components/LandingLayout";
import { RotatingCanvasText } from "./components/home/LoadingScreen";

// Lazy loaded pages
const HomePage = lazy(() => import("./pages/HomePage"));
const SignInPage = lazy(() => import("./pages/SignInPage"));
const DayMap = lazy(() => import("./pages/dayMap"));
const PlayPage = lazy(() => import("./pages/PlayPage"));
const LeaderboardPage = lazy(() => import("./pages/LeaderboardPage"));
const Rules = lazy(() => import("./pages/Rules"));
const AboutUs = lazy(() => import("@/pages/AboutUs"));
//const HowItWorks = lazy(() => import("./pages/HowitWorks"));

// Fallback loader
const PageLoader = () => (
  <div className="flex min-h-screen justify-center items-center">
    <RotatingCanvasText />
  </div>
);

function AppRouter() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingLayout />,
      children: [
        // HOME
        {
          index: true,
          element: (
            <Suspense>
              <HomePage />
            </Suspense>
          ),
        },

        // ✅ NEW HOW IT WORKS PAGE
        // {
        //   path: "/how-it-works",
        //   element: (
        //     <Suspense fallback={<PageLoader />}>
        //       <HowItWorks />
        //     </Suspense>
        //   ),
        // },

        // RULES
        {
          path: "/rules",
          element: (
            <Suspense fallback={<PageLoader />}>
              <Rules />
            </Suspense>
          ),
          handle: { noScroll: true },
        },

        // ABOUT
        {
          path: "/about-us",
          element: (
            <Suspense fallback={<PageLoader />}>
              <AboutUs />
            </Suspense>
          ),
        },

        // SIGN IN
        {
          path: "/signin",
          element: (
            <Suspense fallback={<PageLoader />}>
              <SignInPage />
            </Suspense>
          ),
        },

        // PLAY (Protected)
        {
          path: "/play",
          element: (
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <DayMap />
              </Suspense>
            </ProtectedRoute>
          ),
        },

        {
          path: "/play/:day",
          element: (
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <PlayPage />
              </Suspense>
            </ProtectedRoute>
          ),
        },

        // LEADERBOARD (Protected)
        {
          path: "/leaderboard",
          element: (
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <LeaderboardPage />
              </Suspense>
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default AppRouter;
