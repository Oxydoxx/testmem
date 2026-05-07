import { Link, useLocation } from "wouter";
import { Home, Network, Image, BookOpen, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/dashboard", label: "Главная", icon: Home },
    { href: "/tree", label: "Древо", icon: Network },
    { href: "/wall", label: "Стена", icon: Image },
    { href: "/stories", label: "Истории", icon: BookOpen },
    { href: "/menu", label: "Ещё", icon: Menu },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-background/85 backdrop-blur-xl border-t border-border/60 pb-safe z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || location.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 h-full flex flex-col items-center justify-center gap-0.5 group no-default-active-elevate"
            >
              <div className={cn(
                "px-3 py-1 rounded-full transition-all duration-200 flex items-center justify-center",
                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
              )}>
                <Icon size={isActive ? 18 : 20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
