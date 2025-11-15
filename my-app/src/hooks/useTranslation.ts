import { translations, TranslationKey } from '../i18n/translations';
import { useSettings } from '../context/SettingsContext';

export function useTranslation() {
  const { language } = useSettings();
  return (key: TranslationKey) => translations[language][key] ?? key;
}

