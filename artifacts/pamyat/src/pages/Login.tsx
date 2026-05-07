import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      login();
      setLocation("/dashboard");
    }, 900);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-sm">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M12 21a9 9 0 0 0 9-9c0-5-4-9-9-9s-9 4-9 9a9 9 0 0 0 9 9z" />
              <path d="M12 7v5l3 3" />
            </svg>
          </div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground mb-3">
            Память
          </h1>
          <p className="text-muted-foreground text-base px-4">
            Сохраните историю вашей семьи для будущих поколений
          </p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          onSubmit={handleLogin} 
          className="space-y-5 bg-card/50 backdrop-blur-xl p-6 rounded-3xl border border-card-border shadow-lg"
        >
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium text-muted-foreground ml-1">Email</Label>
            <Input 
              id="email" 
              type="email" 
              defaultValue="anna.ivanova@pamyat.ru"
              className="h-12 rounded-xl bg-background/50 border-input focus:ring-primary/20 text-base"
              required 
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-medium text-muted-foreground ml-1">Пароль</Label>
            <Input 
              id="password" 
              type="password" 
              defaultValue="demo1234"
              className="h-12 rounded-xl bg-background/50 border-input focus:ring-primary/20 text-base"
              required 
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base shadow-md shadow-primary/20 transition-all active:scale-[0.98] mt-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Войти"
            )}
          </Button>
        </motion.form>
      </div>
    </div>
  );
}
