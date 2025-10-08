# TriglyCoach - Checklist Zilnic de Sănătate 🏥

Aplicație web progresivă (PWA) pentru gestionarea zilnică a activității fizice, dietei și medicației pentru persoane cu hipertrigliceridemie.

## 📋 Caracteristici

- ✅ **Checklist Zilnic** - Trei secțiuni: Activitate, Dietă, Medicație
- 📅 **Calendar** - Vizualizare istorică cu stări (complet/parțial/ratat)
- 📊 **Statistici** - Serii, rate de finalizare, grafice
- ⚙️ **Setări** - Personalizare checklist, export date CSV, setări limbă
- 🌙 **Dark Mode** - Suport complet pentru modul întunecat
- 📱 **PWA** - Instalabilă pe telefon, funcționează offline
- 🇷🇴 **Bilingv** - Română și Engleză
- 🔒 **Privacy-First** - Date stocate local în browser

## 🚀 Instalare și Rulare

### Prerequisites

- Node.js 18+ și npm

### Setup Local

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Aplicația va rula pe `http://localhost:3000`

## 📦 Deployment pe Vercel

### Opțiunea 1: Deploy cu CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Opțiunea 2: Deploy cu GitHub

1. Push codul pe GitHub
2. Mergi pe [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Selectează repository-ul
5. Vercel va detecta automat Next.js și va face deploy

## 🎨 Customizare

### Icoane PWA

Pentru a adăuga icoane personalizate pentru PWA:

1. Creează imagini PNG:
   - `icon-192.png` (192x192)
   - `icon-512.png` (512x512)

2. Plasează-le în folderul `public/`

3. Poți folosi un generator online precum [RealFaviconGenerator](https://realfavicongenerator.net/)

### Modificare Checklist

Editează `lib/defaults.ts` pentru a schimba elementele din checklist:

```typescript
export const DEFAULT_TEMPLATE: ChecklistTemplate = {
  sections: [
    {
      name: 'Activity',
      nameRo: 'Activitate',
      items: [
        // Adaugă sau modifică iteme aici
      ],
    },
    // ...
  ],
};
```

### Personalizare Culori

Modifică `app/globals.css` și `tailwind.config.ts` pentru a schimba schema de culori.

## 📱 Funcții PWA

Aplicația poate fi instalată ca aplicație nativă pe telefon:

**iOS:**
1. Deschide în Safari
2. Tap "Share" → "Add to Home Screen"

**Android:**
1. Deschide în Chrome
2. Tap menu → "Install app"

## 🗂️ Structura Proiectului

```
triglycoach/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home (Today) page
│   ├── calendar/          # Calendar view
│   ├── stats/             # Statistics page
│   ├── settings/          # Settings page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   └── Navigation.tsx     # Bottom navigation
├── lib/                   # Utilities and logic
│   ├── types.ts          # TypeScript types
│   ├── defaults.ts       # Default templates
│   ├── storage.ts        # localStorage utilities
│   ├── utils.ts          # Helper functions
│   ├── context.tsx       # React context
│   └── translations.ts   # i18n translations
├── public/               # Static assets
│   └── manifest.json     # PWA manifest
└── next.config.ts        # Next.js config + PWA
```

## 🔧 Tehnologii Utilizate

- **Framework:** Next.js 15 (App Router)
- **Styling:** TailwindCSS
- **PWA:** next-pwa
- **TypeScript:** Type-safe development
- **Storage:** localStorage (cu opțiune pentru Supabase în viitor)

## 📊 Funcționalități Detaliate

### Checklist Zilnic
- 3 secțiuni: Activitate, Dietă, Medicație
- Checkbox-uri animate
- Progress bar în timp real
- Mesaj de felicitare când e complet
- Salvare automată în localStorage

### Calendar
- Vizualizare lunară
- Culori pentru stări: verde (complet), galben (parțial), roșu (ratat)
- Detalii pe zi când selectezi o dată
- Navigare între luni

### Statistici
- Serie curentă și cea mai lungă
- Rate de finalizare (7 zile, 30 zile)
- Finalizare pe secțiune
- Grafic activitate ultimele 7 zile
- Total zile înregistrate

### Setări
- Profil (nume, email opțional)
- Schimbare limbă (RO/EN)
- Export date CSV
- Șterge toate datele
- Vizualizare disclaimer medical

## ⚠️ Disclaimer Medical

Această aplicație este doar în scop informativ și nu înlocuiește sfatul medical profesional, diagnosticul sau tratamentul. Consultați întotdeauna medicul înainte de a face modificări la medicație, dietă sau rutina de exerciții.

## 📝 TODO / Funcționalități Viitoare

- [ ] Notificări push Web
- [ ] Notificări email (cu cron job Vercel)
- [ ] Cloud sync cu Supabase (opțional)
- [ ] Export/Import date JSON
- [ ] Grafice mai avansate
- [ ] Reminder-uri personalizabile pe element
- [ ] Teme de culori personalizabile
- [ ] Rapoarte săptămânale/lunare

## 🤝 Contribuții

Contribuțiile sunt binevenite! Deschide un issue sau pull request.

## 📄 Licență

MIT License

---

**Made with ❤️ pentru sănătate mai bună**
