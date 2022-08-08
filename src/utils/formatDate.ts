export const formatDate = (stringDate: string) => {
  if (!stringDate) {
    return stringDate;
  }

  const splitedDate = stringDate.split('-');

  if (splitedDate.length !== 3) {
    return stringDate;
  }

  const year = parseInt(splitedDate[0], 10);
  const month = parseInt(splitedDate[1], 10);
  const day = parseInt(splitedDate[2], 10);

  if (!year || !month || !day) {
    return stringDate;
  }

  return new Date(year, month, day).toLocaleDateString('pt-BR');
};
