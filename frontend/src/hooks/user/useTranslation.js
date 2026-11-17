import { useTheme } from '../../context/ThemeContext.jsx';
import { getTranslation } from '../../services/user/translations.js';

export const useTranslation = () => {
  const { language, setLanguage, toggleLanguage } = useTheme();

  const t = (keyPath, fallback = '') => {
    return getTranslation(keyPath, language, fallback);
  };

  return {
    t,
    language,
    setLanguage,
    toggleLanguage,
    isMalayalam: language === 'ml'
  };
};

export default useTranslation;
