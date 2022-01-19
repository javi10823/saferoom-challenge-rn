import {
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import styled from 'styled-components';
import { theme } from '../../utils/theme';

export const AddButton = styled(IconButton)({
  position: 'absolute',
  right: 25,
  bottom: 25,
  backgroundColor: theme.colors.lightblue,
  width: 50,
  height: 50,
  borderRadius: 50,
  justifyContent: 'center',
  alignItems: 'center',
});

export const ModalContent = styled(View)({
  backgroundColor: theme.colors.white,
  borderRadius: 10,
  width: '90%',
  alignItems: 'center',
  padding: 20,
  justifyContent: 'center',
});

export const ModalButton = styled(TouchableOpacity)(
  ({ color = theme.colors.green }: { color?: string }) => ({
    backgroundColor: color,
    borderRadius: 25,
    marginTop: 10,
    padding: 10,
  }),
);

export const NewContactInput = styled(TextInput)({
  borderWidth: 1,
  width: '100%',
  padding: 10,
  borderRadius: 20,
});

export const ModalBackground = styled(Pressable)({
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%',
});

export const Contact = styled(TouchableOpacity)({
  marginVertical: 5,
  height: 65,
  backgroundColor: theme.colors.gainsboro,
  borderRadius: 10,
  marginHorizontal: 10,
  padding: 10,
  marginBottom: 10,
});
1;
export const styles = StyleSheet.create({
  addContactModal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  modalButtonText: {
    color: theme.colors.white,
    fontWeight: '700',
  },
  modal: {
    margin: 0,
  },
  contactName: {
    fontSize: 20,
    fontWeight: '700',
  },
  lastMessage: {
    paddingLeft: 10,
  },
});
