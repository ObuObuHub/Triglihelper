import { ChecklistTemplate, User } from './types';

export const DEFAULT_TEMPLATE: ChecklistTemplate = {
  sections: [
    {
      name: 'Activity',
      nameRo: 'Activitate',
      items: [
        {
          id: 'act-1',
          label: 'Walk or jog 15 minutes',
          labelRo: 'Mers sau alergat 15 minute',
          required: true,
        },
        {
          id: 'act-2',
          label: '20 squats',
          labelRo: '20 genuflexiuni',
          required: true,
        },
        {
          id: 'act-3',
          label: '5 push-ups',
          labelRo: '5 flotări',
          required: true,
        },
        {
          id: 'act-4',
          label: '3×30s brisk stair climb or fast walk intervals',
          labelRo: '3×30s urcat scări sau mers rapid',
          required: false,
        },
        {
          id: 'act-5',
          label: '5 minutes core/mobility exercises',
          labelRo: '5 minute exerciții core/mobilitate',
          required: false,
        },
      ],
      minRequired: 3,
    },
    {
      name: 'Diet',
      nameRo: 'Dietă',
      items: [
        {
          id: 'diet-1',
          label: 'No alcohol today',
          labelRo: 'Fără alcool astăzi',
          required: true,
        },
        {
          id: 'diet-2',
          label: 'Less than 25g added sugar',
          labelRo: 'Mai puțin de 25g zahăr adăugat',
          required: true,
        },
        {
          id: 'diet-3',
          label: 'Refined carbs ≤ 1 serving',
          labelRo: 'Carbohidrați rafinați ≤ 1 porție',
          required: true,
        },
        {
          id: 'diet-4',
          label: 'Choose unsaturated fats',
          labelRo: 'Alege grăsimi nesaturate',
          required: true,
        },
        {
          id: 'diet-5',
          label: 'Omega-3 source',
          labelRo: 'Sursă de Omega-3',
          required: false,
        },
        {
          id: 'diet-6',
          label: 'Plate rule: ½ vegetables, ¼ protein, ¼ whole grains',
          labelRo: 'Regula farfuriei: ½ legume, ¼ proteine, ¼ cereale integrale',
          required: true,
        },
        {
          id: 'diet-7',
          label: '6-8 glasses of water',
          labelRo: '6-8 pahare de apă',
          required: true,
        },
      ],
      minRequired: 5,
    },
    {
      name: 'Medication',
      nameRo: 'Medicație',
      items: [
        {
          id: 'med-1',
          label: 'Did you take your prescribed medication today?',
          labelRo: 'Ai luat medicația prescrisă astăzi?',
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
  locale: 'ro',
  reminderTimes: ['08:00', '13:00', '20:00'],
  disclaimerAccepted: false,
};
