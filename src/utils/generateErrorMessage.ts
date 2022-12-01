export const generateErrorMessage = (
  error: any,
  defaultMessage: string,
): string => {
  let errorMessage = '';

  if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = defaultMessage;
  }

  return errorMessage;
};
