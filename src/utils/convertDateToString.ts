const months = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];

const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

export function convertDateToString(date: Date) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = months[currentDate.getMonth()];
  const currentDayOfMonth = currentDate.getDate();
  const currentIndexDay = currentDate.getDay();

  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const dayOfMonth = date.getDate();
  const indexDay = date.getDay();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Si le message a été envoyé dans la même journée
  const sameDay =
    dayOfMonth === currentDayOfMonth && month === currentMonth && year === currentYear;

  if (sameDay) {
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  }

  // Si le message a été envoyé dans la semaine
  const nDays = currentIndexDay - indexDay;
  const dayOfMonthForSameCurrentDay = dayOfMonth + nDays === currentDayOfMonth;
  const sameWeek =
    year === currentYear && month === currentMonth && nDays >= 0 && dayOfMonthForSameCurrentDay;

  if (sameWeek) {
    return `${days[indexDay]} ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  }

  // Sinon
  return `${dayOfMonth} ${month} ${year} à ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
}
