import { Platform, Linking, Alert } from 'react-native';
import {
  check,
  request,
  RESULTS,
  PermissionStatus,
} from 'react-native-permissions';

import { permissionsAndroid, permissionsIos } from '@hashmaps/permissions';

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

const getPermissions = async (type: string): Promise<PermissionStatus> => {
  let result: PermissionStatus;

  result =
    Platform.OS === 'android'
      ? await check(permissionsAndroid[type])
      : await check(permissionsIos[type]);

  switch (result) {
    case RESULTS.UNAVAILABLE:
      await request(
        Platform.OS === 'android'
          ? permissionsAndroid[type]
          : permissionsIos[type],
      );
      break;
    case RESULTS.DENIED:
      const status = await request(
        Platform.OS === 'android'
          ? permissionsAndroid[type]
          : permissionsIos[type],
      );

      if (status === 'blocked' && Platform.OS === 'android') {
        blockedPermission();
      }

      break;
    case RESULTS.LIMITED:
      await request(
        Platform.OS === 'android'
          ? permissionsAndroid[type]
          : permissionsIos[type],
      );
      break;
    case RESULTS.BLOCKED:
      blockedPermission();
      break;
  }

  return result;
};

export default getPermissions;
