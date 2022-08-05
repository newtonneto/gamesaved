export const handleDateMask = (date: string) => {
  let maskedDate = date;

  if (date.length >= 3 && date[2] !== '/') {
    const splitedDate: string[] = [date.slice(0, 2), date.slice(2)];
    maskedDate = `${splitedDate[0]}/${splitedDate[1]}`;
  }

  if (date.length >= 6 && date[5] !== '/') {
    const splitedDate: string[] = [date.slice(0, 5), date.slice(5)];
    maskedDate = `${splitedDate[0]}/${splitedDate[1]}`;
  }

  return maskedDate;
};
