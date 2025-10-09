import { ChecklistTemplate } from './types';

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
          label: 'Fără băuturi dulci și dulciuri',
          required: true,
        },
        {
          id: 'd2',
          label: 'Fără făină/orez alb (doar integrale)',
          required: true,
        },
        {
          id: 'd3',
          label: 'Fără prăjeli/margarină; gătesc la cuptor sau abur (Airfryer)',
          required: true,
        },
        {
          id: 'd4',
          label: 'Ulei puțin și bun (măsline/rapiță)',
          required: true,
        },
        {
          id: 'd5',
          label: 'Legume ≥4 porții (½ farfurie)',
          required: true,
        },
        {
          id: 'd6',
          label: 'Fructe 1–2 porții (nu suc)',
          required: true,
        },
        {
          id: 'd7',
          label: '≥1 porție pește azi sau săptămâna asta',
          required: true,
        },
        {
          id: 'd8',
          label: 'Apă ≥1,5 L',
          required: true,
        },
        {
          id: 'd9',
          label: 'Fibre ≥25 g',
          required: true,
        },
        {
          id: 'd10',
          label: 'Alcool: 0',
          required: true,
        },
      ],
      minRequired: 8,
    },
    {
      name: 'Medicație',
      items: [
        {
          id: 'm1',
          label: 'Medicație conform prescripției',
          required: true,
        },
      ],
      minRequired: 1,
    },
  ],
};
