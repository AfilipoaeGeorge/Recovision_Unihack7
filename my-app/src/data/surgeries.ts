export type Treatment = {
  name: string;
  dosage: string;
  schedule: string;
};

export type Surgery = {
  id: string;
  title: string;
  date: string;
  doctor: string;
  description: string;
  treatments: Treatment[];
  scarImages: string[];
  status: string;
};

export const surgeries: Surgery[] = [
  {
    id: '1',
    title: 'Anterior Cruciate Ligament Reconstruction',
    date: 'Nov 12, 2025',
    doctor: 'Dr. Adina Marinescu',
    description:
      'Patient is stable post-op. Knee is immobilized for 24h, slight swelling observed. Pain managed with mild analgesics, patient responsive and oriented.',
    treatments: [
      { name: 'Ibuprofen', dosage: '400 mg', schedule: '08:00' },
      { name: 'Enoxaparin', dosage: '40 mg', schedule: '20:00' },
      { name: 'Vitamin C', dosage: '500 mg', schedule: '13:00' },
    ],
    scarImages: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=60',
      'https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&w=600&q=60',
    ],
    status: 'Recovery - week 3',
  },
  {
    id: '2',
    title: 'Meniscus Repair',
    date: 'Oct 28, 2025',
    doctor: 'Dr. Mihai Creța',
    description:
      'Sutures intact, no bleeding. Patient reports mild stiffness and is encouraged to start passive flexion exercises. Hydration and rest recommended.',
    treatments: [
      { name: 'Paracetamol', dosage: '1 g', schedule: '07:30' },
      { name: 'Amoxicillin', dosage: '500 mg', schedule: '11:30' },
      { name: 'Ice Therapy', dosage: '20 min', schedule: 'Every 4h' },
    ],
    scarImages: [
      'https://images.unsplash.com/photo-1504439904031-93ded9f93e1b?auto=format&fit=crop&w=600&q=60',
      'https://images.unsplash.com/photo-1500522144261-ea64433bbe27?auto=format&fit=crop&w=600&q=60',
    ],
    status: 'Completed',
  },
  {
    id: '3',
    title: 'Femur Fracture Fixation',
    date: 'Jan 18, 2025',
    doctor: 'Dr. Oana Rusu',
    description:
      'Patient discharged with crutches. Swelling moderate, no signs of infection. Weekly physiotherapy recommended for mobility restoration.',
    treatments: [
      { name: 'Diclofenac', dosage: '75 mg', schedule: '09:00' },
      { name: 'Calcium supplement', dosage: '1000 mg', schedule: '18:00' },
    ],
    scarImages: [
      'https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&w=600&q=60',
    ],
    status: 'Completed',
  },
];

export const getSurgeryById = (id: string) => surgeries.find((surgery) => surgery.id === id);

export const currentSurgery = surgeries[0];

