import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronLeft, QrCode, Lock, Settings as SettingsIcon,
  Image as ImageIcon, History, Download, X,
} from "lucide-react";
import QRCode from "qrcode";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import MemberFormModal from "@/components/MemberFormModal";

// ─── QR Template: Simple ─────────────────────────────────────────────────────
function QrSimple({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement | null> }) {
  return (
    <div className="bg-background p-4 rounded-2xl shadow-sm border border-border my-2 flex flex-col items-center">
      <canvas ref={canvasRef} className="rounded-xl" />
      <p className="text-[10px] text-muted-foreground mt-2">Отсканируйте QR-код</p>
    </div>
  );
}

// ─── QR Template: Branded ─────────────────────────────────────────────────────
function QrBranded({
  member,
  qrDataUrl,
}: { member: ReturnType<typeof useAppStore>["family"][string]; qrDataUrl: string }) {
  return (
    <div
      id="qr-branded"
      className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 border border-amber-200 p-4 my-2"
    >
      {/* Background ornament */}
      <div className="absolute -top-8 -right-8 w-28 h-28 bg-amber-200/30 rounded-full blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-rose-200/30 rounded-full blur-2xl" />

      <div className="relative flex flex-col items-center gap-3">
        {/* Photo */}
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-amber-300/40">
          <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
        </div>

        {/* Name & dates */}
        <div className="text-center">
          <h3 className="font-serif text-base font-bold text-foreground leading-tight">{member.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {member.birthDate ?? member.birthYear}
            {member.isDeceased && (member.deathDate ?? member.deathYear)
              ? ` — ${member.deathDate ?? member.deathYear}`
              : ""}
          </p>
          {member.profession && (
            <p className="text-[11px] font-medium text-amber-700 mt-0.5">{member.profession}</p>
          )}
        </div>

        {/* Description */}
        {member.bio && (
          <p className="text-[11px] text-foreground/70 text-center leading-relaxed max-w-[220px] line-clamp-3">
            {member.bio}
          </p>
        )}

        {/* QR */}
        {qrDataUrl && (
          <div className="bg-white rounded-xl p-2 shadow-sm border border-amber-100">
            <img src={qrDataUrl} alt="QR" className="w-[100px] h-[100px]" />
          </div>
        )}

        {/* Label */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full">
            <span className="text-[10px] font-bold text-white tracking-wide">ПАМЯТЬ</span>
          </div>
          <p className="text-[9px] text-muted-foreground">pamyat.ru · цифровая память семьи</p>
        </div>
      </div>
    </div>
  );
}

// ─── QR Modal ────────────────────────────────────────────────────────────────
function QrModal({
  member, onClose,
}: { member: NonNullable<ReturnType<typeof useAppStore>["family"][string]>; onClose: () => void }) {
  const { toast } = useToast();
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const [template, setTemplate] = useState<"simple" | "branded">("simple");
  const [qrDataUrl, setQrDataUrl] = useState("");

  const url = `${window.location.origin}/memorial/${member.id}`;

  useEffect(() => {
    QRCode.toCanvas(qrCanvasRef.current!, url, {
      width: 200, margin: 2,
      color: { dark: "#3d261d", light: "#FFFBF2" },
    }).catch(() => {});

    QRCode.toDataURL(url, {
      width: 200, margin: 2,
      color: { dark: "#3d261d", light: "#FFFBF2" },
    }).then(setQrDataUrl).catch(() => {});
  }, [url]);

  const handleDownload = useCallback(async () => {
    try {
      if (template === "simple" && qrCanvasRef.current) {
        const a = document.createElement("a");
        a.href = qrCanvasRef.current.toDataURL("image/png");
        a.download = `qr-${member.name.replace(/\s+/g, "-")}.png`;
        a.click();
      } else {
        const el = document.getElementById("qr-branded");
        if (!el) return;
        const html2canvas = (await import("html2canvas")).default;
        const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: null });
        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = `qr-branded-${member.name.replace(/\s+/g, "-")}.png`;
        a.click();
      }
      toast({ title: "QR-код сохранён" });
    } catch {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    }
  }, [template, member, toast]);

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[340px] rounded-3xl p-0 overflow-hidden bg-card border-card-border">
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border/50">
          <DialogTitle className="font-serif text-xl text-center">QR-код профиля</DialogTitle>
        </DialogHeader>

        {/* Template tabs */}
        <div className="flex mx-5 mt-4 gap-2">
          {(["simple", "branded"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTemplate(t)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                template === t
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-muted-foreground"
              }`}
            >
              {t === "simple" ? "Простой QR" : "С оформлением"}
            </button>
          ))}
        </div>

        <div className="px-5 pb-2">
          <AnimatePresence mode="wait">
            {template === "simple" ? (
              <motion.div key="simple" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <QrSimple canvasRef={qrCanvasRef} />
                <p className="text-xs text-muted-foreground text-center pb-2">
                  Разместите на надгробии или в рамке — при сканировании откроется страница памяти
                </p>
              </motion.div>
            ) : (
              <motion.div key="branded" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <QrBranded member={member} qrDataUrl={qrDataUrl} />
                <p className="text-xs text-muted-foreground text-center pb-2">
                  Красивая карточка с фото, описанием и QR-кодом для скачивания
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-5 pb-5 flex gap-3">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose}>
            Закрыть
          </Button>
          <Button className="flex-1 rounded-xl gap-2" onClick={handleDownload}>
            <Download size={14} />
            Скачать
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────
export default function Profile() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { family, currentUser, lightCandle } = useAppStore();
  const { toast } = useToast();

  const [showQR, setShowQR] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const member = id ? family[id] : null;
  const isMe = member?.id === currentUser?.id;

  if (!member) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Профиль не найден
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-background overflow-y-auto pb-10">
      {/* Header Actions */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-b from-background/90 to-transparent z-10 flex items-center justify-between px-4">
        <Button
          variant="ghost" size="icon"
          onClick={() => window.history.back()}
          className="bg-background/60 backdrop-blur-md rounded-full shadow-sm"
        >
          <ChevronLeft size={24} />
        </Button>
        {isMe && (
          <Button
            variant="ghost" size="icon"
            className="bg-background/60 backdrop-blur-md rounded-full shadow-sm"
            onClick={() => setShowEdit(true)}
          >
            <SettingsIcon size={20} />
          </Button>
        )}
      </div>

      {/* Hero */}
      <div className="relative w-full aspect-square bg-muted flex items-center justify-center overflow-hidden">
        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground drop-shadow-md">{member.name}</h1>
          <p className="text-foreground/80 font-medium text-sm mt-1 drop-shadow">
            {member.birthDate ?? member.birthYear}
            {member.isDeceased
              ? ` — ${member.deathDate ?? member.deathYear ?? "?"}`
              : " — настоящее время"}
          </p>
          {member.profession && (
            <p className="text-foreground/90 text-sm mt-1 font-serif italic drop-shadow">
              {member.profession}
            </p>
          )}
        </div>
      </div>

      <div className="px-5 space-y-6 mt-4">
        {/* Actions */}
        <div className="flex gap-3">
          <Button
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md rounded-xl"
            onClick={() => setShowQR(true)}
          >
            <QrCode size={18} className="mr-2" />
            QR-код
          </Button>
          {!isMe && member.isDeceased && (
            <Button
              variant="outline"
              className="flex-1 bg-card border-card-border shadow-sm rounded-xl"
              onClick={() => {
                lightCandle(member.id);
                toast({ title: "Свеча зажжена", description: "Светлая память" });
              }}
            >
              Зажечь свечу {member.candlesLit ? `· ${member.candlesLit}` : ""}
            </Button>
          )}
          {isMe && (
            <Button
              variant="outline"
              className="flex-1 bg-card border-card-border shadow-sm rounded-xl"
              onClick={() => setShowEdit(true)}
            >
              <SettingsIcon size={16} className="mr-2" />
              Изменить
            </Button>
          )}
        </div>

        {/* Bio */}
        {member.bio && (
          <section className="space-y-2">
            <h2 className="font-serif text-xl font-semibold text-foreground">Биография</h2>
            <p className="text-foreground/80 text-sm leading-relaxed">{member.bio}</p>
          </section>
        )}

        {/* Gallery */}
        <section className="space-y-3">
          <div className="flex justify-between items-end">
            <h2 className="font-serif text-xl font-semibold text-foreground flex items-center gap-2">
              <ImageIcon size={20} className="text-primary" />
              Галерея
            </h2>
            <span className="text-primary text-sm font-medium">Все</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="aspect-square bg-muted rounded-xl overflow-hidden">
              <img src={member.avatar} alt="Gallery 1" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square bg-muted rounded-xl overflow-hidden opacity-80">
              <img src="/images/intro1.png" alt="Gallery 2" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square bg-muted rounded-xl overflow-hidden opacity-80">
              <img src="/images/intro3.png" alt="Gallery 3" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* Timeline */}
        {member.timeline && member.timeline.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <History size={20} className="text-primary" />
              <h2 className="font-serif text-xl font-semibold text-foreground">Временная шкала</h2>
            </div>
            <div className="relative border-l-2 border-primary/20 ml-3 space-y-6 pb-2">
              {member.timeline.map((event, i) => (
                <div key={i} className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-background border-2 border-primary" />
                  <p className="text-sm font-bold text-primary">{event.year}</p>
                  <p className="text-sm text-foreground/90 mt-0.5">{event.event}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Time capsule */}
        <Card className="bg-gradient-to-br from-secondary to-background border-border shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Lock size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Капсула времени</h3>
              <p className="text-xs text-muted-foreground mt-1">Откроется 15 марта 2045 года</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QR Modal */}
      {showQR && <QrModal member={member} onClose={() => setShowQR(false)} />}

      {/* Edit Modal */}
      <MemberFormModal
        open={showEdit}
        member={member}
        onClose={() => setShowEdit(false)}
      />
    </div>
  );
}
