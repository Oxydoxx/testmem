import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { ChevronRight, Heart, BookOpen, Trees, QrCode, Lock, Users, Calendar } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Сохраните память поколений",
    description: "Наши корни — это наша опора. Создайте цифровое наследие вашей семьи, чтобы передать его будущим поколениям.",
    image: "/images/intro1.png",
  },
  {
    id: 2,
    title: "Все возможности «Памяти»",
    description: "Один сервис для всей семейной истории",
    image: "/images/intro2.png",
    features: [
      { icon: Users, text: "Цифровой профиль" },
      { icon: Trees, text: "Семейное древо" },
      { icon: QrCode, text: "QR-код для надгробия" },
      { icon: Lock, text: "Капсула времени" },
      { icon: BookOpen, text: "Семейные истории" },
      { icon: Calendar, text: "Важные даты" }
    ]
  },
  {
    id: 3,
    title: "Соберите семью вместе",
    description: "Пригласите близких, чтобы вместе пополнять семейный архив и вспоминать важные моменты.",
    image: "/images/intro3.png",
  }
];

export default function Intro() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [, setLocation] = useLocation();
  const { setHasSeenIntro } = useAppStore();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(s => s + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setHasSeenIntro(true);
    setLocation("/login");
  };

  return (
    <div className="h-full w-full bg-background flex flex-col relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex-1 flex flex-col items-center pt-12 pb-32"
        >
          <div className="w-full px-6 flex-1 flex flex-col items-center justify-center">
            <div className="w-full aspect-[3/4] max-h-[50vh] relative mb-8 rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={slides[currentSlide].image} 
                alt="Illustration" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            </div>

            <h2 className="font-serif text-3xl font-semibold text-center mb-4 text-foreground">
              {slides[currentSlide].title}
            </h2>
            <p className="text-center text-muted-foreground mb-8 text-base">
              {slides[currentSlide].description}
            </p>

            {slides[currentSlide].features && (
              <div className="grid grid-cols-2 gap-3 w-full mb-6">
                {slides[currentSlide].features.map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <div key={i} className="flex items-center gap-2 bg-card p-3 rounded-xl border border-border shadow-sm">
                      <Icon size={18} className="text-primary" />
                      <span className="text-xs font-medium">{feature.text}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent z-10 flex flex-col gap-6">
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <div 
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide ? "w-8 bg-primary" : "w-2 bg-primary/20"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            className="flex-1 text-muted-foreground hover:text-foreground"
            onClick={handleComplete}
          >
            Пропустить
          </Button>
          <Button 
            onClick={handleNext}
            className="flex-[2] h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base shadow-md shadow-primary/20"
          >
            {currentSlide === slides.length - 1 ? "Начать" : "Далее"}
            <ChevronRight size={20} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
