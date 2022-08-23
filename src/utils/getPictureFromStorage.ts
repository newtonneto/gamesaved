import {
  launchImageLibrary,
  ImageLibraryOptions,
} from 'react-native-image-picker';

const getPictureFromStorage = async () => {
  const options: ImageLibraryOptions = {
    quality: 1,
    mediaType: 'photo',
  };

  const result = await launchImageLibrary(options);

  console.log('result: ', result);
};

export default getPictureFromStorage;
