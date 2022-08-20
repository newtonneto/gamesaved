export const handleDateMask = (date: string): string => {
  let maskedDate = date;

  if (!date) {
    return date;
  }

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

export const handlePhoneMask = (phone: string): string => {
  if (!phone) {
    return phone;
  }

  phone = phone.replace(/\D/g, '');
  phone = phone.replace(/^(\d\d)(\d)/g, '($1) $2');
  phone = phone.replace(/(\d{5})(\d)/, '$1-$2');

  return phone;
};
