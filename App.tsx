/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View } from 'react-native';

import SendBird from 'sendbird';
import Immutable from 'immutable';

const sb = new SendBird({ appId: 'A36A8FB6-9CB0-41A4-85EE-A33BF648540F' });
const USER_ID = 'USER_ID_1';
const App = () => {
  const [groups, setGroups] = useState<SendBird.GroupChannel[]>([]);
  const [messages, setMessages] = useState<any>([]);

  useEffect(() => {
    sb.connect(USER_ID, (user, error) => {
      console.log(user, '@@@@@@@@@');
      if (error) {
        console.log(error);

        return;
      }
      var listQuery = sb.GroupChannel.createMyGroupChannelListQuery();
      listQuery.includeEmpty = true;
      listQuery.memberStateFilter = 'all'; // 'all', 'joined_only', 'invited_only', 'invited_by_friend', and 'invited_by_non_friend'
      listQuery.order = 'latest_last_message'; // 'chronological', 'latest_last_message', 'channel_name_alphabetical', and 'metadata_value_alphabetical'
      listQuery.limit = 100; // The value of pagination limit could be set up to 100.

      if (listQuery.hasNext) {
        listQuery.next(function (groupChannels, error4) {
          console.log(groupChannels);
          if (error4) {
            console.log(error4);
          }
          setGroups(groupChannels);
          var messageFilter = new sb.MessageFilter();

          var startingPoint = Date.now();
          var messageCollectionFetchLimit = 100;
          var messageCollection: any = groupChannels[0]
            .createMessageCollection()
            .setFilter(messageFilter)
            .setStartingPoint(startingPoint)
            .setLimit(messageCollectionFetchLimit)
            .build();

          messageCollection
            .initialize(
              sb.MessageCollection.MessageCollectionInitPolicy
                .CACHE_AND_REPLACE_BY_API,
            )
            .onCacheResult(function (err, messages) {
              console.log(messages, 'rayoi');

              // Messages will be retrieved from the local cache.
              // They might be too outdated or far from the startingPoint.
            })
            .onApiResult(function (err, messages) {
              console.log(messages, 'rayo1');
              setMessages(messages);
              // Messages will be retrieved from the Sendbird server through API.
              // According to the MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API,
              // the existing data source needs to be cleared
              // before adding retrieved messages to the local cache.
            });
          // const params = new sb.UserMessageParams();

          // params.message = 'TEST MESSAGE';
          // params.customType = 'MESSAGE';
          // params.data = '';
          // params.pushNotificationDeliveryOption = 'default'; // Either 'default' or 'suppress'

          // groupChannels[0].sendUserMessage(
          //   params,
          //   function (userMessage, error) {
          //     if (error) {
          //       // Handle error.
          //     }

          //     // A text message with detailed configuration is successfully sent to the channel.
          //     // By using userMessage.messageId, userMessage.message, userMessage.customType, and so on,
          //     // you can access the result object from Sendbird server to check your UserMessageParams configuration.
          //     // The current user can receive messages from other users through the onMessageReceived() method of an event handler.
          //     const messageId = userMessage.messageId;
          //     console.log(messageId);
          //   },
          // );
        });
      }

      // sb.GroupChannel.createChannelWithUserIds(
      //   ['USER_ID_1', 'USER_ID_3'],
      //   true,
      //   'USER_ID_1 && USER_ID_3',

      //   (groupChannel, error3) => {
      //     if (error3) {
      //       return;
      //     }

      //     var immutableObject = Immutable.fromJS(groupChannel);

      //     console.log('@@@@@', immutableObject);
      //   },
      // );
    });
  }, []);

  return (
    <SafeAreaView>
      {groups.map(item => (
        <View
          style={{
            backgroundColor: 'red',
            marginBottom: 10,
          }}>
          {console.log(item.unreadMessageCount)}
          <Text>{item.name}</Text>
          <Text>
            {item.members.find(({ userId }) => userId !== USER_ID)?.userId}
          </Text>
        </View>
      ))}
      {messages.map(item => (
        <Text>{item.message}</Text>
      ))}
    </SafeAreaView>
  );
};

export default App;
