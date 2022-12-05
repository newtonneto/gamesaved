import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface GuildDto {
  name: string;
  bannerRef: string;
  description: string;
  members: string[];
  owner: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  warCry: string;
  posts: string[];
}
