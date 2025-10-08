import { ChecklistTemplate, User } from './types';

export const DEFAULT_TEMPLATE: ChecklistTemplate = {
  sections: [
    {
      name: 'Activitate',
      items: [
        {
          id: 'act-1',
          label: 'Mers sau alergat 15 minute',
          required: true,
        },
        {
          id: 'act-2',
          label: '20 genuflexiuni',
          required: true,
        },
        {
          id: 'act-3',
          label: '5 flotări',
          required: true,
        },
        {
          id: 'act-4',
          label: '3×30s urcat scări sau mers rapid',
          required: false,
        },
        {
          id: 'act-5',
          label: '5 minute exerciții core/mobilitate',
          required: false,
        },
      ],
      minRequired: 3,
    },
    {
      name: 'Dietă',
      items: [
        {
          id: 'diet-1',
          label: 'Fără alcool astăzi',
          required: true,
        },
        {
          id: 'diet-2',
          label: 'Mai puțin de 25g zahăr adăugat',
          required: true,
        },
        {
          id: 'diet-3',
          label: 'Carbohidrați rafinați ≤ 1 porție',
          required: true,
        },
        {
          id: 'diet-4',
          label: 'Alege grăsimi nesaturate',
          required: true,
        },
        {
          id: 'diet-5',
          label: 'Sursă de Omega-3',
          required: false,
        },
        {
          id: 'diet-6',
          label: 'Regula farfuriei: ½ legume, ¼ proteine, ¼ cereale integrale',
          required: true,
        },
        {
          id: 'diet-7',
          label: '6-8 pahare de apă',
          required: true,
        },
      ],
      minRequired: 5,
    },
    {
      name: 'Medicație',
      items: [
        {
          id: 'med-1',
          label: 'Ai luat medicația prescrisă astăzi?',
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
