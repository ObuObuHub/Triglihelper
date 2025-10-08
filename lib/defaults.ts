import { ChecklistTemplate, User, TargetConfig } from './types';

export const DEFAULT_TARGETS: TargetConfig = {
  fiber: 25, // grams
  water: 1.5, // liters
};

export const DEFAULT_TEMPLATE: ChecklistTemplate = {
  sections: [
    {
      name: 'Activitate',
      items: [
        {
          id: 'a1',
          label: '≥30 min activitate aerobă (mers alert/jog/ciclat/înot)',
          required: true,
        },
        {
          id: 'a2',
          label: '7–10k pași astăzi',
          required: true,
        },
        {
          id: 'a3',
          label: '2–3 plimbări de 5 min după mese',
          required: true,
        },
        {
          id: 'a4',
          label: 'Antrenament de forță (genuflexiuni/flotări/fandări)',
          required: true,
        },
      ],
      minRequired: 3,
    },
    {
      name: 'Dietă',
      items: [
        {
          id: 'd1',
          label: 'Zero băuturi îndulcite/zero sucuri de fructe',
          required: true,
        },
        {
          id: 'd2',
          label: 'Zero făină/orez alb, zero dulciuri/produse de patiserie',
          required: true,
        },
        {
          id: 'd3',
          label: '≥4 porții legume',
          required: true,
        },
        {
          id: 'd4',
          label: 'Fructe întregi ≤2 porții (nu suc)',
          required: true,
        },
        {
          id: 'd5',
          label: 'Leguminoase ≥1 porție (linte/fasole/năut)',
          required: true,
        },
        {
          id: 'd6',
          label: 'Cereale integrale ≥3 porții (ovăz/orez brun/quinoa/pâine integrală)',
          required: true,
        },
        {
          id: 'd7',
          label: 'Nuci/semințe ≥1 porție (in/chia/nuci)',
          required: true,
        },
        {
          id: 'd8',
          label: 'Pește gras astăzi SAU programat în săptămână',
          required: true,
        },
        {
          id: 'd9',
          label: 'Gătit: cuptor/abur/grătar/înăbușit (fără prăjeli)',
          required: true,
        },
      ],
      minRequired: 6,
    },
    {
      name: 'Medicație',
      items: [
        {
          id: 'm1',
          label: 'Medicație conform prescripției (azi)',
          required: true,
        },
      ],
      minRequired: 1,
    },
    {
      name: 'Siguranță',
      items: [
        {
          id: 's1',
          label: 'Zi fără alcool (obligatoriu dacă TG ≥500 mg/dL)',
          required: true,
        },
      ],
      minRequired: 1,
    },
  ],
};

export const DEFAULT_USER: User = {
  id: 'user-1',
  name: '',
  reminderTimes: ['08:00', '13:00', '20:00'],
};
