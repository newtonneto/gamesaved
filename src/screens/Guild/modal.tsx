import React from 'react';
import { Alert, Modal } from 'react-native';
import { Pressable, VStack } from 'native-base';
import { Controller, useForm } from 'react-hook-form';
import firestore from '@react-native-firebase/firestore';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Input from '@components/Input';
import Button from '@components/Button';
import { NO_LABEL_INPUT_MARGIN_BOTTOM } from '@utils/constants';

type Props = {
  visible: boolean;
  setVisible: (value: boolean) => void;
  guildUuid: string;
};

type FormData = {
  title: string;
  description: string;
};

const schema = yup.object().shape({
  title: yup.string().required('Prenchimento obrigatorio'),
  description: yup.string().required('Prenchimento obrigatorio'),
});

const PostModal = ({ visible, setVisible, guildUuid }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const toggleModal = () => {
    setVisible(!visible);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const { id } = await firestore().collection('posts').add({
        title: data.title,
        description: data.description,
      });

      await firestore()
        .collection('guilds')
        .doc(guildUuid)
        .update({
          posts: firestore.FieldValue.arrayUnion(id),
        });

      Alert.alert('=D', 'Post published!', [
        {
          text: 'Ok',
          onPress: toggleModal,
        },
      ]);
    } catch (err) {
      Alert.alert('>.<', 'Something went wrong', [
        {
          text: 'Ok',
        },
        {
          text: 'Tentar novamente',
          onPress: () => onSubmit(data),
        },
      ]);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={toggleModal}>
      <Pressable
        alignItems="center"
        justifyContent="center"
        bg="rgba(0, 0, 0, 0.6)"
        flex={1}
        onPress={toggleModal}>
        <VStack w="90%" bgColor="gray.500" borderRadius={16} p={8}>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Title"
                mb={NO_LABEL_INPUT_MARGIN_BOTTOM}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Content"
                multiline
                textAlignVertical="top"
                h={200}
                mb={NO_LABEL_INPUT_MARGIN_BOTTOM}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          <Button title="Enviar" onPress={handleSubmit(onSubmit)} />
        </VStack>
      </Pressable>
    </Modal>
  );
};

export default PostModal;
