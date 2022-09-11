import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
} from 'react-native-image-picker';

const getPictureFromCamera = async (): Promise<ImagePickerResponse> => {
  const options: ImageLibraryOptions = {
    quality: 1,
    mediaType: 'photo',
  };

  const resp = await launchCamera(options);

  console.log(resp);

  return resp;
};

export default getPictureFromCamera;
