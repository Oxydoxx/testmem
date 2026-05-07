import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Lock, Plus, Calendar, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Capsules() {
  const { capsules, currentUser } = useAppStore();
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");
  const { toast } = useToast();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Капсула запечатана", description: `«${title}» откроется ${date}` });
    setShowCreate(false);
    setTitle("");
    setDate("");
    setDesc("");
  };

  const daysUntil = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full w-full bg-background overflow-y-auto pb-12"
    >
      <div className="px-5 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/menu">
            <button className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center active:scale-95 transition-transform">
              <ArrowLeft size={18} />
            </button>
          </Link>
          <h1 className="font-serif text-2xl font-semibold">Капсулы времени</h1>
        </div>

        {/* Hero */}
        <Card className="bg-gradient-to-br from-purple-100 via-amber-50 to-pink-100 border-0 overflow-hidden mb-6 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-300/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-300/30 rounded-full blur-3xl" />
          <CardContent className="p-6 relative">
            <Sparkles className="text-purple-500 mb-3" size={28} />
            <h2 className="font-serif text-xl font-semibold mb-2">Послания в будущее</h2>
            <p className="text-sm text-foreground/70 leading-relaxed mb-4">
              Создайте письмо, видео или фотоальбом, который откроется через годы — на свадьбе, юбилее или дне рождения.
            </p>
            <Button
              onClick={() => setShowCreate(true)}
              className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-5"
            >
              <Plus size={16} className="mr-1.5" />
              Создать капсулу
            </Button>
          </CardContent>
        </Card>

        {/* Create form */}
        {showCreate && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            onSubmit={handleCreate}
            className="bg-card border border-border rounded-2xl p-5 mb-6 space-y-3"
          >
            <Input placeholder="Название капсулы" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            <Textarea placeholder="О чём это послание..." value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} />
            <div className="flex gap-2">
              <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowCreate(false)}>
                Отмена
              </Button>
              <Button type="submit" className="flex-1 bg-primary text-primary-foreground">
                Запечатать
              </Button>
            </div>
          </motion.form>
        )}

        {/* Capsules list */}
        <div className="space-y-3">
          {capsules.map((cap, i) => {
            const days = daysUntil(cap.unlockDate);
            const totalYears = Math.floor(days / 365);
            return (
              <motion.div
                key={cap.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border-card-border shadow-sm overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shrink-0 shadow-md shadow-purple-200">
                        <Lock className="text-white" size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif font-semibold text-lg text-foreground">{cap.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{cap.description}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center gap-1.5 text-xs text-foreground/70">
                            <Calendar size={12} />
                            {new Date(cap.unlockDate).toLocaleDateString("ru-RU", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">
                            через {totalYears > 0 ? `${totalYears} ${totalYears === 1 ? "год" : "лет"}` : `${days} дн.`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {capsules.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Lock size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Пока нет капсул. Создайте первую!</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
