export type Treatment = {
  nameKey: string; // Key for translation instead of hardcoded name
  dosage: string;
  schedule: string;
};

export type Surgery = {
  id: string;
  titleKey: string; // Key for translation instead of hardcoded title
  date: string;
  doctor: string;
  descriptionKey: string; // Key for translation instead of hardcoded description
  treatments: Treatment[];
  scarImages: string[];
  status: string;
};

export const surgeries: Surgery[] = [
  {
    id: '1',
    titleKey: 'surgery.1.title',
    date: 'Nov 12, 2025',
    doctor: 'Dr. Adina Marinescu',
    descriptionKey: 'surgery.1.description',
    treatments: [
      { nameKey: 'treatment.ibuprofen', dosage: '400 mg', schedule: '08:00' },
      { nameKey: 'treatment.enoxaparin', dosage: '40 mg', schedule: '20:00' },
      { nameKey: 'treatment.vitaminC', dosage: '500 mg', schedule: '13:00' },
    ],
    scarImages: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=60',
      'https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&w=600&q=60',
    ],
    status: 'Recovery - week 3',
  },
  {
    id: '2',
    titleKey: 'surgery.2.title',
    date: 'Oct 28, 2025',
    doctor: 'Dr. Mihai Creța',
    descriptionKey: 'surgery.2.description',
    treatments: [
      { nameKey: 'treatment.paracetamol', dosage: '1 g', schedule: '07:30' },
      { nameKey: 'treatment.amoxicillin', dosage: '500 mg', schedule: '11:30' },
      { nameKey: 'treatment.iceTherapy', dosage: '20 min', schedule: 'Every 4h' },
    ],
    scarImages: [
      'https://images.unsplash.com/photo-1504439904031-93ded9f93e1b?auto=format&fit=crop&w=600&q=60',
      'https://images.unsplash.com/photo-1500522144261-ea64433bbe27?auto=format&fit=crop&w=600&q=60',
    ],
    status: 'Completed',
  },
  {
    id: '3',
    titleKey: 'surgery.3.title',
    date: 'Jan 18, 2025',
    doctor: 'Dr. Oana Rusu',
    descriptionKey: 'surgery.3.description',
    treatments: [
      { nameKey: 'treatment.diclofenac', dosage: '75 mg', schedule: '09:00' },
      { nameKey: 'treatment.calciumSupplement', dosage: '1000 mg', schedule: '18:00' },
    ],
    scarImages: [
      'https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&w=600&q=60',
    ],
    status: 'Completed',
  },
];

export const getSurgeryById = (id: string) => surgeries.find((surgery) => surgery.id === id);

export const currentSurgery = surgeries[0];

