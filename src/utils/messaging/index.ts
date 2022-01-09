import SendBird from 'sendbird';
import Immutable from 'immutable';

export const sb = new SendBird({
  appId: 'A36A8FB6-9CB0-41A4-85EE-A33BF648540F',
  localCacheEnabled: true,
});

export const fetchGroups = async (): SendBird.GroupChannel[] => {
  // CHAT GROUPS WITH USERS
  const listQuery = sb.GroupChannel.createMyGroupChannelListQuery();
  listQuery.includeEmpty = true;
  listQuery.memberStateFilter = 'all'; // 'all', 'joined_only', 'invited_only', 'invited_by_friend', and 'invited_by_non_friend'
  listQuery.order = 'latest_last_message'; // 'chronological', 'latest_last_message', 'channel_name_alphabetical', and 'metadata_value_alphabetical'
  listQuery.limit = 100; // The value of pagination limit could be set up to 100.
  // CHAT GROUPS WITH USERS

  if (listQuery.hasNext) {
    await listQuery.next((groupChannels, error4) => {
      console.log('nani', groupChannels);
      if (error4) {
        console.log(error4);
      }

      return groupChannels;
    });
  }
};

export const addContact = () => {
  // CREATE A GROUP WITH A USER / NEW CONTACT
  sb.GroupChannel.createChannelWithUserIds(
    ['USER_ID', 'USER_ID_2'], // TODO
    true,
    `${'USER_ID'} && USER_ID_2`,

    (groupChannel, error3) => {
      if (error3) {
        return;
      }

      var immutableObject = Immutable.fromJS(groupChannel);
      fetchGroups();
      console.log('@@@@@', immutableObject);
    },
  );
};

export const getMessages = (selected: SendBird.GroupChannel) => {
  console.log('loading', selected);

  // OBTAIN LIST OF ALL MESSAJES FROM A GROUP
  var messageFilter = new sb.MessageFilter();
  var startingPoint = Date.now();
  var messageCollectionFetchLimit = 100;

  var messageCollection: any = selected
    .createMessageCollection()
    .setFilter(messageFilter)
    .setStartingPoint(startingPoint)
    .setLimit(messageCollectionFetchLimit)
    .build();

  messageCollection
    .initialize(
      sb.MessageCollection.MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API,
    )
    .onCacheResult((err, messages) => {
      if (err) {
        console.log(err);
      }
      // Messages will be retrieved from the local cache.
      // They might be too outdated or far from the startingPoint.
    })
    .onApiResult((err, messages) => {
      console.log(err);
      return messages; // SAVE THE MESSAGES OF THE GROUP

      // Messages will be retrieved from the Sendbird server through API.
      // According to the MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API,
      // the existing data source needs to be cleared
      // before adding retrieved messages to the local cache.
    });
};

export const sendMessage = (item: SendBird.GroupChannel, message: string) => {
  // SEND MESSAGE
  const params = new sb.UserMessageParams();
  params.message = message;
  params.customType = 'MESSAGE';
  params.data = '';
  params.pushNotificationDeliveryOption = 'default'; // Either 'default' or 'suppress'
  item.sendUserMessage(params, (userMessage, error) => {
    if (error) {
      // Handle error.
    }
    // A text message with detailed configuration is successfully sent to the channel.
    // By using userMessage.messageId, userMessage.message, userMessage.customType, and so on,
    // you can access the result object from Sendbird server to check your UserMessageParams configuration.
    // The current user can receive messages from other users through the onMessageReceived() method of an event handler.
    console.log(userMessage);
  });
  // SEND MESSAGE
};
