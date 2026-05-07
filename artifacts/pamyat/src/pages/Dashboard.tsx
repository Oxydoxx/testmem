import { useState } from "react";
import { Link } from "wouter";
import { motion, type Variants } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronRight, Plus, Heart, Sparkles, Trophy, Users,
  Lock, Calendar, Image as ImageIcon, BookOpen, Trees,
  Network, Flame, Target, UserPen, UserPlus,
} from "lucide-react";
import MemberFormModal from "@/components/MemberFormModal";

const iconMap: Record<string, React.ElementType> = { BookOpen, Trees, Network, Lock };

export default function Dashboard() {
  const { currentUser, family, stories, achievements } = useAppStore();
  const familyMembers = Object.values(family).filter((m) => m.id !== currentUser?.id);
  const livingCount = Object.values(family).filter((m) => !m.isDeceased).length;
  const memorialCount = Object.values(family).filter((m) => m.isDeceased).length;

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  // Today's date in Russian
  const today = new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long" });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full w-full bg-background overflow-y-auto pb-28"
    >
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="px-5 pt-7 space-y-6">
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
              Сегодня · {today}
            </p>
            <h1 className="font-serif text-[26px] leading-tight font-semibold text-foreground mt-0.5">
              Привет, {currentUser?.name.split(" ")[0]}
            </h1>
          </div>
          <Link href={`/profile/${currentUser?.id}`}>
            <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/30 active:scale-95 transition-transform cursor-pointer">
              <img src={currentUser?.avatar} alt="" className="w-full h-full object-cover" />
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 ring-2 ring-background" />
            </div>
          </Link>
        </motion.div>

        {/* Quick profile actions */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setShowEditProfile(true)}
            className="flex items-center gap-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl px-3.5 py-3 hover:shadow-sm transition-all active:scale-[0.98]"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shrink-0">
              <UserPen size={15} className="text-white" />
            </div>
            <div className="text-left min-w-0">
              <p className="text-xs font-semibold text-foreground leading-tight">Мой профиль</p>
              <p className="text-[10px] text-muted-foreground">Заполнить данные</p>
            </div>
          </button>
          <button
            onClick={() => setShowAddMember(true)}
            className="flex items-center gap-2.5 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/60 rounded-2xl px-3.5 py-3 hover:shadow-sm transition-all active:scale-[0.98]"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shrink-0">
              <UserPlus size={15} className="text-white" />
            </div>
            <div className="text-left min-w-0">
              <p className="text-xs font-semibold text-foreground leading-tight">Добавить</p>
              <p className="text-[10px] text-muted-foreground">Родственника</p>
            </div>
          </button>
        </motion.div>

        {/* Stats Pills */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2">
          <StatPill icon={Users} value={livingCount} label="Живых" color="bg-emerald-50 text-emerald-700 border-emerald-100" />
          <StatPill icon={Heart} value={memorialCount} label="Память" color="bg-amber-50 text-amber-700 border-amber-100" />
          <StatPill icon={BookOpen} value={stories.length} label="Историй" color="bg-rose-50 text-rose-700 border-rose-100" />
        </motion.div>

        {/* Stories bar (Instagram-style) */}
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Семья</h2>
            <Link href="/tree" className="text-xs text-primary font-medium">Все →</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-2 scrollbar-hide">
            <button
              onClick={() => setShowAddMember(true)}
              className="shrink-0 flex flex-col items-center gap-1.5"
            >
              <div className="w-[68px] h-[68px] rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center bg-primary/5 hover:bg-primary/10 transition-colors">
                <Plus className="text-primary" size={24} />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">Добавить</span>
            </button>

            {familyMembers.map((m) => (
              <Link key={m.id} href={`/profile/${m.id}`} className="shrink-0">
                <div className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
                  <div
                    className={`p-[2.5px] rounded-full ${
                      m.isDeceased
                        ? "bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400"
                        : "bg-gradient-to-tr from-emerald-400 via-teal-400 to-sky-400"
                    }`}
                  >
                    <div className="bg-background p-0.5 rounded-full">
                      <div className="w-14 h-14 rounded-full overflow-hidden">
                        <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-foreground max-w-[70px] truncate">
                    {m.name.split(" ")[0]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Hero CTA — Family tree */}
        <motion.div variants={itemVariants}>
          <Link href="/tree">
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 text-white shadow-xl shadow-orange-200/40 cursor-pointer">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <CardContent className="p-5 relative">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                    <Network size={22} />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-serif font-bold leading-none">{Object.keys(family).length}</div>
                    <div className="text-[10px] uppercase tracking-wider opacity-90">человек</div>
                  </div>
                </div>
                <h3 className="font-serif text-xl font-semibold mb-1">Семейное древо</h3>
                <p className="text-sm text-white/90 mb-4">
                  Постройте визуальную карту вашего рода и найдите неожиданные связи
                </p>
                <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur rounded-full px-3 py-1.5 text-xs font-semibold">
                  Открыть
                  <ChevronRight size={14} />
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        {/* Weekly challenge */}
        <motion.div variants={itemVariants}>
          <Card className="border-card-border bg-gradient-to-br from-purple-50 to-indigo-50 shadow-sm overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-200 shrink-0">
                  <Target size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm text-foreground">Челлендж недели</h3>
                    <span className="text-[9px] px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded-full font-bold uppercase">Новое</span>
                  </div>
                  <p className="text-[13px] text-foreground/80 leading-snug">
                    Запишите 3 истории из детства бабушки и поделитесь с семьёй
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-purple-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style={{ width: "33%" }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium">1 / 3</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick actions */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
          <Link href="/wall">
            <Card className="border-card-border shadow-sm hover:shadow-md transition-shadow active:scale-[0.98] cursor-pointer">
              <CardContent className="p-4">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-2">
                  <ImageIcon size={18} />
                </div>
                <h4 className="text-sm font-semibold text-foreground">Стена</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">Фото и моменты</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/capsules">
            <Card className="border-card-border shadow-sm hover:shadow-md transition-shadow active:scale-[0.98] cursor-pointer">
              <CardContent className="p-4">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-2">
                  <Lock size={18} />
                </div>
                <h4 className="text-sm font-semibold text-foreground">Капсулы</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">Послания в будущее</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dates">
            <Card className="border-card-border shadow-sm hover:shadow-md transition-shadow active:scale-[0.98] cursor-pointer">
              <CardContent className="p-4">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
                  <Calendar size={18} />
                </div>
                <h4 className="text-sm font-semibold text-foreground">Даты</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">Календарь</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/relatives">
            <Card className="border-card-border shadow-sm hover:shadow-md transition-shadow active:scale-[0.98] cursor-pointer">
              <CardContent className="p-4">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-2">
                  <Users size={18} />
                </div>
                <h4 className="text-sm font-semibold text-foreground">Поиск</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">Найти родню</p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        {/* Achievements */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Trophy size={14} className="text-amber-500" />
              Достижения
            </h2>
            <Link href="/menu" className="text-xs text-primary font-medium">Все</Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {achievements.slice(0, 4).map((a) => {
              const Icon = iconMap[a.icon] ?? Trophy;
              const pct = (a.progress / a.total) * 100;
              return (
                <div
                  key={a.id}
                  className={`p-3 rounded-2xl border ${a.locked ? "bg-muted/30 border-border opacity-60" : "bg-card border-card-border"}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${a.color}`}>
                    <Icon size={15} />
                  </div>
                  <h4 className="text-[11px] font-semibold text-foreground leading-tight line-clamp-1">{a.title}</h4>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${a.locked ? "bg-muted-foreground/30" : "bg-gradient-to-r from-amber-400 to-orange-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-bold text-muted-foreground tabular-nums">
                      {a.progress}/{a.total}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent stories */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Flame size={14} className="text-orange-500" />
              Свежие истории
            </h2>
            <Link href="/stories" className="text-xs text-primary font-medium">Все</Link>
          </div>
          <div className="space-y-2">
            {stories.slice(0, 2).map((s) => (
              <Card key={s.id} className="border-card-border shadow-sm">
                <CardContent className="p-3.5">
                  <div className="flex items-center gap-2.5 mb-2">
                    <img src={s.authorAvatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground leading-none">{s.authorName}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{s.date}</p>
                    </div>
                    <button className="text-muted-foreground hover:text-rose-500 transition-colors">
                      <Heart size={15} />
                    </button>
                  </div>
                  <p className="text-[13px] text-foreground/85 leading-snug line-clamp-2">{s.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Pro upsell */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 bg-foreground text-background overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl" />
            <CardContent className="p-4 relative flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center shrink-0">
                <Sparkles className="text-foreground" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold">Память Pro</h4>
                <p className="text-[11px] text-background/70">Бесплатно 6 месяцев · потом 600₽/полгода</p>
              </div>
              <Button size="sm" className="rounded-full bg-amber-400 hover:bg-amber-300 text-foreground font-semibold h-8 text-xs px-3">
                Активно
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <div className="h-2" />
      </motion.div>

      {/* Modals */}
      <MemberFormModal
        open={showEditProfile}
        member={currentUser ?? null}
        onClose={() => setShowEditProfile(false)}
      />
      <MemberFormModal
        open={showAddMember}
        member={null}
        onClose={() => setShowAddMember(false)}
      />
    </motion.div>
  );
}

function StatPill({ icon: Icon, value, label, color }: {
  icon: React.ElementType; value: number; label: string; color: string;
}) {
  return (
    <div className={`rounded-2xl border p-3 ${color}`}>
      <div className="flex items-center justify-between">
        <Icon size={16} />
        <span className="font-serif font-bold text-2xl leading-none">{value}</span>
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-wider mt-1.5 opacity-80">{label}</p>
    </div>
  );
}
