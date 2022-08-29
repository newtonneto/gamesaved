const firebaseExceptions: { [key: string]: string } = {
  'auth/invalid-email': 'E-mail inválido',
  'auth/wrong-password': 'E-mail ou senha inválida',
  'auth/user-not-found': 'Usuário não encontrado',
  'auth/email-already-in-use': 'E-mail já cadastrado',
  'storage/unauthorized': 'Usuário não autorizado',
};

export default firebaseExceptions;
