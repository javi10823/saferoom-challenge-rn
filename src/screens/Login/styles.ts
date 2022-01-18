import { StyleSheet, TextInput } from 'react-native';
import styled from 'styled-components';

export const UserInput = styled(TextInput)({
  height: 40,
  margin: 12,
  borderWidth: 1,
  padding: 10,
  borderRadius: 20,
  width: '100%',
});

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loginButton: {
    width: '50%',
    borderRadius: 20,
  },
});
