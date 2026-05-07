import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Heart, Bell, Calendar as CalendarIcon, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dates() {
  const { family } = useAppStore();
  const { toast } = useToast();
  const [reminders, setReminders] = useState(true);

  const handleToggle = () => {
    setReminders(!reminders);
    toast({
      title: !reminders ? "Напоминания включены" : "Напоминания выключены",
      description: "Мы уведомим вас о предстоящих важных датах",
    });
  };

  // Mock data for upcoming dates based on family
  const upcomingDates = [
    {
      id: "1",
      person: family["1"],
      type: "День рождения",
      date: "15 апреля",
      daysLeft: 5,
      year: "1985",
      icon: Heart,
      iconColor: "text-red-500",
      bgColor: "bg-red-500/10"
    },
    {
      id: "2",
      person: family["2"],
      type: "День памяти",
      date: "22 апреля",
      daysLeft: 12,
      year: "2018",
      icon: Bell,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-500/10"
    },
    {
      id: "3",
      person: family["4"],
      type: "День рождения",
      date: "10 мая",
      daysLeft: 30,
      year: "1960",
      icon: Heart,
      iconColor: "text-red-500",
      bgColor: "bg-red-500/10"
    },
    {
      id: "4",
      person: family["3"],
      type: "День памяти",
      date: "18 мая",
      daysLeft: 38,
      year: "2010",
      icon: Bell,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-500/10"
    }
  ];

  return (
    <div className="h-full w-full bg-background overflow-y-auto px-5 py-8 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-2xl font-semibold text-foreground">Важные даты</h1>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Напоминания</span>
          <Switch checked={reminders} onCheckedChange={handleToggle} />
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 px-1">Апрель</h2>
          <div className="space-y-3">
            {upcomingDates.slice(0, 2).map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-card border-card-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex items-center p-4 gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-background shadow-sm">
                        {item.person ? (
                          <img src={item.person.avatar} alt={item.person.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                            <User size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-6 h-6 rounded-full ${item.bgColor} flex items-center justify-center shrink-0`}>
                            {item.type === "День памяти" ? (
                              <div className="w-2 h-2 bg-amber-500 rounded-full blur-[1px]" />
                            ) : (
                              <item.icon size={12} className={item.iconColor} />
                            )}
                          </div>
                          <h3 className="font-medium text-sm text-foreground">{item.type}</h3>
                        </div>
                        <p className="text-foreground/90 font-serif text-base truncate">
                          {item.person?.name || "Неизвестный"}
                        </p>
                        <p className="text-muted-foreground text-xs mt-1">
                          {item.date} • {new Date().getFullYear() - parseInt(item.year)} лет
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-primary">Через {item.daysLeft} дн.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 px-1">Май</h2>
          <div className="space-y-3">
            {upcomingDates.slice(2).map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
              >
                <Card className="bg-card border-card-border overflow-hidden shadow-sm opacity-80">
                  <CardContent className="p-0">
                    <div className="flex items-center p-4 gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-background shadow-sm">
                        {item.person ? (
                          <img src={item.person.avatar} alt={item.person.name} className="w-full h-full object-cover grayscale-[30%]" />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                            <User size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-sm text-foreground">{item.type}</h3>
                        </div>
                        <p className="text-foreground/90 font-serif text-base truncate">
                          {item.person?.name || "Неизвестный"}
                        </p>
                        <p className="text-muted-foreground text-xs mt-1">
                          {item.date}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-medium text-foreground">{item.daysLeft} дн.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
