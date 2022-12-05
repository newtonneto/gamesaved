import NativeFirebaseError from '@react-native-firebase/firestore';

import firebaseExceptions from '@hashmaps/firebaseExceptions';

export const generateErrorMessage = (
  error: any,
  defaultMessage: string,
): string => {
  let errorMessage = '';

  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (error instanceof NativeFirebaseError) {
    console.log('???');

    firebaseExceptions[error.code]
      ? (errorMessage = firebaseExceptions[error.code])
      : (errorMessage = defaultMessage);
  } else {
    errorMessage = defaultMessage;
  }

  return errorMessage;
};
