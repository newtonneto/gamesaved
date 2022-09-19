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

  return launchCamera(options);
};

export default getPictureFromCamera;
