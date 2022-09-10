import { Platform, Linking, Alert } from 'react-native';
import {
  check,
  PERMISSIONS,
  request,
  RESULTS,
  PermissionStatus,
} from 'react-native-permissions';

import { permissionsAndroid, permissionsIos } from '@src/hashmaps/permissions';

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

const getPermissions = async (): Promise<PermissionStatus> => {
  let result: PermissionStatus;

  Platform.OS === 'android'
    ? (result = await check(permissionsAndroid['gallery']))
    : (result = await check(permissionsIos['gallery']));

  switch (result) {
    case RESULTS.UNAVAILABLE:
      await request(
        Platform.OS === 'android'
          ? permissionsAndroid['gallery']
          : permissionsIos['gallery'],
      );
      break;
    case RESULTS.DENIED:
      const status = await request(
        Platform.OS === 'android'
          ? permissionsAndroid['gallery']
          : permissionsIos['gallery'],
      );

      if (status === 'blocked' && Platform.OS === 'android') {
        blockedPermission();
      }

      break;
    case RESULTS.LIMITED:
      await request(
        Platform.OS === 'android'
          ? permissionsAndroid['gallery']
          : permissionsIos['gallery'],
      );
      break;
    case RESULTS.BLOCKED:
      blockedPermission();
      break;
  }

  return result;
};

export default getPermissions;
