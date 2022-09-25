export interface ProfileDto {
  birthDate: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email: string;
}
