import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, UserPlus, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Relatives() {
  const { toast } = useToast();
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Simulate network request
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
    }, 1500);
  };

  const handleConnect = (name: string) => {
    toast({
      title: "Запрос отправлен",
      description: `Запрос на подключение к древу отправлен ${name}`,
    });
  };

  const mockResults = [
    {
      id: 1,
      name: "Михаил Иванов",
      match: "Иванов",
      region: "Москва",
      avatar: "/images/dmitry.png", // reusing existing mock avatar
      commonAncestors: 2,
    },
    {
      id: 2,
      name: "Светлана Иванова",
      match: "Иванова",
      region: "Санкт-Петербург",
      avatar: "/images/elena.png", // reusing
      commonAncestors: 1,
    }
  ];

  return (
    <div className="h-full w-full bg-background overflow-y-auto px-5 py-8 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-2xl font-semibold text-foreground">Поиск родственников</h1>
      </div>

      <Card className="bg-card border-card-border shadow-sm mb-8">
        <CardContent className="p-5">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="surname" className="text-xs text-muted-foreground ml-1">Фамилия</Label>
              <Input 
                id="surname" 
                defaultValue="Иванов"
                className="h-12 bg-background/50 border-input focus:ring-primary/20" 
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="region" className="text-xs text-muted-foreground ml-1">Регион (опционально)</Label>
                <Input 
                  id="region" 
                  placeholder="Москва"
                  className="h-12 bg-background/50 border-input focus:ring-primary/20" 
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="year" className="text-xs text-muted-foreground ml-1">Год рождения</Label>
                <Input 
                  id="year" 
                  placeholder="1932"
                  className="h-12 bg-background/50 border-input focus:ring-primary/20" 
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md mt-2"
              disabled={isSearching}
            >
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Search size={18} className="mr-2" />
                  Найти связи
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {hasSearched && !isSearching && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1">
            Возможные совпадения (2)
          </h2>
          
          <div className="space-y-3">
            {mockResults.map(result => (
              <Card key={result.id} className="bg-card border-card-border overflow-hidden shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-background shadow-sm">
                      <img src={result.avatar} alt={result.name} className="w-full h-full object-cover grayscale-[20%]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground text-sm">
                        {result.name.split(' ')[0]} <span className="bg-primary/20 text-primary px-1 rounded">{result.match}</span>
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{result.region}</p>
                      <div className="flex items-center gap-1 mt-1.5 text-xs text-amber-600 font-medium">
                        <Users size={12} />
                        Возможное родство ({result.commonAncestors} совпадений в древе)
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button 
                      className="flex-1 h-10 bg-primary/10 hover:bg-primary/20 text-primary border-0"
                      variant="outline"
                      onClick={() => handleConnect(result.name)}
                    >
                      <UserPlus size={16} className="mr-2" />
                      Отправить запрос
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Initial empty state */}
      {!hasSearched && !isSearching && (
        <div className="flex flex-col items-center justify-center text-center p-8 text-muted-foreground opacity-60 mt-10">
          <Search size={48} className="mb-4 stroke-1" />
          <p className="text-sm">Введите данные родственника, чтобы найти возможные пересечения в семейных древах.</p>
        </div>
      )}
    </div>
  );
}
