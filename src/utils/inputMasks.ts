export const handleDateMask = (date: string): string => {
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

export const handlePhoneMask = (phone: string): string => {
  let maskedPhone = phone;

  if (phone.length === 1 && phone[0] !== '(') {
    maskedPhone = `(${phone[0]}`;
  }

  if (phone.length === 4 && phone[3] !== ')') {
    const splitedPhone: string[] = [phone.slice(0, 3), phone.slice(3)];
    maskedPhone = `${splitedPhone[0]}) ${splitedPhone[1]}`;
  } else if (phone.length === 5 && phone[4] !== ' ') {
    const splitedPhone: string[] = [phone.slice(0, 4), phone.slice(4)];
    maskedPhone = `${splitedPhone[0]} ${splitedPhone[1]}`;
  }

  if (phone.length === 7 && phone[6] !== ' ') {
    const splitedPhone: string[] = [phone.slice(0, 6), phone.slice(6)];
    maskedPhone = `${splitedPhone[0]} ${splitedPhone[1]}`;
  }

  if (phone.length === 12 && phone[11] !== '-') {
    const splitedPhone: string[] = [phone.slice(0, 11), phone.slice(11)];
    maskedPhone = `${splitedPhone[0]}-${splitedPhone[1]}`;
  }

  return maskedPhone;
};
