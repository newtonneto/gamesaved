const getImageType = (item: String): String | void => {
  const splitedItem = item.split('.');

  return splitedItem.pop();
};

export default getImageType;
