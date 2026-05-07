import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore, type FamilyMember, type TreeConnection } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import {
  Plus, ZoomIn, ZoomOut, Layers, FileDown, Pencil,
  Link2, Trash2, UserPlus, X, Download, RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MemberFormModal from "@/components/MemberFormModal";

// ─── Constants ────────────────────────────────────────────────────────────────
const BLOCK_W = 120;
const BLOCK_H = 132;
const SNAP = 20;
const CANVAS_W = 1200;
const CANVAS_H = 1400;
const LONG_PRESS_MS = 550;

const BACKGROUNDS: Record<string, { cls: string; night: boolean }> = {
  "Пергамент": {
    cls: "bg-[#FDFBF7] [background-image:radial-gradient(#E8E1D5_1px,transparent_1px)] [background-size:20px_20px]",
    night: false,
  },
  "Светлое дерево": {
    cls: "bg-[#F5F0E6] [background-image:linear-gradient(to_right,rgba(120,100,80,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,100,80,0.08)_1px,transparent_1px)] [background-size:40px_40px]",
    night: false,
  },
  "Градиент": { cls: "bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50", night: false },
  "Ночной": { cls: "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800", night: true },
};

const CONN_LABELS = ["Родитель", "Ребёнок", "Супруги", "Брат/Сестра", "Другое"];

// ─── Context Menu ─────────────────────────────────────────────────────────────
interface CtxMenu { blockId: string; x: number; y: number }

function TreeContextMenu({
  menu, onEdit, onAddConn, onManageConn, onDelete, onClose,
}: {
  menu: CtxMenu;
  onEdit: () => void;
  onAddConn: () => void;
  onManageConn: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const items = [
    { icon: Pencil, label: "Редактировать карточку", action: onEdit, color: "text-foreground" },
    { icon: Link2, label: "Добавить связь", action: onAddConn, color: "text-blue-600" },
    { icon: RotateCcw, label: "Управление связями", action: onManageConn, color: "text-amber-600" },
    { icon: Trash2, label: "Удалить из древа", action: onDelete, color: "text-red-500" },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.12 }}
        style={{ position: "fixed", left: menu.x, top: menu.y, zIndex: 50 }}
        className="bg-card border border-border rounded-2xl shadow-2xl p-1.5 min-w-[200px]"
      >
        {items.map((item, i) => {
          const Icon = item.icon;
          const showSep = i === 2;
          return (
            <div key={item.label}>
              {showSep && <div className="my-1 border-t border-border/60" />}
              <button
                onClick={() => { item.action(); onClose(); }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-accent transition-colors text-left",
                  item.color
                )}
              >
                <Icon size={15} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            </div>
          );
        })}
      </motion.div>
    </>
  );
}

