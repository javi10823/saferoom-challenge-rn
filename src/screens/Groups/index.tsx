import React, { FC, useLayoutEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import SendBird from 'sendbird';
import routes from '../../config/routes';
import { sb } from '../../utils/messaging';
import Modal from 'react-native-modal';
import {
  AddButton,
  Contact,
  ModalBackground,
  ModalButton,
  ModalContent,
  NewContactInput,
  styles,
} from './styles';
import { theme } from '../../utils/theme';
import { IconButton } from 'react-native-paper';
interface Props {
  navigation: any;
}

const Groups: FC<Props> = ({ navigation }) => {
  const [groups, setGroups] = useState<SendBird.GroupChannel[]>([]);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [constact, setContact] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchGroups = (): void => {
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

  const addContact = async (contact: string): Promise<void> => {
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
  }): JSX.Element => (
    <Contact
      key={`groups${index}`}
      onPress={navigation.navigate.bind(null, routes.MESSAGES, {
        selectedGroup: item,
      })}>
      <Text style={styles.contactName}>
        {
          item.members.find(({ userId }) => userId !== sb.currentUser.userId)
            ?.userId
        }
      </Text>
      {item.lastMessage?.message && (
        <Text style={styles.lastMessage}>{item.lastMessage?.message}</Text>
      )}
    </Contact>
  );

  const onPressLogout = () => {
    sb.disconnect();
    navigation.goBack();
  };

  const onPressCancel = () => {
    setErrorMessage('');
    setContactModalVisible.bind(null, false);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <></>,
      headerRight: () => <IconButton onPress={onPressLogout} icon="logout" />,
    });
    fetchGroups();
    const channelHandler = new sb.ChannelHandler();

    channelHandler.onMessageReceived = () => {
      fetchGroups();
    };

    sb.addChannelHandler('GROUPS_HANDLER', channelHandler);
    return () => sb.removeChannelHandler('GROUPS_HANDLER');
  }, []);

  return (
    <>
      <Modal style={styles.modal} isVisible={contactModalVisible}>
        <ModalBackground onPress={setContactModalVisible.bind(null, false)}>
          <ModalContent>
            <NewContactInput
              placeholder="New contact"
              onChangeText={setContact}
              maxLength={22}
            />
            <Text>{errorMessage}</Text>
            <View style={styles.modalButtonsContainer}>
              <ModalButton color={theme.colors.red} onPress={onPressCancel}>
                <Text style={styles.modalButtonText}>CANCEL</Text>
              </ModalButton>
              <ModalButton onPress={addContact.bind(null, constact)}>
                <Text style={styles.modalButtonText}>ADD</Text>
              </ModalButton>
            </View>
          </ModalContent>
        </ModalBackground>
      </Modal>
      <FlatList
        data={groups}
        keyExtractor={(_item, index) => `contacts/${index}`}
        renderItem={renderGroups}
      />
      <AddButton
        icon="plus"
        size={30}
        onPress={setContactModalVisible.bind(null, true)}
      />
    </>
  );
};

export default Groups;
