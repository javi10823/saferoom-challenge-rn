import React, { useEffect } from 'react';
import { TextInput, View } from 'react-native';
import { Button } from 'react-native-paper';
import Immutable from 'immutable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sb } from '../../utils/messaging';
import routes from '../../config/routes';

const USER_ID = 'USER_ID_1';

const Login = ({ navigation }) => {
  useEffect(() => {
    sb.useAsyncStorageAsDatabase(AsyncStorage);

    sb.connect(USER_ID, (user, error) => {
      // connection, use a user_ID
      console.log(user, '@@@@@@@@@');

      if (error) {
        return console.log('error', error);
      }

      var channelHandler = new sb.ChannelHandler();
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
    });
  }, []);

  const addContact = () => {
    // CREATE A GROUP WITH A USER / NEW CONTACT
    sb.GroupChannel.createChannelWithUserIds(
      [USER_ID, 'USER_ID_2'],
      true,
      `${USER_ID} && USER_ID_2`,

      (groupChannel, error3) => {
        if (error3) {
          return;
        }

        var immutableObject = Immutable.fromJS(groupChannel);
        console.log('@@@@@', immutableObject);
      },
    );
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
        onChangeText={() => {}}
      />
      <Button onPress={navigation.navigate.bind(null, routes.GROUPS)}>
        Login
      </Button>
    </View>
  );
};

export default Login;
