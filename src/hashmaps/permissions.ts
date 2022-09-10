import { PERMISSIONS } from 'react-native-permissions';

export const permissionsAndroid = {
  gallery: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  camera: PERMISSIONS.ANDROID.CAMERA,
};

export const permissionsIos = {
  gallery: PERMISSIONS.IOS.PHOTO_LIBRARY,
  camera: PERMISSIONS.IOS.CAMERA,
};
