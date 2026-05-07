import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageSquare, Plus, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Stories() {
  const { stories, likeStory, addStory, currentUser } = useAppStore();
  const [filter, setFilter] = useState("Все");
  const { toast } = useToast();

  const filters = ["Все", "Воспоминания", "Фото", "Достижения"];

  return (
    <div className="h-full w-full bg-background overflow-y-auto px-5 py-8 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-2xl font-semibold text-foreground">Истории</h1>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 -mx-5 px-5 snap-x hide-scrollbar mb-4">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "bg-card border border-card-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {stories.map((story, i) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-card border-card-border overflow-hidden shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-background shadow-sm">
                    <img src={story.authorAvatar} alt={story.authorName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{story.authorName}</p>
                    <p className="text-xs text-muted-foreground">{story.date}</p>
                  </div>
                </div>
                
                <p className="text-foreground/90 text-sm leading-relaxed mb-4">
                  {story.content}
                </p>

                <div className="flex items-center gap-4 text-muted-foreground border-t border-border/50 pt-3">
                  <button 
                    onClick={() => likeStory(story.id)}
                    className="flex items-center gap-1.5 hover:text-red-500 transition-colors"
                  >
                    <Heart size={18} className={story.likes > 0 ? "fill-red-500 text-red-500" : ""} />
                    <span className="text-xs font-medium">{story.likes > 0 ? story.likes : 'Нравится'}</span>
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <MessageSquare size={18} />
                    <span className="text-xs font-medium">{story.comments > 0 ? story.comments : 'Комментировать'}</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Button
        className="fixed bottom-20 right-6 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30"
        onClick={() => {
          toast({ title: "Добавление истории", description: "Функция в разработке" });
        }}
      >
        <Plus size={24} />
      </Button>
    </div>
  );
}
