export const getLanguageCode = (language) => {
    const languageMap = {
      English: 'en',
      German: 'de',
      French: 'fr',
      Italian: 'it',
      Spanish: 'es'
    };
     
    return languageMap[language] || 'en';
  };