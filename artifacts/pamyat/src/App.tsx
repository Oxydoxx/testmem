import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import NotFound from "@/pages/not-found";

import Login from "@/pages/Login";
import Intro from "@/pages/Intro";
import Dashboard from "@/pages/Dashboard";
import Tree from "@/pages/Tree";
import Stories from "@/pages/Stories";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import Memorial from "@/pages/Memorial";
import Dates from "@/pages/Dates";
import Relatives from "@/pages/Relatives";
import Wall from "@/pages/Wall";
import Capsules from "@/pages/Capsules";
import Menu from "@/pages/Menu";

import BottomNav from "@/components/BottomNav";

const queryClient = new QueryClient();

function AnimatedRouter() {
  const [location] = useLocation();
  const showBottomNav = ["/dashboard", "/tree", "/wall", "/stories", "/menu"].includes(location);
  // Tree manages its own internal scroll — it needs a fixed-height container
  const isTree = location === "/tree";

  return (
    <div className="flex flex-col h-full relative">
      <div
        className={cn(
          "flex-1 relative",
          isTree ? "overflow-hidden" : "overflow-y-auto overflow-x-hidden pb-[env(safe-area-inset-bottom)]"
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <Switch location={location} key={location}>
            <Route path="/" component={Intro} />
            <Route path="/login" component={Login} />
            <Route path="/intro" component={Intro} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/tree" component={Tree} />
            <Route path="/stories" component={Stories} />
            <Route path="/wall" component={Wall} />
            <Route path="/capsules" component={Capsules} />
            <Route path="/menu" component={Menu} />
            <Route path="/settings" component={Settings} />
            <Route path="/profile/:id" component={Profile} />
            <Route path="/memorial/:id" component={Memorial} />
            <Route path="/dates" component={Dates} />
            <Route path="/relatives" component={Relatives} />
            <Route component={NotFound} />
          </Switch>
        </AnimatePresence>
      </div>
      {showBottomNav && (
        <div className="h-16 shrink-0 relative z-50">
          <BottomNav />
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div className="desktop-container">
            <div className="mobile-app">
              <AnimatedRouter />
            </div>
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
