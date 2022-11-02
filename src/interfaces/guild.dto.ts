import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface GuildDto {
  uuid: string;
  name: string;
  bannerRef: string;
  description: string;
  members: string[];
  owner: string;
  createdAt: FirebaseFirestoreTypes.FieldValue;
  warCry: string;
}