// ─── Add Connection Modal ─────────────────────────────────────────────────────
function AddConnectionModal({
  fromBlockId,
  onClose,
}: { fromBlockId: string; onClose: () => void }) {
  const { treeBlocks, family, addConnection, treeConnections } = useAppStore();
  const { toast } = useToast();
  const [toBlockId, setToBlockId] = useState("");
  const [label, setLabel] = useState("Родитель");

  const available = treeBlocks.filter((b) => {
    if (b.id === fromBlockId) return false;
    const alreadyConnected = treeConnections.some(
      (c) =>
        (c.fromId === fromBlockId && c.toId === b.id) ||
        (c.fromId === b.id && c.toId === fromBlockId)
    );
    return !alreadyConnected;
  });

  const handleAdd = () => {
    if (!toBlockId) { toast({ title: "Выберите родственника", variant: "destructive" }); return; }
    addConnection({ id: `c${Date.now()}`, fromId: fromBlockId, toId: toBlockId, label });
    toast({ title: "Связь добавлена" });
    onClose();
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[340px] rounded-3xl bg-card border-card-border">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Добавить связь</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">С кем связать</p>
            <Select value={toBlockId} onValueChange={setToBlockId}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Выберите родственника" />
              </SelectTrigger>
              <SelectContent>
                {available.map((b) => {
                  const m = family[b.memberId];
                  return m ? (
                    <SelectItem key={b.id} value={b.id}>
                      {m.name}
                    </SelectItem>
                  ) : null;
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Тип связи</p>
            <div className="flex flex-wrap gap-1.5">
              {CONN_LABELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLabel(l)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs border transition-all",
                    label === l
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:border-primary/50"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose}>
            Отмена
          </Button>
          <Button className="flex-1 rounded-xl" onClick={handleAdd}>
            Добавить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Manage Connections Modal ─────────────────────────────────────────────────
function ManageConnectionsModal({
  blockId, onClose,
}: { blockId: string; onClose: () => void }) {
  const { treeConnections, treeBlocks, family, deleteConnection, updateConnection } = useAppStore();
  const { toast } = useToast();

  const myConns = treeConnections.filter(
    (c) => c.fromId === blockId || c.toId === blockId
  );

  const otherBlock = (conn: TreeConnection) => {
    const otherId = conn.fromId === blockId ? conn.toId : conn.fromId;
    const block = treeBlocks.find((b) => b.id === otherId);
    return block ? family[block.memberId] : null;
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[340px] rounded-3xl bg-card border-card-border">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Управление связями</DialogTitle>
        </DialogHeader>
        {myConns.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Связей нет</p>
        ) : (
          <div className="space-y-2 py-2 max-h-64 overflow-y-auto">
            {myConns.map((conn) => {
              const other = otherBlock(conn);
              return (
                <div
                  key={conn.id}
                  className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl"
                >
                  {other && (
                    <img src={other.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{other?.name}</p>
                    <Select
                      value={conn.label}
                      onValueChange={(v) => {
                        updateConnection(conn.id, { label: v });
                        toast({ title: "Связь обновлена" });
                      }}
                    >
                      <SelectTrigger className="h-6 text-xs border-0 bg-transparent p-0 focus:ring-0 w-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONN_LABELS.map((l) => (
                          <SelectItem key={l} value={l}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <button
                    onClick={() => {
                      deleteConnection(conn.id);
                      toast({ title: "Связь удалена" });
                    }}
                    className="text-red-400 hover:text-red-600 transition-colors p-1"
                  >
                    <X size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <Button variant="outline" className="w-full rounded-xl mt-2" onClick={onClose}>
          Закрыть
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// ─── PDF Export Modal ─────────────────────────────────────────────────────────
const PDF_FORMATS = [
  { label: "A3 (297 × 420 мм)", w: 420, h: 297, key: "A3" },
  { label: "A2 (420 × 594 мм)", w: 594, h: 420, key: "A2" },
  { label: "A1 (594 × 841 мм)", w: 841, h: 594, key: "A1" },
];

function PdfExportModal({
  canvasRef, onClose,
}: { canvasRef: React.RefObject<HTMLDivElement | null>; onClose: () => void }) {
  const { toast } = useToast();
  const [format, setFormat] = useState("A3");
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!canvasRef.current) return;
    setLoading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const fmt = PDF_FORMATS.find((f) => f.key === format)!;
      const canvas = await html2canvas(canvasRef.current, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: "#FDFBF7",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: [fmt.w, fmt.h] });

      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pageW / canvas.width, pageH / canvas.height);
      const imgW = canvas.width * ratio;
      const imgH = canvas.height * ratio;
      const offsetX = (pageW - imgW) / 2;
      const offsetY = (pageH - imgH) / 2;

      pdf.addImage(imgData, "JPEG", offsetX, offsetY, imgW, imgH);
      pdf.save(`pamyat-tree-${fmt.key}.pdf`);
      toast({ title: `PDF ${fmt.key} сохранён` });
      onClose();
    } catch {
      toast({ title: "Ошибка экспорта", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[320px] rounded-3xl bg-card border-card-border">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Сохранить в PDF</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <p className="text-xs text-muted-foreground">Выберите формат листа (альбомная ориентация)</p>
          <div className="space-y-2">
            {PDF_FORMATS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFormat(f.key)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all",
                  format === f.key
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-background border-border hover:border-primary/40"
                )}
              >
                <span>{f.label}</span>
                {format === f.key && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose}>
            Отмена
          </Button>
          <Button
            className="flex-1 rounded-xl"
            onClick={handleExport}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Создаю…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Download size={14} />
                Скачать
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Tree Component ───────────────────────────────────────────────────────
export default function Tree() {
  const {
    family, treeBlocks, treeConnections,
    updateBlockPosition, addTreeBlock, deleteTreeBlock,
    treeBackground, setTreeBackground,
  } = useAppStore();

  const { toast } = useToast();
  const bg = BACKGROUNDS[treeBackground] ?? BACKGROUNDS["Пергамент"];
  const isNight = bg.night;

  const [scale, setScale] = useState(0.7);
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [contextMenu, setContextMenu] = useState<CtxMenu | null>(null);
  const [editMemberId, setEditMemberId] = useState<string | null>(null);
  const [addConnFromBlock, setAddConnFromBlock] = useState<string | null>(null);
  const [manageConnBlock, setManageConnBlock] = useState<string | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);
  const [livePositions, setLivePositions] = useState<Record<string, { x: number; y: number }>>({});

  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    id: string; startX: number; startY: number;
    blockX: number; blockY: number; moved: boolean;
  } | null>(null);
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressBlockRef = useRef<{ blockId: string; x: number; y: number } | null>(null);

  const getPos = (blockId: string) =>
    livePositions[blockId] ?? treeBlocks.find((b) => b.id === blockId) ?? { x: 0, y: 0 };

  // ─── Pointer drag ─────────────────────────────────────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent, blockId: string) => {
    if ((e.target as HTMLElement).closest("a,button")) return;
    e.preventDefault();
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
    const block = treeBlocks.find((b) => b.id === blockId);
    if (!block) return;

    dragRef.current = {
      id: blockId, startX: e.clientX, startY: e.clientY,
      blockX: block.x, blockY: block.y, moved: false,
    };
    setDragging(blockId);

    // Long-press for context menu
    longPressBlockRef.current = { blockId, x: e.clientX, y: e.clientY };
    longPressRef.current = setTimeout(() => {
      if (!dragRef.current?.moved && longPressBlockRef.current) {
        const { blockId: bid, x, y } = longPressBlockRef.current;
        showCtx(bid, x, y);
        dragRef.current = null;
        setDragging(null);
      }
    }, LONG_PRESS_MS);
  }, [treeBlocks]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = (e.clientX - drag.startX) / scale;
    const dy = (e.clientY - drag.startY) / scale;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      drag.moved = true;
      if (longPressRef.current) { clearTimeout(longPressRef.current); longPressRef.current = null; }
    }
    const nx = Math.max(0, Math.min(CANVAS_W - BLOCK_W, drag.blockX + dx));
    const ny = Math.max(0, Math.min(CANVAS_H - BLOCK_H, drag.blockY + dy));
    setLivePositions((prev) => ({ ...prev, [drag.id]: { x: nx, y: ny } }));
  }, [scale]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (longPressRef.current) { clearTimeout(longPressRef.current); longPressRef.current = null; }
    const drag = dragRef.current;
    if (!drag) return;
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
    const live = livePositions[drag.id];
    if (live && drag.moved) {
      const sx = Math.round(live.x / SNAP) * SNAP;
      const sy = Math.round(live.y / SNAP) * SNAP;
      updateBlockPosition(drag.id, sx, sy);
    }
    setLivePositions((prev) => { const c = { ...prev }; delete c[drag.id]; return c; });
    dragRef.current = null;
    setDragging(null);
  }, [livePositions, updateBlockPosition]);

  // ─── Context menu ─────────────────────────────────────────────────────────
  const showCtx = (blockId: string, clientX: number, clientY: number) => {
    const x = Math.min(clientX, window.innerWidth - 220);
    const y = Math.min(clientY, window.innerHeight - 200);
    setContextMenu({ blockId, x, y });
  };

  const onContextMenu = (e: React.MouseEvent, blockId: string) => {
    e.preventDefault();
    e.stopPropagation();
    showCtx(blockId, e.clientX, e.clientY);
  };

  // ─── Add member to tree ────────────────────────────────────────────────────
  const handleAddToTree = (memberId: string) => {
    const occupied = new Set(treeBlocks.map((b) => b.memberId));
    if (occupied.has(memberId)) return;
    const newBlock = {
      id: `b${Date.now()}`,
      memberId,
      x: 100 + Math.random() * 400,
      y: 100 + Math.random() * 300,
    };
    addTreeBlock(newBlock);
  };

  const handleDeleteBlock = (blockId: string) => {
    deleteTreeBlock(blockId);
    toast({ title: "Удалено из древа" });
  };

  // ─── Edit member ──────────────────────────────────────────────────────────
  const editBlock = contextMenu ? treeBlocks.find((b) => b.id === contextMenu.blockId) : null;
  const editMember = editBlock ? family[editBlock.memberId] ?? null : editMemberId ? family[editMemberId] ?? null : null;

  // ─── Connections SVG ──────────────────────────────────────────────────────
  const renderConnections = () => (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={CANVAS_W} height={CANVAS_H}
      viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
    >
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={isNight ? "#fbbf24" : "#f59e0b"} stopOpacity="0.6" />
          <stop offset="100%" stopColor={isNight ? "#fb923c" : "#ea580c"} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {treeConnections.map((conn) => {
        const fb = treeBlocks.find((b) => b.id === conn.fromId);
        const tb = treeBlocks.find((b) => b.id === conn.toId);
        if (!fb || !tb) return null;
        const fp = getPos(fb.id) as { x: number; y: number };
        const tp = getPos(tb.id) as { x: number; y: number };
        const x1 = fp.x + BLOCK_W / 2, y1 = fp.y + BLOCK_H;
        const x2 = tp.x + BLOCK_W / 2, y2 = tp.y;
        const isSpouse = conn.label === "Супруги";
        const midY = (y1 + y2) / 2;
        const path = isSpouse
          ? `M ${fp.x + BLOCK_W} ${fp.y + BLOCK_H / 2} L ${tp.x} ${tp.y + BLOCK_H / 2}`
          : `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
        const mx = isSpouse ? (fp.x + BLOCK_W + tp.x) / 2 : (x1 + x2) / 2;
        const my = isSpouse ? fp.y + BLOCK_H / 2 : midY;
        return (
          <g key={conn.id}>
            <path d={path} fill="none" stroke="url(#cg)" strokeWidth="2.5"
              strokeDasharray={isSpouse ? "6 4" : "0"} strokeLinecap="round" />
            <foreignObject x={mx - 38} y={my - 11} width="76" height="22">
              <div className={cn(
                "text-[10px] text-center rounded-full px-2 py-0.5 font-medium border shadow-sm",
                isNight
                  ? "bg-slate-800/90 text-amber-200 border-amber-500/30"
                  : "bg-white/95 text-foreground border-amber-200"
              )}>
                {conn.label}
              </div>
            </foreignObject>
          </g>
        );
      })}
    </svg>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full w-full flex flex-col bg-background"
    >
      {/* ── Toolbar ── */}
      <div className="h-14 shrink-0 border-b border-border bg-background/95 backdrop-blur-xl flex items-center justify-between px-4 z-20">
        <div>
          <h1 className="font-serif font-semibold text-[17px] text-foreground leading-none">
            Семейное древо
          </h1>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {treeBlocks.length} чел. · удерживай для меню
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost" size="icon"
            className="h-9 w-9 rounded-full"
            onClick={() => setShowPdfModal(true)}
            title="Экспорт PDF"
          >
            <FileDown size={17} />
          </Button>
          <Button
            variant="ghost" size="icon"
            className="h-9 w-9 rounded-full"
            onClick={() => setShowBgPicker((v) => !v)}
          >
            <Layers size={17} />
          </Button>
          <Button
            size="icon"
            className="h-9 w-9 rounded-full bg-primary text-primary-foreground"
            onClick={() => setShowAddMember(true)}
          >
            <Plus size={18} />
          </Button>
        </div>
      </div>

      {/* ── Background picker ── */}
      <AnimatePresence>
        {showBgPicker && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-14 right-3 z-30 bg-card border border-border rounded-2xl shadow-xl p-2 w-48"
          >
            <p className="text-[10px] uppercase font-semibold text-muted-foreground px-2 pt-1 pb-2">
              Фон
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.keys(BACKGROUNDS).map((key) => (
                <button
                  key={key}
                  onClick={() => { setTreeBackground(key); setShowBgPicker(false); }}
                  className={cn(
                    "aspect-video rounded-lg border-2 overflow-hidden transition-all",
                    treeBackground === key ? "border-primary scale-95" : "border-border",
                    BACKGROUNDS[key].cls
                  )}
                >
                  <span className={cn(
                    "flex w-full h-full text-[9px] items-end justify-start p-1 font-medium",
                    BACKGROUNDS[key].night ? "text-amber-200" : "text-foreground/70"
                  )}>
                    {key}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Canvas area ── */}
      <div className="relative flex-1 overflow-hidden">
        {/* The scroll container fills the parent exactly */}
        <div
          className="absolute inset-0 overflow-auto"
          style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        >
          {/* Spacer div that creates the scrollable area sized to the visual canvas */}
          <div style={{ width: CANVAS_W * scale, height: CANVAS_H * scale, position: "relative" }}>
            {/* Scaled canvas positioned at top-left */}
            <div
              ref={canvasRef}
              className={cn("absolute top-0 left-0", bg.cls)}
              style={{
                width: CANVAS_W,
                height: CANVAS_H,
                transformOrigin: "top left",
                transform: `scale(${scale})`,
              }}
            >
              {renderConnections()}

              {treeBlocks.map((block) => {
                const member = family[block.memberId];
                if (!member) return null;
                const pos = getPos(block.id) as { x: number; y: number };
                const isDragging = dragging === block.id;

                return (
                  <div
                    key={block.id}
                    onPointerDown={(e) => onPointerDown(e, block.id)}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                    onContextMenu={(e) => onContextMenu(e, block.id)}
                    style={{
                      position: "absolute",
                      left: pos.x, top: pos.y,
                      width: BLOCK_W, height: BLOCK_H,
                      touchAction: "none",
                      zIndex: isDragging ? 50 : 10,
                      transform: isDragging ? "scale(1.06)" : "scale(1)",
                      transition: isDragging ? "none" : "transform 0.15s",
                    }}
                    className={cn(
                      "select-none rounded-2xl p-2.5 shadow-md flex flex-col items-center text-center cursor-grab active:cursor-grabbing border group",
                      isNight
                        ? "bg-slate-800/95 border-amber-500/30 text-amber-50"
                        : "bg-white/98 border-amber-100/80",
                      isDragging && "shadow-2xl ring-2 ring-primary/50"
                    )}
                  >
                    <div className="relative w-[54px] h-[54px] rounded-full overflow-hidden mb-1.5 border-2 border-white shadow-sm shrink-0">
                      <img
                        src={member.avatar} alt={member.name}
                        className="w-full h-full object-cover pointer-events-none"
                        draggable={false}
                      />
                      {member.isDeceased && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow border border-amber-100">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                        </div>
                      )}
                    </div>
                    <p className={cn(
                      "text-[11px] font-semibold leading-tight line-clamp-2 w-full",
                      isNight ? "text-amber-50" : "text-foreground"
                    )}>
                      {member.name}
                    </p>
                    <p className={cn(
                      "text-[9px] mt-0.5",
                      isNight ? "text-amber-200/70" : "text-muted-foreground"
                    )}>
                      {member.birthYear}
                      {member.isDeceased && member.deathYear ? ` — ${member.deathYear}` : ""}
                    </p>
                    {/* Long-press hint dot */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-0.5">
                        {[0,1,2].map(i => <div key={i} className={cn("w-1 h-1 rounded-full", isNight ? "bg-amber-300/50" : "bg-foreground/20")} />)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Zoom controls ── */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 bg-background/95 backdrop-blur-md border border-border p-1 rounded-full shadow-xl flex items-center gap-0.5">
        <Button
          variant="ghost" size="icon" className="w-8 h-8 rounded-full"
          onClick={() => setScale((s) => Math.max(0.3, +(s - 0.15).toFixed(2)))}
        >
          <ZoomOut size={15} />
        </Button>
        <div className="px-2 text-[11px] font-medium text-muted-foreground tabular-nums w-10 text-center">
          {Math.round(scale * 100)}%
        </div>
        <Button
          variant="ghost" size="icon" className="w-8 h-8 rounded-full"
          onClick={() => setScale((s) => Math.min(2, +(s + 0.15).toFixed(2)))}
        >
          <ZoomIn size={15} />
        </Button>
      </div>

      {/* ── Modals & overlays ── */}
      <AnimatePresence>
        {contextMenu && (
          <TreeContextMenu
            menu={contextMenu}
            onClose={() => setContextMenu(null)}
            onEdit={() => {
              const block = treeBlocks.find((b) => b.id === contextMenu.blockId);
              if (block) setEditMemberId(block.memberId);
            }}
            onAddConn={() => setAddConnFromBlock(contextMenu.blockId)}
            onManageConn={() => setManageConnBlock(contextMenu.blockId)}
            onDelete={() => handleDeleteBlock(contextMenu.blockId)}
          />
        )}
      </AnimatePresence>

      {editMemberId && (
        <MemberFormModal
          open
          member={family[editMemberId] ?? null}
          onClose={() => setEditMemberId(null)}
        />
      )}

      {addConnFromBlock && (
        <AddConnectionModal
          fromBlockId={addConnFromBlock}
          onClose={() => setAddConnFromBlock(null)}
        />
      )}

      {manageConnBlock && (
        <ManageConnectionsModal
          blockId={manageConnBlock}
          onClose={() => setManageConnBlock(null)}
        />
      )}

      {showPdfModal && (
        <PdfExportModal
          canvasRef={canvasRef}
          onClose={() => setShowPdfModal(false)}
        />
      )}

      <MemberFormModal
        open={showAddMember}
        member={null}
        onClose={() => setShowAddMember(false)}
        onAddToTree={handleAddToTree}
      />
    </motion.div>
  );
}
