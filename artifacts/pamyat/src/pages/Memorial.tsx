import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Heart, History, ImageIcon, Send, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function Memorial() {
  const { id } = useParams();
  const { family, lightCandle } = useAppStore();
  const { toast } = useToast();
  
  const [showMemoryForm, setShowMemoryForm] = useState(false);
  const [memoryText, setMemoryText] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [isCandleLit, setIsCandleLit] = useState(false);

  const member = id ? family[id] : null;

  if (!member) {
    return <div className="p-8 text-center">Профиль не найден</div>;
  }

  const handleLightCandle = () => {
    if (isCandleLit || !id) return;
    lightCandle(id);
    setIsCandleLit(true);
    toast({
      title: "Свеча зажжена",
      description: "Светлая память",
    });
  };

  const handleLeaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memoryText || !visitorName) return;
    
    toast({
      title: "Воспоминание отправлено",
      description: "Оно появится на странице после проверки",
    });
    setShowMemoryForm(false);
    setMemoryText("");
    setVisitorName("");
  };

  return (
    <div className="h-full w-full bg-[#fcfaf5] overflow-y-auto pb-10 flex flex-col items-center">
      {/* Minimal Header */}
      <div className="w-full h-14 flex items-center px-4">
        <Link href="/login" className="text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors text-sm">
          <ArrowLeft size={16} /> На главную
        </Link>
      </div>

      <div className="w-full max-w-sm px-5 flex flex-col items-center text-center mt-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl mb-6 relative"
        >
          <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-full" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-serif text-3xl font-semibold text-[#3d261d] mb-1"
        >
          {member.name}
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-2 mb-8"
        >
          <p className="text-[#3d261d]/70 font-medium tracking-widest text-sm">
            {member.birthYear} — {member.deathYear}
          </p>
          <p className="text-[#3d261d]/60 text-sm font-serif italic max-w-[250px]">
            {member.profession}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full flex gap-3 mb-10"
        >
          <Button 
            className={`flex-1 h-12 rounded-xl transition-all duration-500 shadow-md flex items-center justify-center gap-2 ${
              isCandleLit 
                ? "bg-amber-100 text-amber-800 border border-amber-200" 
                : "bg-gradient-to-r from-amber-500 to-amber-400 text-white hover:from-amber-600 hover:to-amber-500"
            }`}
            onClick={handleLightCandle}
            disabled={isCandleLit}
          >
            <div className="relative w-4 h-4 flex items-center justify-center">
              <div className={`absolute w-1.5 h-1.5 bg-amber-200 rounded-full blur-[1px] transition-opacity duration-500 ${isCandleLit ? 'opacity-100' : 'opacity-0'}`} />
              <Heart size={18} className={isCandleLit ? "fill-amber-600 text-amber-600" : ""} />
            </div>
            {isCandleLit ? "Зажжена" : "Зажечь свечу"}
            {member.candlesLit !== undefined && (
              <span className="ml-1 opacity-70">({member.candlesLit + (isCandleLit ? 1 : 0)})</span>
            )}
          </Button>

          <Button 
            variant="outline"
            className="flex-1 h-12 rounded-xl border-[#3d261d]/20 text-[#3d261d] bg-transparent hover:bg-[#3d261d]/5"
            onClick={() => setShowMemoryForm(true)}
          >
            Воспоминание
          </Button>
        </motion.div>

        <AnimatePresence>
          {showMemoryForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleLeaveMemory}
              className="w-full bg-white rounded-2xl p-5 shadow-sm border border-[#3d261d]/10 mb-8 space-y-4 text-left overflow-hidden"
            >
              <h3 className="font-serif text-lg font-semibold text-[#3d261d]">Оставить воспоминание</h3>
              <div className="space-y-2">
                <Label htmlFor="visitorName" className="text-xs text-muted-foreground">Ваше имя</Label>
                <Input 
                  id="visitorName" 
                  value={visitorName} 
                  onChange={e => setVisitorName(e.target.value)} 
                  className="bg-[#fcfaf5] border-[#3d261d]/10" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="memoryText" className="text-xs text-muted-foreground">Текст</Label>
                <Textarea 
                  id="memoryText" 
                  value={memoryText} 
                  onChange={e => setMemoryText(e.target.value)} 
                  className="bg-[#fcfaf5] border-[#3d261d]/10 resize-none min-h-[80px]" 
                />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowMemoryForm(false)}>
                  Отмена
                </Button>
                <Button type="submit" className="flex-1 bg-[#3d261d] text-white">
                  Отправить
                </Button>
              </div>
              <p className="text-[10px] text-center text-muted-foreground">Будет опубликовано после проверки семьей</p>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Content Sections */}
        <div className="w-full space-y-10 text-left">
          {member.bio && (
            <section className="space-y-3">
              <h2 className="font-serif text-xl font-semibold text-[#3d261d] border-b border-[#3d261d]/10 pb-2">
                Жизненный путь
              </h2>
              <p className="text-[#3d261d]/80 text-sm leading-relaxed whitespace-pre-wrap">
                {member.bio}
              </p>
            </section>
          )}

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-[#3d261d] border-b border-[#3d261d]/10 pb-2">
              Фотографии
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <div className="aspect-square bg-muted rounded-xl overflow-hidden shadow-sm">
                <img src={member.avatar} alt="Gallery 1" className="w-full h-full object-cover grayscale-[20%]" />
              </div>
              <div className="aspect-square bg-muted rounded-xl overflow-hidden shadow-sm">
                <img src="/images/intro1.png" alt="Gallery 2" className="w-full h-full object-cover grayscale-[20%]" />
              </div>
            </div>
          </section>

          {member.timeline && member.timeline.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-serif text-xl font-semibold text-[#3d261d] border-b border-[#3d261d]/10 pb-2">
                Временная шкала
              </h2>
              <div className="relative border-l border-[#3d261d]/20 ml-2 space-y-6 pb-2">
                {member.timeline.map((event, i) => (
                  <div key={i} className="relative pl-5">
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border border-[#3d261d]/40" />
                    <p className="text-xs font-bold text-[#3d261d]/60 mb-0.5">{event.year}</p>
                    <p className="text-sm text-[#3d261d]/90 leading-snug">{event.event}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      
      <div className="mt-16 mb-8 opacity-50 flex flex-col items-center gap-1">
        <div className="w-6 h-6 rounded-md bg-[#3d261d]/10 flex items-center justify-center">
          <Leaf size={14} className="text-[#3d261d]" />
        </div>
        <p className="text-[10px] text-[#3d261d]">Создано в «Память» — pamyat.ru</p>
      </div>
    </div>
  );
}

function Leaf({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}
