import { ImagePickerResponse } from 'react-native-image-picker';

import getPermissions from './getPermissions';
import getPictureFromCamera from './getPictureFromCamera';
import getPictureFromStorage from './getPictureFromStorage';
import { Image } from '@interfaces/image.model';

const handleRetrieveSingleImage = async (
  type: 'camera' | 'gallery',
): Promise<Image | void> => {
  const permissionStatus = await getPermissions(type);

  if (permissionStatus === 'granted') {
    let imagePickerResponse: ImagePickerResponse;

    type === 'camera'
      ? (imagePickerResponse = await getPictureFromCamera())
      : (imagePickerResponse = await getPictureFromStorage());

    if (imagePickerResponse.didCancel) {
      throw new Error('You cancelled the image selection.');
    }

    const asset = imagePickerResponse?.assets?.shift();

    if (!asset || !asset.fileName || !asset.uri) {
      throw new Error('Image not found.');
    }

    return {
      filename: asset.fileName,
      uri: asset.uri,
    };
  }
};

export default handleRetrieveSingleImage;
