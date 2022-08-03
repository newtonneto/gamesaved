const firebaseExceptions: { [key: string]: string } = {
  'auth/invalid-email': 'E-mail inválido',
  'auth/wrong-password': 'E-mail ou senha inválida',
  'auth/user-not-found': 'E-mail ou senha inválida',
  'auth/email-already-in-use': 'E-mail já cadastrado',
};

export default firebaseExceptions;
