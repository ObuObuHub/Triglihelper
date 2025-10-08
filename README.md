# TriglyCoach - Checklist Zilnic de Sănătate 🏥

Aplicație web progresivă (PWA) pentru gestionarea zilnică a activității fizice, dietei și medicației pentru persoane cu hipertrigliceridemie.

## 📋 Caracteristici

- ✅ **Checklist Zilnic** - Trei secțiuni: Activitate, Dietă, Medicație
- 📅 **Calendar** - Vizualizare istorică cu stări (complet/parțial/ratat)
- 📊 **Statistici** - Serii, rate de finalizare, grafice
- ⚙️ **Setări** - Personalizare checklist, setări limbă
- 🌙 **Dark Mode** - Suport complet pentru modul întunecat
- 📱 **PWA** - Instalabilă pe telefon, funcționează offline
- 🇷🇴 **Bilingv** - Română și Engleză
- ☁️ **Cloud Sync** - Sincronizare date pe multiple dispozitive cu Supabase
- 🔒 **Privacy-First** - Date stocate local cu opțiune cloud sync

## 🚀 Instalare și Rulare

### Prerequisites

- Node.js 18+ și npm
- (Opțional) Cont Supabase pentru cloud sync

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

## ☁️ Setup Supabase (Opțional - pentru Cloud Sync)

Supabase activează sincronizarea datelor între dispozitive. **Aplicația funcționează perfect și fără Supabase** (date doar în localStorage).

### Pasul 1: Creează Proiect Supabase

1. Mergi pe [https://supabase.com](https://supabase.com) și creează un cont
2. Click "New Project"
3. Alege nume, parolă database, și regiune
4. Așteaptă ~2 minute până se creează proiectul

### Pasul 2: Configurează Database

1. În dashboard-ul Supabase, mergi la **SQL Editor**
2. Click "New Query"
3. Copiază conținutul fișierului `supabase-schema.sql` din proiect
4. Paste în editor și rulează (click "Run")
5. Verifică că tabelele au fost create în tab-ul **Table Editor**

### Pasul 3: Obține API Keys

1. Mergi la **Settings** → **API**
2. Copiază:
   - `Project URL` (de exemplu: `https://xyzcompany.supabase.co`)
   - `anon public` key (cheia lungă care începe cu `eyJ...`)

### Pasul 4: Configurează Environment Variables

**Local Development:**
```bash
# Creează fișier .env.local în rădăcina proiectului
cp .env.local.example .env.local

# Editează .env.local și adaugă:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Vercel Deployment:**
1. În dashboard Vercel, mergi la Settings → Environment Variables
2. Adaugă:
   - `NEXT_PUBLIC_SUPABASE_URL` = URL-ul tău Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = cheia ta anon
3. Redeploy proiectul

### Pasul 5: Configurează Email Authentication

1. În Supabase, mergi la **Authentication** → **Providers**
2. Activează **Email**
3. (Opțional) Configurează SMTP custom pentru email-uri branded

**Gata!** Acum utilizatorii pot:
- Sign in cu email (magic link)
- Sincroniza datele automat între dispozitive
- Accesa datele de pe telefon, laptop, tabletă

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
6. (Opțional) Adaugă Supabase environment variables în Settings

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
│   └── settings/          # Settings page
├── components/            # React components
│   └── Navigation.tsx     # Bottom navigation
├── lib/                   # Utilities and logic
│   ├── types.ts          # TypeScript types
│   ├── defaults.ts       # Default templates
│   ├── storage.ts        # localStorage + cloud sync
│   ├── cloudStorage.ts   # Supabase integration
│   ├── supabase.ts       # Supabase client
│   ├── auth.ts           # Authentication
│   ├── utils.ts          # Helper functions
│   ├── context.tsx       # React context
│   └── translations.ts   # i18n translations
├── public/               # Static assets
│   └── manifest.json     # PWA manifest
├── supabase-schema.sql   # Database schema
└── next.config.ts        # Next.js config + PWA
```

## 🔧 Tehnologii Utilizate

- **Framework:** Next.js 15 (App Router)
- **Styling:** TailwindCSS
- **PWA:** next-pwa
- **TypeScript:** Type-safe development
- **Storage:** localStorage + Supabase (optional)
- **Auth:** Supabase Auth (magic links)

## 📊 Funcționalități Detaliate

### Checklist Zilnic
- 3 secțiuni: Activitate, Dietă, Medicație
- Checkbox-uri animate
- Progress bar în timp real
- Mesaj de felicitare când e complet
- Salvare automată (local + cloud dacă e configurat)

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
- Profil (nume)
- Schimbare limbă (RO/EN)
- **Cloud Sync** - Sign in/out, sincronizare manuală
- Șterge toate datele
- Vizualizare disclaimer medical

### Cloud Sync
- **Magic Link Authentication** - Sign in fără parolă
- **Auto-sync** - Datele se sincronizează automat când ești conectat
- **Multi-device** - Accesează datele de pe orice dispozitiv
- **Offline-first** - Funcționează offline, sync când revii online
- **Privacy** - Datele tale, controlul tău (poți exporta/șterge oricând)

## ⚠️ Disclaimer Medical

Această aplicație este doar în scop informativ și nu înlocuiește sfatul medical profesional, diagnosticul sau tratamentul. Consultați întotdeauna medicul înainte de a face modificări la medicație, dietă sau rutina de exerciții.

## 🔮 Arhitectură Cloud Sync

### Cum Funcționează

1. **Local-First**: Toate datele se salvează întâi în localStorage
2. **Background Sync**: Când ești autentificat, datele se sincronizează automat cu Supabase
3. **Conflict Resolution**: Ultima scriere câștigă (cloud overwrite local la sign-in)
4. **Offline Support**: Funcționează perfect offline, sync când ești din nou online

### Flux de Date

```
User Action → localStorage (instant) → Supabase (background)
                    ↓
              UI Update (instant)
```

La Sign-In:
```
Supabase → Descarcă toate datele → localStorage → UI Update
```

## 📝 TODO / Funcționalități Viitoare

- [ ] Notificări push Web
- [ ] Conflict resolution mai avansat (merge, nu overwrite)
- [ ] Partajare date cu doctorul (link read-only)
- [ ] Grafice mai avansate
- [ ] Reminder-uri personalizabile pe element
- [ ] Teme de culori personalizabile
- [ ] Rapoarte săptămânale/lunare
- [ ] Export date (când era nevoie pentru backup)

## 🤝 Contribuții

Contribuțiile sunt binevenite! Deschide un issue sau pull request.

## 📄 Licență

MIT License

---

**Made with ❤️ pentru sănătate mai bună**
