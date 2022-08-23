const getImageType = (item: String): String => {
  const splitedItem = item.split('.');

  return splitedItem[splitedItem.length - 1];
};

export default getImageType;
