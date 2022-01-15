import { StyleSheet, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';

export const AddButton = styled(TouchableOpacity)({
  position: 'absolute',
  right: 25,
  bottom: 25,
  backgroundColor: 'red',
  width: 50,
  height: 50,
  borderRadius: 50,
});

export const ModalContent = styled(View)({
  backgroundColor: 'blue',
  width: '90%',
  alignItems: 'center',
  padding: 20,
  justifyContent: 'center',
});

export const ModalAddButton = styled(TouchableOpacity)({
  backgroundColor: 'red',
  marginTop: 10,
  width: 20,
  height: 20,
});

export const styles = StyleSheet.create({
  addContactModal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
