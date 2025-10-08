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
          label: 'Zi fără alcool',
          required: true,
        },
        {
          id: 'd2',
          label: 'Zero băuturi îndulcite/sucuri',
          required: true,
        },
        {
          id: 'd3',
          label: 'Zero făină/orez alb, dulciuri',
          required: true,
        },
        {
          id: 'd4',
          label: '≥4 porții legume',
          required: true,
        },
        {
          id: 'd5',
          label: 'Fructe întregi ≤2 porții',
          required: true,
        },
        {
          id: 'd6',
          label: 'Leguminoase ≥1 porție',
          required: true,
        },
        {
          id: 'd7',
          label: 'Cereale integrale ≥3 porții',
          required: true,
        },
        {
          id: 'd8',
          label: 'Nuci/semințe ≥1 porție',
          required: true,
        },
        {
          id: 'd9',
          label: 'Pește gras (astăzi sau programat)',
          required: true,
        },
        {
          id: 'd10',
          label: 'Gătit sănătos (cuptor/abur/grătar)',
          required: true,
        },
        {
          id: 'd11',
          label: 'Fibre ≥25g',
          required: true,
        },
        {
          id: 'd12',
          label: 'Apă ≥1.5L',
          required: true,
        },
      ],
      minRequired: 9,
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

export const DEFAULT_USER: User = {
  id: 'user-1',
  name: '',
  reminderTimes: ['08:00', '13:00', '20:00'],
};
