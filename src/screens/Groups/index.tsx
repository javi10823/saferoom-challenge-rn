import React, { FC, useEffect, useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity } from 'react-native';
import SendBird from 'sendbird';
import routes from '../../config/routes';
import { sb } from '../../utils/messaging';
import Modal from 'react-native-modal';
import { AddButton, ModalAddButton, ModalContent, styles } from './styles';
interface Props {
  navigation: any;
}

const Groups: FC<Props> = ({ navigation }) => {
  const [groups, setGroups] = useState<SendBird.GroupChannel[]>([]);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [constact, setContact] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchGroups = () => {
    const listQuery = sb.GroupChannel.createMyGroupChannelListQuery();
    listQuery.includeEmpty = true;
    listQuery.memberStateFilter = 'all';
    listQuery.order = 'latest_last_message';
    listQuery.limit = 100;

    if (listQuery.hasNext) {
      listQuery.next((groupChannels, error) => {
        if (error) return console.log(error);
        setGroups(groupChannels);
      });
    }
  };

  const addContact = async (contact: string) => {
    const contacts = groups.map(
      item =>
        item.members.find(({ userId }) => userId !== sb.currentUser.userId)
          ?.userId,
    );

    if (!contacts.includes(constact)) {
      await sb.GroupChannel.createChannelWithUserIds(
        [sb.currentUser.userId, contact],
        true,
        `${sb.currentUser.userId} && ${contact}`,

        (groupChannel, creationError) => {
          if (creationError) return setErrorMessage(creationError.message);

          if (groupChannel.memberCount <= 1) {
            groupChannel.leave(
              setErrorMessage.bind(null, "The contact doesn't exist"),
            );
            return;
          }
          fetchGroups();
          setContactModalVisible(false);
        },
      );
      return;
    }
    setErrorMessage('Contact already added');
  };

  const renderGroups = ({
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
      <Text>
        {
          item.members.find(({ userId }) => userId !== sb.currentUser.userId)
            ?.userId
        }
      </Text>
      {item.lastMessage?.message && <Text>{item.lastMessage?.message}</Text>}
    </TouchableOpacity>
  );

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <>
      <Modal isVisible={contactModalVisible} style={styles.addContactModal}>
        <ModalContent>
          <TextInput
            onChangeText={setContact}
            maxLength={22}
            style={{ backgroundColor: 'red', width: '100%' }}
          />
          <Text>{errorMessage}</Text>
          <ModalAddButton onPress={addContact.bind(null, constact)} />
        </ModalContent>
      </Modal>
      <FlatList
        data={groups}
        keyExtractor={(_item, index) => `contacts/${index}`}
        renderItem={renderGroups}
      />
      <AddButton onPress={setContactModalVisible.bind(null, true)} />
    </>
  );
};

export default Groups;
