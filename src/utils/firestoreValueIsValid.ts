const firestoreValueIsValid = (avatarRef: string): boolean => {
  return avatarRef !== '' && avatarRef !== undefined && avatarRef !== null;
};

export default firestoreValueIsValid;
