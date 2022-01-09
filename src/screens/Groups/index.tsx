import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity } from 'react-native';
import SendBird from 'sendbird';
import routes from '../../config/routes';
import { sb } from '../../utils/messaging';

const Groups = ({ navigation }) => {
  const [groups, setGroups] = useState<SendBird.GroupChannel[]>([]);

  useEffect(() => {
    const listQuery = sb.GroupChannel.createMyGroupChannelListQuery();
    listQuery.includeEmpty = true;
    listQuery.memberStateFilter = 'all';
    listQuery.order = 'latest_last_message';
    listQuery.limit = 100;

    if (listQuery.hasNext) {
      listQuery.next((groupChannels, error) => {
        if (error) {
          console.log(error);
        }

        setGroups(groupChannels);
      });
    }
  }, []);

  const renderMessages = ({
    item,
    index,
  }: {
    item: SendBird.GroupChannel;
    index: number;
  }) => (
    <TouchableOpacity
      key={`groups${index}`}
      style={{
        backgroundColor: 'red',
        marginBottom: 10,
      }}
      onPress={navigation.navigate.bind(null, routes.MESSAGES, {
        selectedGroup: item,
      })}>
      {console.log(item.unreadMessageCount)}
      <Text>
        {item.members.find(({ userId }) => userId !== 'USER_ID_1')?.userId}
      </Text>
      {item.lastMessage?.message && <Text>{item.lastMessage?.message}</Text>}
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={groups}
      keyExtractor={(_item, index) => `${index}`}
      renderItem={renderMessages}
    />
  );
};

export default Groups;
