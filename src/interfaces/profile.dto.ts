export interface ProfileDto {
  birthDate: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  username: string;
  psnId: string;
  xboxGamertag: string;
  nintendoAccount: string;
  steamProfile: string;
}
