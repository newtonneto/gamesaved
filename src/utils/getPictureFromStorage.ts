import {
  launchImageLibrary,
  ImageLibraryOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';

const getPictureFromStorage = async (): Promise<ImagePickerResponse> => {
  const options: ImageLibraryOptions = {
    quality: 1,
    mediaType: 'photo',
  };

  return launchImageLibrary(options);
};

export default getPictureFromStorage;
