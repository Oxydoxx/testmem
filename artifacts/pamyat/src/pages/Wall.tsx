import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Heart, MessageCircle, Image as ImageIcon, Quote, Video, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const filters = [
  { id: "all", label: "Всё", icon: null },
  { id: "photo", label: "Фото", icon: ImageIcon },
  { id: "quote", label: "Цитаты", icon: Quote },
  { id: "video", label: "Видео", icon: Video },
];

export default function Wall() {
  const { wallItems, family } = useAppStore();
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();

  const allPhotos = Object.values(family).map((m) => ({
    id: `auto-${m.id}`,
    type: "photo" as const,
    authorId: m.id,
    mediaUrl: m.avatar,
    date: "Архив",
    tags: [m.relation],
    content: m.name,
  }));

  const quotes = [
    { id: "q1", type: "quote" as const, authorId: "2", content: "«Дом — это не место, а люди, которых ты любишь»", date: "Из писем", tags: ["Цитаты"] },
    { id: "q2", type: "quote" as const, authorId: "3", content: "«Книга — лучший друг, который никогда не предаст»", date: "Из дневника", tags: ["Цитаты"] },
  ];

  const items = [...wallItems, ...quotes, ...allPhotos];
  const filtered = filter === "all" ? items : items.filter((i) => i.type === filter);

  const handleAdd = () => {
    toast({
      title: "Скоро",
      description: "Добавление новых записей появится в следующем обновлении.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full w-full bg-background overflow-y-auto"
    >
      <div className="px-5 pt-8 pb-4 sticky top-0 z-10 bg-background/90 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-foreground">Стена памяти</h1>
            <p className="text-sm text-muted-foreground mt-1">Фотографии, цитаты и моменты</p>
          </div>
          <Button
            onClick={handleAdd}
            size="icon"
            className="rounded-full h-11 w-11 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30"
          >
            <Plus size={20} />
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-2">
          {filters.map((f) => {
            const Icon = f.icon;
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`shrink-0 flex items-center gap-1.5 px-4 h-9 rounded-full text-sm font-medium transition-all ${
                  active
                    ? "bg-foreground text-background"
                    : "bg-card text-muted-foreground border border-border hover:text-foreground"
                }`}
              >
                {Icon && <Icon size={14} />}
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-5 pb-28">
        <div className="columns-2 gap-3 [column-fill:_balance]">
          {filtered.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.4 }}
              className="mb-3 break-inside-avoid"
            >
              <WallCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function WallCard({ item }: { item: any }) {
  const { family } = useAppStore();
  const author = family[item.authorId];
  const [liked, setLiked] = useState(false);

  if (item.type === "photo") {
    return (
      <Card className="overflow-hidden border-card-border shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
        <div className="relative">
          <img src={item.mediaUrl} alt="" className="w-full object-cover aspect-[3/4]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs font-medium drop-shadow">{item.content || author?.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLiked(!liked);
              }}
              className="p-1"
            >
              <Heart size={16} className={liked ? "fill-red-400 text-red-400" : "text-white"} />
            </button>
          </div>
        </div>
      </Card>
    );
  }

  if (item.type === "quote") {
    return (
      <Card className="p-4 bg-gradient-to-br from-primary/10 to-amber-100/30 border-primary/20 shadow-sm">
        <Quote className="text-primary/40 mb-2" size={20} />
        <p className="text-sm font-serif italic text-foreground leading-relaxed">{item.content}</p>
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-primary/10">
          {author && <img src={author.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{author?.name}</p>
            <p className="text-[10px] text-muted-foreground">{item.date}</p>
          </div>
        </div>
      </Card>
    );
  }

  return null;
}
