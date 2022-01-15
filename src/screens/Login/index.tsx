import React, { useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sb } from '../../utils/messaging';
import routes from '../../config/routes';

const Login = ({ navigation }) => {
  const [userId, setUserID] = useState('');
  useEffect(() => {
    sb.useAsyncStorageAsDatabase(AsyncStorage);
  }, []);

  const onLoging = () => {
    sb.connect(userId, (user, error) => {
      // connection, use a user_ID
      console.log(user, '@@@@@@@@@');

      if (error) {
        return console.log('error', error);
      }

      const channelHandler = new sb.ChannelHandler();
      channelHandler.onMessageReceived = function (channel, message) {
        console.log(channel, message, 'received');
      };

      channelHandler.onMessageUpdated = (channel, message) => {
        console.log(channel, message, 'updated');
      };
      channelHandler.onMessageDeleted = (channel, message) => {
        console.log(channel, message, 'DELETED');
      };

      sb.addChannelHandler('UNIQUE_HANDLER_ID', channelHandler);
      navigation.navigate(routes.GROUPS);
    });
  };

  return (
    <View>
      <TextInput
        placeholder="USER"
        maxLength={22}
        style={{
          height: 40,
          margin: 12,
          borderWidth: 1,
          padding: 10,
        }}
        onChangeText={setUserID}
      />
      <Button onPress={onLoging}>Login</Button>
    </View>
  );
};

export default Login;
