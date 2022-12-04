import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface PostDto {
  title: string;
  description: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  updatedAt?: FirebaseFirestoreTypes.Timestamp;
  owner: string;
}
