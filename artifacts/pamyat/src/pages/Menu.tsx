import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "@/components/ui/card";
import {
  User,
  Lock,
  Users,
  Calendar,
  Settings as SettingsIcon,
  Trophy,
  HelpCircle,
  LogOut,
  ChevronRight,
  CreditCard,
  Bell,
  Shield,
} from "lucide-react";

const sections = [
  {
    title: "Семейный архив",
    items: [
      { href: "/dates", label: "Важные даты", icon: Calendar, color: "bg-rose-100 text-rose-600" },
      { href: "/relatives", label: "Поиск родственников", icon: Users, color: "bg-blue-100 text-blue-600" },
      { href: "/capsules", label: "Капсулы времени", icon: Lock, color: "bg-purple-100 text-purple-600" },
    ],
  },
  {
    title: "Аккаунт",
    items: [
      { href: "/settings", label: "Настройки", icon: SettingsIcon, color: "bg-stone-100 text-stone-700" },
      { href: "/settings", label: "Подписка", icon: CreditCard, color: "bg-amber-100 text-amber-700" },
      { href: "/settings", label: "Уведомления", icon: Bell, color: "bg-orange-100 text-orange-600" },
      { href: "/settings", label: "Приватность", icon: Shield, color: "bg-emerald-100 text-emerald-600" },
    ],
  },
  {
    title: "Помощь",
    items: [
      { href: "/settings", label: "Справка", icon: HelpCircle, color: "bg-sky-100 text-sky-600" },
    ],
  },
];

export default function Menu() {
  const { currentUser, logout, achievements } = useAppStore();
  const [, setLocation] = useLocation();
  const unlocked = achievements.filter((a) => !a.locked).length;

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full w-full bg-background overflow-y-auto pb-28"
    >
      {/* Profile header */}
      <div className="px-5 pt-8 pb-6">
        <h1 className="font-serif text-2xl font-semibold mb-5">Ещё</h1>
        <Link href={`/profile/${currentUser?.id}`}>
          <Card className="p-4 border-card-border shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/30 shrink-0">
              <img src={currentUser?.avatar} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{currentUser?.name}</h3>
              <p className="text-xs text-muted-foreground truncate">{currentUser?.profession}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-semibold">
                  Pro · 6 мес.
                </div>
              </div>
            </div>
            <ChevronRight className="text-muted-foreground" size={18} />
          </Card>
        </Link>
      </div>

      {/* Achievements strip */}
      <div className="px-5 mb-6">
        <Card className="bg-gradient-to-br from-amber-50 to-orange-100/50 border-amber-200/50 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-300/50">
              <Trophy className="text-white" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Достижения</h3>
              <p className="text-xs text-muted-foreground">
                {unlocked} из {achievements.length} получено
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-serif font-bold text-orange-600">{unlocked}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Sections */}
      <div className="px-5 space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
              {section.title}
            </h3>
            <Card className="border-card-border shadow-sm overflow-hidden divide-y divide-border/60">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.label} href={item.href}>
                    <div className="flex items-center gap-3 px-4 py-3.5 hover:bg-accent/50 transition-colors cursor-pointer active:bg-accent">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.color}`}>
                        <Icon size={16} />
                      </div>
                      <span className="flex-1 text-sm font-medium text-foreground">{item.label}</span>
                      <ChevronRight className="text-muted-foreground" size={16} />
                    </div>
                  </Link>
                );
              })}
            </Card>
          </div>
        ))}

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
        >
          <LogOut size={16} />
          Выйти из аккаунта
        </button>

        <div className="text-center text-xs text-muted-foreground pt-2">
          Память · v1.0 · 2026
        </div>
      </div>
    </motion.div>
  );
}
