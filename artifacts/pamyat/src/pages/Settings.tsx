import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, LogOut, Download, Trash2, Globe, Bell, Calendar, UserPlus } from "lucide-react";

export default function Settings() {
  const [, setLocation] = useLocation();
  const { currentUser } = useAppStore();
  const { toast } = useToast();

  const handleLogout = () => {
    setLocation("/login");
  };

  const handleToggle = (setting: string) => {
    toast({ title: "Настройки обновлены", description: setting });
  };

  return (
    <div className="h-full w-full bg-background overflow-y-auto px-5 py-8 pb-24">
      <h1 className="font-serif text-2xl font-semibold text-foreground mb-6">Настройки</h1>

      <div className="space-y-6">
        {/* Profile */}
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-2">Профиль</h2>
          <Card className="bg-card border-card-border overflow-hidden shadow-sm">
            <CardContent className="p-0 divide-y divide-border/50">
              <div className="flex items-center justify-between p-4 active:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-background shadow-sm">
                    <img src={currentUser?.avatar} alt={currentUser?.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{currentUser?.name}</p>
                    <p className="text-xs text-muted-foreground">anna.ivanova@pamyat.ru</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between p-4 active:bg-accent/50 transition-colors">
                <span className="text-sm text-foreground">Изменить пароль</span>
                <ChevronRight size={20} className="text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Subscription */}
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-2">Подписка</h2>
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 overflow-hidden shadow-sm">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">Бесплатный период</h3>
                  <p className="text-xs text-muted-foreground mt-1">Осталось 178 дней из 180</p>
                </div>
                <div className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-md">
                  TRIAL
                </div>
              </div>
              
              <div className="w-full h-2 bg-primary/10 rounded-full mb-4 overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[2%]" />
              </div>
              
              <div className="flex justify-between items-center text-sm mb-4">
                <span className="text-muted-foreground">После триала:</span>
                <span className="font-medium text-foreground">600 ₽ / 6 месяцев</span>
              </div>

              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Управлять подпиской
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Notifications */}
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-2">Уведомления</h2>
          <Card className="bg-card border-card-border overflow-hidden shadow-sm">
            <CardContent className="p-0 divide-y divide-border/50">
              {[
                { icon: Calendar, label: "Важные даты", default: true },
                { icon: Globe, label: "Новые истории", default: true },
                { icon: UserPlus, label: "Приглашения", default: true },
                { icon: Bell, label: "Общие обновления", default: false }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-muted-foreground"><item.icon size={18} /></div>
                    <span className="text-sm text-foreground">{item.label}</span>
                  </div>
                  <Switch defaultChecked={item.default} onCheckedChange={() => handleToggle(item.label)} />
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Data & Privacy */}
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-2">Данные и приватность</h2>
          <Card className="bg-card border-card-border overflow-hidden shadow-sm">
            <CardContent className="p-0 divide-y divide-border/50">
              <div className="flex items-center justify-between p-4 active:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="text-muted-foreground"><Globe size={18} /></div>
                  <span className="text-sm text-foreground">Кто видит мой профиль</span>
                </div>
                <ChevronRight size={20} className="text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between p-4 active:bg-accent/50 transition-colors" onClick={() => handleToggle("Скачивание началось")}>
                <div className="flex items-center gap-3">
                  <div className="text-muted-foreground"><Download size={18} /></div>
                  <span className="text-sm text-foreground">Скачать мои данные</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 active:bg-red-50 transition-colors text-red-500">
                <div className="flex items-center gap-3">
                  <div><Trash2 size={18} /></div>
                  <span className="text-sm">Удалить аккаунт</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="pt-4">
          <Button variant="outline" className="w-full h-12 text-muted-foreground" onClick={handleLogout}>
            <LogOut size={18} className="mr-2" />
            Выйти из аккаунта
          </Button>
          <div className="text-center mt-6">
            <p className="text-xs text-muted-foreground">Версия 1.0.0</p>
            <p className="text-xs text-muted-foreground mt-1">Политика конфиденциальности</p>
          </div>
        </section>

      </div>
    </div>
  );
}
