import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import SendBird from 'sendbird';
import { sb, sendMessage } from '../../utils/messaging';

const Messages = () => {
  const route: any = useRoute();
  const { selectedGroup } = route.params;
  const [messagesList, setMessagesList] = useState<
    SendBird.BaseMessageInstance[]
  >([]);
  const [message, setMessage] = useState('');

  const getMessages = () => {
    const messageFilter = new sb.MessageFilter();
    const startingPoint = Date.now();
    const messageCollectionFetchLimit = 100;

    const messageCollection = selectedGroup
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
      .onCacheResult((err: any, messages: SendBird.BaseMessageInstance[]) => {
        if (err) {
          console.log(err);
        }
        setMessagesList(messages);
      })
      .onApiResult((err: any, messages: SendBird.BaseMessageInstance[]) => {
        if (err) {
          console.log(err);
        }
        setMessagesList(messages);
      });
  };

  useEffect(() => {
    getMessages();
  }, []);

  const renderMessages = ({ item }: { item: SendBird.BaseMessageInstance }) => {
    console.log(item);

    return <Text>{item.message}</Text>;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}>
        <FlatList
          data={messagesList}
          keyExtractor={({ messageId }) => `${messageId}`}
          renderItem={renderMessages}
        />
        <View
          style={{ height: 50, flexDirection: 'row', marginHorizontal: 20 }}>
          <TextInput
            maxLength={200}
            style={{
              flex: 1,
              fontSize: 20,
              height: 50,
              backgroundColor: 'red',
            }}
            onChangeText={setMessage}
          />
          <TouchableOpacity
            onPress={() => {
              sendMessage(selectedGroup, message);
              getMessages();
            }}
            style={{
              backgroundColor: 'blue',
              width: 10,
              height: 10,
              alignSelf: 'center',
              position: 'absolute',
              right: 20,
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Messages;
