const firestoreValueIsValid = (value: string): boolean => {
  return value !== '' && value !== undefined && value !== null;
};

export default firestoreValueIsValid;
