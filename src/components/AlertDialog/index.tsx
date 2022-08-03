import React from 'react';
import { AlertDialog as NativeBaseAlertDialog, Button } from 'native-base';

type Props = {
  isOpen: boolean;
  onClose: any;
  cancelRef: any;
  title: string;
  message: string;
};

const AlertDialog = ({ isOpen, onClose, cancelRef, title, message }: Props) => {
  return (
    <NativeBaseAlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={isOpen}
      onClose={onClose}>
      <NativeBaseAlertDialog.Content>
        <NativeBaseAlertDialog.CloseButton />
        <NativeBaseAlertDialog.Header bg="gray.600" _text={{ color: 'white' }}>
          {title}
        </NativeBaseAlertDialog.Header>
        <NativeBaseAlertDialog.Body bg="gray.600" _text={{ color: 'white' }}>
          {message}
        </NativeBaseAlertDialog.Body>
        <NativeBaseAlertDialog.Footer bg="gray.600">
          <Button.Group space={2}>
            <Button colorScheme="danger" onPress={onClose}>
              Fechar
            </Button>
          </Button.Group>
        </NativeBaseAlertDialog.Footer>
      </NativeBaseAlertDialog.Content>
    </NativeBaseAlertDialog>
  );
};

export default AlertDialog;
