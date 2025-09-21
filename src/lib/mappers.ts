export function mapWeatherCodeToLabelEmoji(code: number): { label: string; emoji: string } {
  if ([0].includes(code)) return { label: 'Ensoleillé', emoji: '☀️' };
  if ([1, 2, 3].includes(code)) return { label: 'Partiellement nuageux', emoji: '🌤️' };
  if ([45, 48].includes(code)) return { label: 'Brouillard', emoji: '🌫️' };
  if ([51, 53, 55, 56, 57].includes(code)) return { label: 'Bruine', emoji: '🌦️' };
  if ([61, 63, 65].includes(code)) return { label: 'Pluie', emoji: '🌧️' };
  if ([66, 67].includes(code)) return { label: 'Pluie verglaçante', emoji: '🌧️❄️' };
  if ([71, 73, 75, 77].includes(code)) return { label: 'Neige', emoji: '🌨️' };
  if ([80, 81, 82].includes(code)) return { label: 'Averses', emoji: '🌧️' };
  if ([85, 86].includes(code)) return { label: 'Averses de neige', emoji: '🌨️' };
  if ([95].includes(code)) return { label: 'Orage', emoji: '⛈️' };
  if ([96, 99].includes(code)) return { label: 'Orage (grêle)', emoji: '⛈️🧊' };
  return { label: 'Inconnu', emoji: '❓' };
}
