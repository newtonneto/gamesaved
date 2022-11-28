import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface CommentModel {
  owner: string;
  comment: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  likes: string[];
  dislikes: string[];
}
