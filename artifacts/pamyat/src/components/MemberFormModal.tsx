import { useState, useEffect } from "react";
import { useAppStore, type FamilyMember } from "@/store/useAppStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const RELATIONS = [
  "Я", "Супруг(а)", "Отец", "Мать", "Сын", "Дочь",
  "Дедушка", "Бабушка", "Внук", "Внучка",
  "Брат", "Сестра", "Дядя", "Тётя", "Племянник", "Племянница",
  "Прадедушка", "Прабабушка", "Другое",
];

const AVATARS = [
  "/images/anna.png", "/images/ivan.png", "/images/maria.png",
  "/images/elena.png", "/images/dmitry.png",
];

interface Props {
  open: boolean;
  onClose: () => void;
  member?: FamilyMember | null;
  onAddToTree?: (memberId: string) => void;
}

export default function MemberFormModal({ open, onClose, member, onAddToTree }: Props) {
  const { addFamilyMember, updateFamilyMember } = useAppStore();
  const { toast } = useToast();
  const isEdit = !!member;

  const blank = (): Partial<FamilyMember> => ({
    name: "",
    birthYear: "",
    birthDate: "",
    deathYear: "",
    deathDate: "",
    relation: "Другое",
    profession: "",
    bio: "",
    avatar: AVATARS[0],
    isDeceased: false,
    privacy: { bio: true, profession: true, hobbies: true, places: true, gallery: true, timeline: true },
  });

  const [form, setForm] = useState<Partial<FamilyMember>>(blank());

  useEffect(() => {
    if (open) {
      setForm(member ? { ...member } : blank());
    }
  }, [open, member]);

  const set = (field: keyof FamilyMember, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    if (!form.name?.trim()) {
      toast({ title: "Введите имя", variant: "destructive" });
      return;
    }
    if (isEdit && member) {
      updateFamilyMember(member.id, form);
      toast({ title: "Данные сохранены" });
    } else {
      const newId = `m${Date.now()}`;
      const newMember: FamilyMember = {
        id: newId,
        name: form.name!,
        birthYear: form.birthYear || "",
        birthDate: form.birthDate,
        deathYear: form.isDeceased ? form.deathYear : undefined,
        deathDate: form.isDeceased ? form.deathDate : undefined,
        relation: form.relation || "Другое",
        avatar: form.avatar || AVATARS[0],
        profession: form.profession,
        bio: form.bio,
        isDeceased: !!form.isDeceased,
        privacy: { bio: true, profession: true, hobbies: true, places: true, gallery: true, timeline: true },
      };
      addFamilyMember(newMember);
      if (onAddToTree) onAddToTree(newId);
      toast({ title: "Родственник добавлен" });
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[380px] rounded-3xl p-0 overflow-hidden bg-card border-card-border">
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border/50">
          <DialogTitle className="font-serif text-xl">
            {isEdit ? "Редактировать карточку" : "Добавить родственника"}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[70vh] px-5 py-4 space-y-4">
          {/* Avatar picker */}
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Фото</Label>
            <div className="flex gap-2 flex-wrap">
              {AVATARS.map((av) => (
                <button
                  key={av}
                  onClick={() => set("avatar", av)}
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                    form.avatar === av ? "border-primary scale-110" : "border-border"
                  }`}
                >
                  <img src={av} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1">
            <Label htmlFor="name" className="text-xs text-muted-foreground">Имя и фамилия *</Label>
            <Input
              id="name"
              value={form.name || ""}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Иван Иванович Иванов"
              className="rounded-xl"
            />
          </div>

          {/* Relation */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Степень родства</Label>
            <div className="flex flex-wrap gap-1.5">
              {RELATIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => set("relation", r)}
                  className={`px-2.5 py-1 rounded-full text-xs border transition-all ${
                    form.relation === r
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border text-foreground hover:border-primary/50"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Birth date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Год рождения</Label>
              <Input
                value={form.birthYear || ""}
                onChange={(e) => set("birthYear", e.target.value)}
                placeholder="1985"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Дата рождения</Label>
              <Input
                value={form.birthDate || ""}
                onChange={(e) => set("birthDate", e.target.value)}
                placeholder="дд.мм.гггг"
                className="rounded-xl"
              />
            </div>
          </div>

          {/* Deceased toggle */}
          <div className="flex items-center justify-between py-2 border-t border-border/50">
            <div>
              <p className="text-sm font-medium text-foreground">Ушёл из жизни</p>
              <p className="text-xs text-muted-foreground">Отметить как умершего</p>
            </div>
            <Switch
              checked={!!form.isDeceased}
              onCheckedChange={(v) => set("isDeceased", v)}
            />
          </div>

          {/* Death date (if deceased) */}
          {form.isDeceased && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Год смерти</Label>
                <Input
                  value={form.deathYear || ""}
                  onChange={(e) => set("deathYear", e.target.value)}
                  placeholder="2020"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Дата смерти</Label>
                <Input
                  value={form.deathDate || ""}
                  onChange={(e) => set("deathDate", e.target.value)}
                  placeholder="дд.мм.гггг"
                  className="rounded-xl"
                />
              </div>
            </div>
          )}

          {/* Profession */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Профессия</Label>
            <Input
              value={form.profession || ""}
              onChange={(e) => set("profession", e.target.value)}
              placeholder="Инженер, врач, учитель…"
              className="rounded-xl"
            />
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Биография</Label>
            <Textarea
              value={form.bio || ""}
              onChange={(e) => set("bio", e.target.value)}
              placeholder="Несколько слов об этом человеке…"
              className="rounded-xl resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="px-5 py-4 border-t border-border/50 flex gap-3">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose}>
            Отмена
          </Button>
          <Button className="flex-1 rounded-xl bg-primary text-primary-foreground" onClick={handleSubmit}>
            {isEdit ? "Сохранить" : "Добавить"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
