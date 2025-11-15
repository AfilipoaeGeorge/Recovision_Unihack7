import { useTranslation } from './useTranslation';

/**
 * Translates surgery title based on surgery ID
 */
export function useSurgeryTranslation(surgeryId: string) {
  const t = useTranslation();
  
  return {
    getTitle: () => {
      const key = `surgery.${surgeryId}.title` as any;
      return t(key) || '';
    },
    getDescription: () => {
      const key = `surgery.${surgeryId}.description` as any;
      return t(key) || '';
    },
  };
}

/**
 * Helper function to translate surgery title (for use in loops)
 */
export function getTranslatedSurgeryTitle(t: (key: string) => string, surgeryId: string, fallback: string): string {
  const key = `surgery.${surgeryId}.title` as any;
  return t(key) || fallback;
}

/**
 * Helper function to translate surgery description (for use in loops)
 */
export function getTranslatedSurgeryDescription(t: (key: string) => string, surgeryId: string, fallback: string): string {
  const key = `surgery.${surgeryId}.description` as any;
  return t(key) || fallback;
}

/**
 * Translates treatment name
 */
export function translateTreatmentName(name: string): string {
  // Create a simple mapping for treatment names to translation keys
  const treatmentMap: Record<string, string> = {
    'Ibuprofen': 'treatment.ibuprofen',
    'Enoxaparin': 'treatment.enoxaparin',
    'Vitamin C': 'treatment.vitaminC',
    'Paracetamol': 'treatment.paracetamol',
    'Amoxicillin': 'treatment.amoxicillin',
    'Ice Therapy': 'treatment.iceTherapy',
    'Diclofenac': 'treatment.diclofenac',
    'Calcium supplement': 'treatment.calciumSupplement',
  };

  return treatmentMap[name] || name;
}

