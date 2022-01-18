import React, { FC, useEffect, useState } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sb } from '../../utils/messaging';
import routes from '../../config/routes';
import { styles, UserInput } from './styles';

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
      return setError('your user must have at least one character');
    sb.connect(userId, (_user, e) => {
      if (error) return setError(e.message);

      navigation.navigate(routes.GROUPS);
    });
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <UserInput placeholder="USER" maxLength={22} onChangeText={setUserID} />
      <Button
        mode="contained"
        color="green"
        style={styles.loginButton}
        onPress={onLoging}>
        Login
      </Button>
    </KeyboardAvoidingView>
  );
};

export default Login;
