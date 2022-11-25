import React from 'react';
import { Modal, Text } from 'react-native';
import { Pressable, VStack } from 'native-base';

import Input from '@components/Input';
import Button from '@components/Button';
import { NO_LABEL_INPUT_MARGIN_BOTTOM } from '@utils/constants';

type Props = {
  visible: boolean;
  setVisible: (value: boolean) => void;
};

const PostModal = ({ visible, setVisible }: Props) => {
  const toggleModal = () => {
    setVisible(!visible);
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
          <Input placeholder="Title" mb={NO_LABEL_INPUT_MARGIN_BOTTOM} />
          <Input
            placeholder="Content"
            multiline
            textAlignVertical="top"
            h={200}
            mb={NO_LABEL_INPUT_MARGIN_BOTTOM}
          />
          <Button title="Enviar" />
        </VStack>
      </Pressable>
    </Modal>
  );
};

export default PostModal;
