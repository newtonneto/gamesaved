import { Platform, Linking, Alert } from 'react-native';
import {
  check,
  PERMISSIONS,
  request,
  RESULTS,
  PermissionStatus,
} from 'react-native-permissions';

const blockedPermission = () => {
  Alert.alert(
    'x_x',
    'Você bloqueou o acesso a galeria de fotos, caso deseje enviar alguma foto da sua galeria é necessário liberar o acesso.',
    [
      {
        text: 'Configurações',
        onPress: () => Linking.openSettings(),
      },
      {
        text: 'Cancelar',
        style: 'cancel',
      },
    ],
  );
};

const handleGalleryPermissions = async (): Promise<PermissionStatus> => {
  let result: PermissionStatus;

  if (Platform.OS === 'android') {
    result = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
  } else {
    result = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
  }

  switch (result) {
    case RESULTS.UNAVAILABLE:
      await request(
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
          : PERMISSIONS.IOS.PHOTO_LIBRARY,
      );
      break;
    case RESULTS.DENIED:
      (await request(
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
          : PERMISSIONS.IOS.PHOTO_LIBRARY,
      )) === 'blocked' &&
        Platform.OS === 'android' &&
        blockedPermission();

      break;
    case RESULTS.LIMITED:
      await request(
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
          : PERMISSIONS.IOS.PHOTO_LIBRARY,
      );
      break;
    case RESULTS.BLOCKED:
      blockedPermission();
      break;
  }

  return result;
};

export default handleGalleryPermissions;
