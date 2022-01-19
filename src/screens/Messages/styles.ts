import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import styled from 'styled-components';
import { theme } from '../../utils/theme';

export const MessageInput = styled(TextInput)({
  flex: 1,
  fontSize: 20,
  height: 50,
  marginRight: 20,
  borderWidth: 1,
  paddingHorizontal: 20,
  borderRadius: 100,
});

export const SendButton = styled(IconButton)({
  backgroundColor: theme.colors.green,
  width: 45,
  height: 45,
  alignSelf: 'center',
  borderRadius: 100,
});

export const Message = styled(View)({
  maxWidth: '80%',
  paddingHorizontal: 15,
  paddingVertical: 6,
  borderRadius: 25,
});

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  flexContainer: {
    flex: 1,
  },
  inputContainer: {
    height: 50,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  sended: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.lightblue,
  },
  received: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.moodyBlue,
  },
  messageContainer: {
    width: '90%',
    marginBottom: 7,
    alignSelf: 'center',
  },
});
