import React, { FC, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Text } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sb } from '../../utils/messaging';
import routes from '../../config/routes';
import { styles, UserInput } from './styles';
import { theme } from '../../utils/theme';

interface Props {
  navigation: any;
}

const Login: FC<Props> = ({ navigation }) => {
  const [userId, setUserID] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    sb.useAsyncStorageAsDatabase(AsyncStorage);
  }, []);

  const onLoging = () => {
    if (userId.trim().length < 1)
      return setError('Your user must have at least one character');
    sb.connect(userId, (_user, e) => {
      if (e) return setError(e.message);

      setError('');
      setUserID('');
      navigation.navigate(routes.GROUPS);
    });
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <UserInput
        placeholder="USER"
        value={userId}
        maxLength={22}
        onChangeText={setUserID}
      />
      <Text style={styles.errorMessage}>{error}</Text>
      <Button
        mode="contained"
        color={theme.colors.green}
        style={styles.loginButton}
        onPress={onLoging}>
        Login
      </Button>
    </KeyboardAvoidingView>
  );
};

export default Login;
