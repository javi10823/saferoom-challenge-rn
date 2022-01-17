import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import SendBird from 'sendbird';
import { sb, sendMessage } from '../../utils/messaging';
import { Message, MessageInput, SendButton, styles } from './styles';

const Messages = () => {
  const route: any = useRoute();
  const { selectedGroup } = route.params;
  const [messagesList, setMessagesList] = useState<
    SendBird.BaseMessageInstance[]
  >([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const channelHandler = new sb.ChannelHandler();
    channelHandler.onMessageReceived = (targetChannel, message) => {
      if (targetChannel.url === selectedGroup.url) {
        setMessagesList([...messagesList, message]);
      }
    };

    sb.addChannelHandler('CHAT_HANDLER', channelHandler);

    return sb.removeChannelHandler('CHAT_HANDLER');
  }, []);

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
        setMessagesList(messages.reverse());
      })
      .onApiResult((err: any, messages: SendBird.BaseMessageInstance[]) => {
        if (err) {
          console.log(err);
        }
        setMessagesList(messages.reverse());
      });
  };

  useEffect(() => {
    getMessages();
  }, []);

  const renderMessages = ({ item }: { item: SendBird.BaseMessageInstance }) => (
    <View style={styles.messageContainer}>
      <Message
        style={
          item._sender.userId === sb.currentUser.userId
            ? styles.sended
            : styles.received
        }>
        <Text>{item.message}</Text>
      </Message>
    </View>
  );

  const onPressSend = () => {
    sendMessage(selectedGroup, message);
    setMessage('');
    getMessages();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.flexContainer}
        keyboardVerticalOffset={100}>
        <FlatList
          inverted
          data={messagesList}
          keyExtractor={({ messageId }) => `${messageId}`}
          renderItem={renderMessages}
        />
        <View style={styles.inputContainer}>
          <MessageInput
            placeholder="Write your message"
            maxLength={200}
            value={message}
            onChangeText={setMessage}
          />
          <SendButton
            disabled={message.trim().length < 1}
            onPress={onPressSend}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Messages;
