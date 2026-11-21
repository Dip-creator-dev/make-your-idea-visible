import type { GarmentKind } from "@/components/ui/product-rail-gallery";

const BODY: Record<GarmentKind, string> = {
  tee: "M70,30 C80,42 120,42 130,30 L165,45 L188,90 L160,104 L152,92 L152,236 L48,236 L48,92 L40,104 L12,90 L35,45 Z",
  knit: "M72,30 C82,42 118,42 128,30 L162,44 L178,110 L184,220 L162,224 L152,120 L152,240 L48,240 L48,120 L38,224 L16,220 L22,110 L38,44 Z",
  hoodie: "M66,40 C66,10 134,10 134,40 L166,52 L182,120 L188,228 L164,232 L154,124 L154,242 L46,242 L46,124 L36,232 L12,228 L18,120 L34,52 Z",
  shirt: "M74,28 L100,46 L126,28 L162,42 L180,112 L186,226 L164,230 L154,120 L156,244 L44,244 L46,120 L36,230 L14,226 L20,112 L38,42 Z",
  jacket: "M70,26 L100,60 L130,26 L166,40 L184,116 L190,232 L166,236 L156,124 L158,246 L42,246 L44,124 L34,236 L10,232 L16,116 L34,40 Z",
  coat: "M72,24 L100,70 L128,24 L164,38 L182,120 L188,250 L166,254 L156,130 L160,290 L40,290 L44,130 L34,254 L12,250 L18,120 L36,38 Z",
};

const DETAIL: Record<GarmentKind, string> = {
  tee: "M70,30 C80,42 120,42 130,30",
  knit: "M72,30 C82,42 118,42 128,30 M48,232 L152,232 M22,214 L38,216 M162,216 L178,214",
  hoodie: "M66,40 C80,64 120,64 134,40 M72,170 L128,170 L136,210 L64,210 Z M92,58 L90,92 M108,58 L110,92",
  shirt: "M100,46 L100,244 M74,28 L88,56 L100,46 L112,56 L126,28",
  jacket: "M100,60 L100,246 M60,150 L84,150 M116,150 L140,150 M70,26 L84,80 L100,60 L116,80 L130,26",
  coat: "M100,70 L100,290 M72,24 L86,96 L100,70 L114,96 L128,24 M58,190 L84,190 M116,190 L142,190",
};

export function GarmentArt({ kind, color, back = false, className }: { kind: GarmentKind; color: string; back?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 200 310" className={className} aria-hidden="true">
      <g transform={back ? "translate(200,0) scale(-1,1)" : undefined}>
        <path d={BODY[kind]} fill={color} stroke="currentColor" strokeOpacity="0.18" strokeWidth="1.5" strokeLinejoin="round" />
        <path d={BODY[kind]} fill="url(#shade)" />
        {!back && <path d={DETAIL[kind]} fill="none" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1.5" strokeLinecap="round" />}
      </g>
      <defs>
        <linearGradient id="shade" x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.08" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="1" stopColor="#000" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  );
}
