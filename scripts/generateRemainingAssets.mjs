import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS = [
  // 1. Difunto de Conveniencia (Francisco Paesa)
  {
    outPath: 'public/art/archetypes/difunto_conveniencia.webp',
    svg: `
      <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <rect width="1024" height="1024" fill="#f4efe4"/>
        <!-- Textura de papel prensa envejecido y tramas linograbado -->
        <defs>
          <pattern id="hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#18181b" stroke-width="1.8" />
          </pattern>
        </defs>
        <!-- Fondo parisino en grabado suave -->
        <rect x="0" y="0" width="1024" height="1024" fill="url(#hatch)" opacity="0.08"/>
        <!-- Silueta arquitectónica bistrot -->
        <path d="M120 200 L300 200 L300 500 L120 500 Z" fill="#e2dac8" stroke="#18181b" stroke-width="4"/>
        <line x1="120" y1="300" x2="300" y2="300" stroke="#18181b" stroke-width="4"/>
        <!-- Sombrero Panamá -->
        <ellipse cx="512" cy="330" rx="340" ry="80" fill="#fcfbf7" stroke="#18181b" stroke-width="12"/>
        <path d="M300 330 C300 180, 724 180, 724 330 Z" fill="#fcfbf7" stroke="#18181b" stroke-width="12"/>
        <rect x="300" y="290" width="424" height="40" fill="#18181b"/>
        <!-- Rostro anciano cínico de Paesa -->
        <rect x="340" y="340" width="344" height="380" rx="40" fill="#fcfbf7" stroke="#18181b" stroke-width="14"/>
        <!-- Gafas de sol de espía -->
        <rect x="370" y="420" width="120" height="70" rx="14" fill="#18181b"/>
        <rect x="534" y="420" width="120" height="70" rx="14" fill="#18181b"/>
        <line x1="490" y1="450" x2="534" y2="450" stroke="#18181b" stroke-width="12"/>
        <line x1="390" y1="435" x2="470" y2="435" stroke="#ffffff" stroke-width="6" opacity="0.8"/>
        <line x1="554" y1="435" x2="634" y2="435" stroke="#ffffff" stroke-width="6" opacity="0.8"/>
        <!-- Sonrisa cínica con arrugas -->
        <path d="M420 620 Q512 680 604 610" fill="none" stroke="#18181b" stroke-width="12" stroke-linecap="round"/>
        <path d="M400 580 Q420 620 410 650" fill="none" stroke="#18181b" stroke-width="6"/>
        <path d="M624 570 Q604 610 614 640" fill="none" stroke="#18181b" stroke-width="6"/>
        <!-- Traje de lino impecable -->
        <path d="M220 740 L804 740 L880 1024 L144 1024 Z" fill="#fcfbf7" stroke="#18181b" stroke-width="14"/>
        <polygon points="460,740 564,740 534,980 490,980" fill="#18181b"/>
        <!-- Periódico con la propia esquela -->
        <rect x="180" y="780" width="664" height="220" fill="#ffffff" stroke="#18181b" stroke-width="10"/>
        <text x="210" y="830" font-family="monospace" font-size="28" font-weight="900" fill="#dc2626">EL PAÍS // ESQUELA MORTUORIA</text>
        <text x="210" y="880" font-family="monospace" font-size="22" font-weight="900" fill="#18181b">D. FRANCISCO PAESA HA FALLECIDO EN TAILANDIA</text>
        <text x="210" y="930" font-family="monospace" font-size="16" font-style="italic" fill="#52525b">R.I.P. - La Fiscalía pide el archivo por prescripción penal.</text>
        <!-- Sello de caucho rojo -->
        <g transform="rotate(-12 850 240)">
          <rect x="700" y="180" width="280" height="90" fill="#fee2e2" stroke="#dc2626" stroke-width="8" opacity="0.95"/>
          <text x="840" y="240" font-family="monospace" font-size="30" font-weight="900" fill="#dc2626" text-anchor="middle">PRESCRITO</text>
        </g>
      </svg>
    `
  },

  // 2. Alquimista de la Hormigonera (Marjaliza / Correa)
  {
    outPath: 'public/art/archetypes/alquimista_hormigonera.webp',
    svg: `
      <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <rect width="1024" height="1024" fill="#faf3e6"/>
        <!-- Rostro bronceado y satisfecho -->
        <circle cx="512" cy="460" r="260" fill="#fbd38d" stroke="#18181b" stroke-width="14"/>
        <!-- Gafas de sol de aviador en la frente -->
        <rect x="360" y="240" width="130" height="80" rx="18" fill="#0284c7" stroke="#18181b" stroke-width="10"/>
        <rect x="534" y="240" width="130" height="80" rx="18" fill="#0284c7" stroke="#18181b" stroke-width="10"/>
        <line x1="490" y1="270" x2="534" y2="270" stroke="#18181b" stroke-width="10"/>
        <!-- Bigotito fino -->
        <path d="M400 550 Q512 530 624 550 Q512 570 400 550 Z" fill="#18181b"/>
        <!-- Sonrisa con puro o palillo -->
        <path d="M420 590 Q512 660 604 590" fill="none" stroke="#18181b" stroke-width="12" stroke-linecap="round"/>
        <!-- Cadena de oro gigante con crucifijo o placa -->
        <ellipse cx="512" cy="800" rx="200" ry="120" fill="none" stroke="#d97706" stroke-width="22"/>
        <rect x="480" y="880" width="64" height="90" rx="8" fill="#d97706" stroke="#18181b" stroke-width="8"/>
        <!-- Camisa de seda abierta con pecho velloso -->
        <path d="M220 720 L804 720 L880 1024 L144 1024 Z" fill="#fed7aa" stroke="#18181b" stroke-width="14"/>
        <polygon points="400,720 512,920 624,720" fill="#fbd38d"/>
        <!-- Fardo de billetes de 500 € -->
        <g transform="rotate(15 760 760)">
          <rect x="660" y="700" width="240" height="140" rx="10" fill="#e9d5ff" stroke="#18181b" stroke-width="8"/>
          <rect x="740" y="700" width="40" height="140" fill="#7e22ce" opacity="0.4"/>
          <text x="780" y="780" font-family="monospace" font-size="42" font-weight="900" fill="#581c87" text-anchor="middle">500 €</text>
        </g>
        <!-- Langostino a la plancha asomando -->
        <path d="M220 660 C260 580, 360 620, 340 700 C300 740, 240 700, 220 660 Z" fill="#ea580c" stroke="#18181b" stroke-width="8"/>
        <!-- Sello de caucho -->
        <g transform="rotate(-15 220 220)">
          <rect x="100" y="160" width="280" height="90" fill="#fef08a" stroke="#ca8a04" stroke-width="8"/>
          <text x="240" y="218" font-family="monospace" font-size="30" font-weight="900" fill="#854d0e" text-anchor="middle">LA PIZZA 30%</text>
        </g>
      </svg>
    `
  },

  // 3. Lavandero Transnacional (Testaferro Camorra/Rusia)
  {
    outPath: 'public/art/archetypes/lavandero_transnacional.webp',
    svg: `
      <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <rect width="1024" height="1024" fill="#f0ede6"/>
        <!-- Rostro gélido, anguloso con corte de pelo militar moderno -->
        <polygon points="340,300 684,300 624,700 400,700" fill="#fcfbf7" stroke="#18181b" stroke-width="14"/>
        <path d="M300 300 Q512 220 724 300 L724 360 L300 360 Z" fill="#18181b"/>
        <!-- Gafas de montura metálica fina de diseño -->
        <rect x="380" y="420" width="110" height="60" rx="6" fill="#e0f2fe" stroke="#18181b" stroke-width="8"/>
        <rect x="534" y="420" width="110" height="60" rx="6" fill="#e0f2fe" stroke="#18181b" stroke-width="8"/>
        <line x1="490" y1="445" x2="534" y2="445" stroke="#18181b" stroke-width="8"/>
        <circle cx="435" cy="450" r="12" fill="#18181b"/>
        <circle cx="589" cy="450" r="12" fill="#18181b"/>
        <!-- Boca recta inexpresiva -->
        <line x1="440" y1="580" x2="584" y2="580" stroke="#18181b" stroke-width="10" stroke-linecap="round"/>
        <!-- Traje italiano de diseño oscuro -->
        <path d="M220 720 L804 720 L880 1024 L144 1024 Z" fill="#27272a" stroke="#18181b" stroke-width="14"/>
        <!-- Lavadora de carga frontal expulsando billetes en espiral -->
        <circle cx="280" cy="860" r="150" fill="#f8fafc" stroke="#18181b" stroke-width="12"/>
        <circle cx="280" cy="860" r="100" fill="#38bdf8" stroke="#18181b" stroke-width="10" opacity="0.8"/>
        <path d="M240 820 Q320 860 300 920" stroke="#ffffff" stroke-width="12" fill="none"/>
        <!-- Billetes flotando de la lavadora -->
        <rect x="360" y="780" width="100" height="50" rx="4" fill="#fed7aa" stroke="#18181b" stroke-width="6" transform="rotate(25 360 780)"/>
        <rect x="420" y="850" width="100" height="50" rx="4" fill="#e9d5ff" stroke="#18181b" stroke-width="6" transform="rotate(-15 420 850)"/>
        <!-- Sello de sociedad en paraíso fiscal -->
        <g transform="rotate(8 750 260)">
          <rect x="620" y="210" width="310" height="90" fill="#e0e7ff" stroke="#3730a3" stroke-width="8"/>
          <text x="775" y="268" font-family="monospace" font-size="28" font-weight="900" fill="#312e81" text-anchor="middle">CAYMAN HOLDING</text>
        </g>
      </svg>
    `
  },

  // 4. Chófer con Pendrive (public/art/characters/chofer_pendrive.webp)
  {
    outPath: 'public/art/characters/chofer_pendrive.webp',
    svg: `
      <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <rect width="1024" height="1024" fill="#f2eee5"/>
        <!-- Gorra militar de servicio -->
        <path d="M220 380 Q512 200 804 380 L880 440 L144 440 Z" fill="#18181b" stroke="#18181b" stroke-width="14"/>
        <ellipse cx="512" cy="440" rx="360" ry="60" fill="#27272a" stroke="#18181b" stroke-width="10"/>
        <circle cx="512" cy="340" r="30" fill="#facc15" stroke="#18181b" stroke-width="6"/>
        <!-- Rostro del chófer con mandíbula de apretar los dientes -->
        <rect x="320" y="440" width="384" height="340" rx="20" fill="#fcfbf7" stroke="#18181b" stroke-width="14"/>
        <!-- Gafas de aviador oscuras reflejando el volante de un Mercedes -->
        <polygon points="360,500 480,500 460,620 380,620" fill="#18181b"/>
        <polygon points="544,500 664,500 644,620 564,620" fill="#18181b"/>
        <line x1="480" y1="520" x2="544" y2="520" stroke="#18181b" stroke-width="12"/>
        <line x1="390" y1="520" x2="440" y2="590" stroke="#facc15" stroke-width="6"/>
        <line x1="574" y1="520" x2="624" y2="590" stroke="#facc15" stroke-width="6"/>
        <!-- Boca tensa de confidente -->
        <line x1="420" y1="690" x2="604" y2="690" stroke="#18181b" stroke-width="10" stroke-linecap="round"/>
        <!-- Cuello con cadena y pendrive USB dorado -->
        <path d="M220 780 L804 780 L880 1024 L144 1024 Z" fill="#1e293b" stroke="#18181b" stroke-width="14"/>
        <line x1="480" y1="780" x2="512" y2="880" stroke="#ca8a04" stroke-width="10"/>
        <line x1="544" y1="780" x2="512" y2="880" stroke="#ca8a04" stroke-width="10"/>
        <!-- Memoria USB dorada con etiqueta "BÁRCENAS" -->
        <rect x="460" y="870" width="104" height="120" rx="8" fill="#eab308" stroke="#18181b" stroke-width="10"/>
        <rect x="488" y="840" width="48" height="30" fill="#94a3b8" stroke="#18181b" stroke-width="6"/>
        <text x="512" y="940" font-family="monospace" font-size="20" font-weight="900" fill="#18181b" text-anchor="middle">USB-32GB</text>
      </svg>
    `
  },

  // 5. El Padrino del 3% (public/art/characters/padrino_trespercent.webp)
  {
    outPath: 'public/art/characters/padrino_trespercent.webp',
    svg: `
      <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <rect width="1024" height="1024" fill="#faf5eb"/>
        <!-- Rostro de patriarca venerable con papada prominente -->
        <circle cx="512" cy="450" r="240" fill="#fcfbf7" stroke="#18181b" stroke-width="14"/>
        <ellipse cx="512" cy="650" rx="160" ry="70" fill="#fcfbf7" stroke="#18181b" stroke-width="12"/>
        <!-- Pelo blanco peinado hacia los lados -->
        <path d="M260 400 Q512 240 764 400 L740 320 Q512 180 284 320 Z" fill="#e4e4e7" stroke="#18181b" stroke-width="10"/>
        <!-- Gafas redondas de moralista -->
        <circle cx="420" cy="430" r="60" fill="none" stroke="#18181b" stroke-width="12"/>
        <circle cx="604" cy="430" r="60" fill="none" stroke="#18181b" stroke-width="12"/>
        <line x1="480" y1="430" x2="544" y2="430" stroke="#18181b" stroke-width="12"/>
        <circle cx="420" cy="430" r="14" fill="#18181b"/>
        <circle cx="604" cy="430" r="14" fill="#18181b"/>
        <!-- Sonrisa beatífica paternalista -->
        <path d="M430 580 Q512 630 594 580" fill="none" stroke="#18181b" stroke-width="10" stroke-linecap="round"/>
        <!-- Traje sobrio con devocionario / misal andorrano en mano -->
        <path d="M220 740 L804 740 L880 1024 L144 1024 Z" fill="#18181b" stroke="#18181b" stroke-width="14"/>
        <!-- Misal abierto con billetes asomando -->
        <rect x="360" y="780" width="304" height="200" rx="12" fill="#713f12" stroke="#18181b" stroke-width="10"/>
        <text x="512" y="860" font-family="monospace" font-size="28" font-weight="900" fill="#fde047" text-anchor="middle">MISAL ANDORRA</text>
        <text x="512" y="920" font-family="monospace" font-size="34" font-weight="900" fill="#ffffff" text-anchor="middle">3% PER CENT</text>
      </svg>
    `
  },

  // 6. Conseguidor Litoral (public/art/characters/conseguidor_paella.webp)
  {
    outPath: 'public/art/characters/conseguidor_paella.webp',
    svg: `
      <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <rect width="1024" height="1024" fill="#fff7ed"/>
        <!-- Rostro orondo, bronceado, sudoroso -->
        <circle cx="512" cy="440" r="250" fill="#fdba74" stroke="#18181b" stroke-width="14"/>
        <!-- Bigotillo perfilado -->
        <path d="M380 540 Q512 510 644 540 Q512 570 380 540 Z" fill="#18181b"/>
        <!-- Sonrisa campechana -->
        <path d="M420 590 Q512 670 604 590" fill="none" stroke="#18181b" stroke-width="14" stroke-linecap="round"/>
        <!-- Gafas de sol de espejo en la frente -->
        <rect x="350" y="220" width="140" height="80" rx="18" fill="#0284c7" stroke="#18181b" stroke-width="10"/>
        <rect x="534" y="220" width="140" height="80" rx="18" fill="#0284c7" stroke="#18181b" stroke-width="10"/>
        <!-- Paellera y marisco en primer plano -->
        <ellipse cx="512" cy="880" rx="360" ry="140" fill="#f59e0b" stroke="#18181b" stroke-width="16"/>
        <circle cx="420" cy="860" r="30" fill="#ef4444" stroke="#18181b" stroke-width="6"/>
        <circle cx="580" cy="850" r="30" fill="#ef4444" stroke="#18181b" stroke-width="6"/>
        <path d="M480 840 Q540 800 520 900" stroke="#ea580c" stroke-width="18" fill="none"/>
        <!-- Billetes bajo el mantel -->
        <rect x="180" y="780" width="200" height="100" fill="#a855f7" stroke="#18181b" stroke-width="8" transform="rotate(-15 180 780)"/>
        <text x="240" y="850" font-family="monospace" font-size="32" font-weight="900" fill="#ffffff" transform="rotate(-15 240 850)">500 €</text>
      </svg>
    `
  },

  // 7. Informático del Partido (public/art/characters/informatico_martillo.webp)
  {
    outPath: 'public/art/characters/informatico_martillo.webp',
    svg: `
      <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <rect width="1024" height="1024" fill="#f1f5f9"/>
        <!-- Cabeza sudorosa y en pánico -->
        <circle cx="460" cy="460" r="220" fill="#fcfbf7" stroke="#18181b" stroke-width="14"/>
        <!-- Gafas torcidas -->
        <rect x="360" y="420" width="90" height="60" rx="8" fill="none" stroke="#18181b" stroke-width="10" transform="rotate(10 360 420)"/>
        <rect x="490" y="440" width="90" height="60" rx="8" fill="none" stroke="#18181b" stroke-width="10" transform="rotate(-5 490 440)"/>
        <!-- Ojos saltones desorbitados -->
        <circle cx="410" cy="450" r="16" fill="#18181b"/>
        <circle cx="530" cy="470" r="16" fill="#18181b"/>
        <!-- Gotas de sudor frío -->
        <path d="M300 400 Q280 460 320 460 Q360 460 340 400 Z" fill="#0284c7"/>
        <path d="M600 380 Q580 440 620 440 Q660 440 640 380 Z" fill="#0284c7"/>
        <!-- Maza gigante levantada con ambas manos -->
        <rect x="680" y="120" width="220" height="120" rx="14" fill="#475569" stroke="#18181b" stroke-width="14" transform="rotate(25 680 120)"/>
        <line x1="780" y1="240" x2="620" y2="580" stroke="#78350f" stroke-width="26" stroke-linecap="round"/>
        <!-- Disco duro abollado en la mesa con 35 marcas de golpes -->
        <rect x="220" y="780" width="420" height="200" rx="18" fill="#94a3b8" stroke="#18181b" stroke-width="14"/>
        <line x1="280" y1="840" x2="480" y2="940" stroke="#18181b" stroke-width="12"/>
        <line x1="380" y1="820" x2="560" y2="900" stroke="#18181b" stroke-width="12"/>
        <text x="430" y="930" font-family="monospace" font-size="28" font-weight="900" fill="#dc2626" text-anchor="middle">35 MARTILLAZOS</text>
      </svg>
    `
  },

  // 8. Crisis Bancarrota (public/art/crisis/crisis_bancarrota.webp)
  {
    outPath: 'public/art/crisis/crisis_bancarrota.webp',
    svg: `
      <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <rect width="1024" height="1024" fill="#1c1917"/>
        <!-- Caja fuerte blindada con la puerta abierta de par en par -->
        <rect x="180" y="160" width="664" height="704" rx="24" fill="#292524" stroke="#d97706" stroke-width="18"/>
        <rect x="240" y="220" width="544" height="584" rx="12" fill="#0c0a09" stroke="#78350f" stroke-width="12"/>
        <!-- Rueda de combinación rota colgando -->
        <circle cx="820" cy="512" r="100" fill="#44403c" stroke="#d97706" stroke-width="14"/>
        <!-- Telarañas gigantes en las esquinas interiores -->
        <path d="M240 220 L380 360 M240 280 L320 360 M300 220 L380 300" stroke="#78716c" stroke-width="6"/>
        <path d="M784 220 L644 360 M784 280 L704 360 M724 220 L644 300" stroke="#78716c" stroke-width="6"/>
        <!-- Polilla revoloteando en el interior vacío -->
        <g transform="translate(480, 480)">
          <ellipse cx="0" cy="0" rx="18" ry="40" fill="#a8a29e"/>
          <ellipse cx="-40" cy="-20" rx="50" ry="25" fill="#e7e5e4" stroke="#1c1917" stroke-width="4" transform="rotate(-25)"/>
          <ellipse cx="40" cy="-20" rx="50" ry="25" fill="#e7e5e4" stroke="#1c1917" stroke-width="4" transform="rotate(25)"/>
        </g>
        <!-- Rótulo de alerta en rojo y amarillo -->
        <rect x="260" y="680" width="504" height="90" fill="#7f1d1d" stroke="#ef4444" stroke-width="8"/>
        <text x="512" y="740" font-family="monospace" font-size="44" font-weight="900" fill="#fef08a" text-anchor="middle">SALDO: 0,00 € (BANCARROTA)</text>
      </svg>
    `
  },

  // 9. Crisis Suplicatorio (public/art/crisis/crisis_suplicatorio.webp)
  {
    outPath: 'public/art/crisis/crisis_suplicatorio.webp',
    svg: `
      <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <rect width="1024" height="1024" fill="#09090b"/>
        <!-- Hemiciclo del Congreso en sombras con escaños rojos -->
        <path d="M120 700 Q512 400 904 700 L960 1024 L64 1024 Z" fill="#7f1d1d" stroke="#18181b" stroke-width="12"/>
        <!-- Dedos acusadores apuntando al centro -->
        <line x1="160" y1="640" x2="380" y2="560" stroke="#fca5a5" stroke-width="16" stroke-linecap="round"/>
        <line x1="864" y1="640" x2="644" y2="560" stroke="#fca5a5" stroke-width="16" stroke-linecap="round"/>
        <!-- Mazo del Tribunal Supremo impactando el estrado -->
        <rect x="420" y="240" width="220" height="110" rx="14" fill="#78350f" stroke="#ffffff" stroke-width="10" transform="rotate(-20 420 240)"/>
        <line x1="500" y1="340" x2="420" y2="600" stroke="#78350f" stroke-width="22" stroke-linecap="round"/>
        <!-- Esposas policiales abiertas -->
        <circle cx="360" cy="740" r="70" fill="none" stroke="#e2e8f0" stroke-width="16"/>
        <circle cx="664" cy="740" r="70" fill="none" stroke="#e2e8f0" stroke-width="16"/>
        <line x1="430" y1="740" x2="594" y2="740" stroke="#e2e8f0" stroke-width="14" stroke-dasharray="14 10"/>
        <!-- Rótulo del suplicatorio -->
        <rect x="200" y="100" width="624" height="100" fill="#dc2626" stroke="#ffffff" stroke-width="8"/>
        <text x="512" y="165" font-family="monospace" font-size="38" font-weight="900" fill="#ffffff" text-anchor="middle">SUPLICATORIO: AFORAMIENTO REVOCADO</text>
      </svg>
    `
  },

  // 10. Crisis Prensa Escándalo (public/art/crisis/crisis_prensa_escandalo.webp)
  {
    outPath: 'public/art/crisis/crisis_prensa_escandalo.webp',
    svg: `
      <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <rect width="1024" height="1024" fill="#f8fafc"/>
        <!-- Portada de periódico tabloide gigante -->
        <rect x="100" y="80" width="824" height="864" fill="#ffffff" stroke="#18181b" stroke-width="16"/>
        <!-- Cabecera del diario sensacionalista -->
        <rect x="100" y="80" width="824" height="140" fill="#dc2626"/>
        <text x="512" y="170" font-family="monospace" font-size="64" font-weight="900" fill="#ffffff" text-anchor="middle">DIARIO DE LA NACIÓN</text>
        <!-- Titular gigante en negro -->
        <text x="140" y="290" font-family="monospace" font-size="46" font-weight="900" fill="#18181b">¡CAZADO EN EL ASADOR!</text>
        <text x="140" y="340" font-family="monospace" font-size="28" font-weight="900" fill="#dc2626">LOS AUDIOS REVELAN MORDIDAS Y BOGAVANTES</text>
        <!-- Ficha policial en blanco y negro con barra en los ojos -->
        <rect x="140" y="380" width="400" height="420" fill="#f1f5f9" stroke="#18181b" stroke-width="10"/>
        <circle cx="340" cy="540" r="100" fill="#334155"/>
        <path d="M220 780 C220 660, 460 660, 460 780 Z" fill="#1e293b"/>
        <rect x="250" y="510" width="180" height="40" fill="#dc2626"/>
        <text x="340" y="538" font-family="monospace" font-size="20" font-weight="900" fill="#ffffff" text-anchor="middle">IMPUTADO</text>
        <!-- Columnas de texto simulado de periódico -->
        <line x1="580" y1="400" x2="880" y2="400" stroke="#18181b" stroke-width="8"/>
        <line x1="580" y1="440" x2="880" y2="440" stroke="#64748b" stroke-width="4"/>
        <line x1="580" y1="470" x2="880" y2="470" stroke="#64748b" stroke-width="4"/>
        <line x1="580" y1="500" x2="880" y2="500" stroke="#64748b" stroke-width="4"/>
        <line x1="580" y1="530" x2="880" y2="530" stroke="#64748b" stroke-width="4"/>
        <line x1="580" y1="560" x2="880" y2="560" stroke="#64748b" stroke-width="4"/>
        <line x1="580" y1="600" x2="880" y2="600" stroke="#18181b" stroke-width="8"/>
        <line x1="580" y1="640" x2="880" y2="640" stroke="#64748b" stroke-width="4"/>
        <line x1="580" y1="670" x2="880" y2="670" stroke="#64748b" stroke-width="4"/>
        <!-- Rótulo de dimisión -->
        <rect x="140" y="830" width="744" height="80" fill="#18181b"/>
        <text x="512" y="885" font-family="monospace" font-size="34" font-weight="900" fill="#ffffff" text-anchor="middle">DIMISIÓN UNÁNIME ANTES DE LAS 15:00</text>
      </svg>
    `
  },

  // 11. Mascarillas en Pandemia (public/art/virales/viral_mascarillas_koldo.webp)
  {
    outPath: 'public/art/virales/viral_mascarillas_koldo.webp',
    svg: `
      <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <rect width="1024" height="1024" fill="#0f172a"/>
        <!-- Gasolinera desierta de noche con farolas amarillentas -->
        <rect x="100" y="100" width="824" height="160" fill="#334155" stroke="#ffffff" stroke-width="8"/>
        <text x="512" y="200" font-family="monospace" font-size="48" font-weight="900" fill="#facc15" text-anchor="middle">ÁREA DE SERVICIO KM 204</text>
        <!-- Maletero abierto de todoterreno -->
        <rect x="220" y="420" width="584" height="420" rx="16" fill="#1e293b" stroke="#ffffff" stroke-width="12"/>
        <!-- Cajas de mascarillas amontonadas -->
        <rect x="280" y="560" width="220" height="140" fill="#f8fafc" stroke="#18181b" stroke-width="8"/>
        <text x="390" y="630" font-family="monospace" font-size="28" font-weight="900" fill="#0284c7" text-anchor="middle">FFP2 (x5000)</text>
        <text x="390" y="670" font-family="monospace" font-size="20" font-weight="bold" fill="#dc2626" text-anchor="middle">+400% COMISIÓN</text>
        <!-- Maletín con billetes -->
        <rect x="540" y="540" width="200" height="160" rx="12" fill="#78350f" stroke="#18181b" stroke-width="8"/>
        <rect x="580" y="600" width="120" height="50" fill="#e9d5ff" stroke="#18181b" stroke-width="4"/>
        <text x="640" y="635" font-family="monospace" font-size="24" font-weight="900" fill="#581c87" text-anchor="middle">500 €</text>
        <!-- Sello de urgencia sanitaria -->
        <g transform="rotate(-10 512 880)">
          <rect x="240" y="840" width="544" height="90" fill="#ef4444" stroke="#ffffff" stroke-width="6"/>
          <text x="512" y="900" font-family="monospace" font-size="34" font-weight="900" fill="#ffffff" text-anchor="middle">CONTRATO DE EMERGENCIA</text>
        </g>
      </svg>
    `
  },

  // 12. Comisión de Investigación en el Congreso (public/art/virales/viral_comision_congreso.webp)
  {
    outPath: 'public/art/virales/viral_comision_congreso.webp',
    svg: `
      <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <rect width="1024" height="1024" fill="#fafaf9"/>
        <!-- Mesa de interrogatorio oficial con atril y vaso de agua -->
        <rect x="160" y="600" width="704" height="340" rx="16" fill="#78350f" stroke="#18181b" stroke-width="14"/>
        <!-- Vaso de agua temblando -->
        <polygon points="320,500 370,500 360,600 330,600" fill="#e0f2fe" stroke="#18181b" stroke-width="6"/>
        <ellipse cx="345" cy="500" rx="25" ry="8" fill="#bae6fd" stroke="#18181b" stroke-width="4"/>
        <!-- Banco de micrófonos parlamentarios apuntando al compareciente -->
        <rect x="470" y="440" width="84" height="60" rx="10" fill="#18181b"/>
        <line x1="512" y1="500" x2="512" y2="600" stroke="#18181b" stroke-width="12"/>
        <rect x="580" y="450" width="70" height="50" rx="8" fill="#18181b"/>
        <line x1="615" y1="500" x2="580" y2="600" stroke="#18181b" stroke-width="10"/>
        <!-- Pilas de carpetas rojas con sumarios intervenidos -->
        <rect x="680" y="520" width="140" height="80" rx="4" fill="#dc2626" stroke="#18181b" stroke-width="6"/>
        <rect x="690" y="490" width="140" height="40" rx="4" fill="#b91c1c" stroke="#18181b" stroke-width="6"/>
        <!-- Letrero de la sala -->
        <rect x="260" y="160" width="504" height="120" fill="#18181b"/>
        <text x="512" y="230" font-family="monospace" font-size="40" font-weight="900" fill="#ffffff" text-anchor="middle">SALA ERNEST LLUCH</text>
        <text x="512" y="265" font-family="monospace" font-size="22" font-weight="bold" fill="#facc15" text-anchor="middle">COMISIÓN DE INVESTIGACIÓN (EN DIRECTO)</text>
      </svg>
    `
  }
];

async function run() {
  console.log('[ASSET PIPELINE] Iniciando generación de ilustraciones en alta resolución...');
  for (const asset of ASSETS) {
    const fullPath = path.join(__dirname, '..', asset.outPath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const svgBuffer = Buffer.from(asset.svg.trim());
    await sharp(svgBuffer)
      .webp({ quality: 90 })
      .toFile(fullPath);
    console.log(`✓ Generado: ${asset.outPath}`);
  }
  console.log('[ASSET PIPELINE] ¡100% de la biblioteca de assets completada con éxito!');
}

run().catch((err) => {
  console.error('Error generando assets:', err);
  process.exit(1);
});
