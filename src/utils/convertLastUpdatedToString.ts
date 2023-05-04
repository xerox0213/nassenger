export function convertLastUpdatedToString(date: Date) {
  const currentDate = new Date();
  const currentMilisElapsed = currentDate.getTime();
  const messageMilisElapsed = date.getTime();
  const milisElapsed = currentMilisElapsed - messageMilisElapsed;

  const hourInMilis = 3600000;
  if (milisElapsed < hourInMilis) {
    return `${milisToMinutes(milisElapsed)} min`;
  }

  const dayInMilis = 86400000;
  if (milisElapsed >= hourInMilis && milisElapsed < dayInMilis) {
    return `${milisToHours(milisElapsed)} h`;
  }

  const weekInMilis = 604800000;
  if (milisElapsed >= dayInMilis && milisElapsed < weekInMilis) {
    return `${milisToDays(milisElapsed)} j`;
  }

  return `${milisToWeeks(milisElapsed)} sem`;
}

function milisToMinutes(milis: number) {
  const minutes = Math.floor(milis / 1000 / 60);
  if (minutes === 0) {
    return '1';
  } else {
    return minutes;
  }
}

function milisToHours(milis: number) {
  const hours = Math.floor(milis / 1000 / 60 / 60);
  return hours;
}

function milisToDays(milis: number) {
  const days = Math.floor(milis / 86400000);
  return days;
}

function milisToWeeks(milis: number) {
  const weeks = Math.floor(milis / 604800000);
  return weeks;
}
