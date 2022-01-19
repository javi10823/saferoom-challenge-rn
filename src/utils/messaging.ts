import SendBird from 'sendbird';

export const sb = new SendBird({
  appId: 'A36A8FB6-9CB0-41A4-85EE-A33BF648540F',
  localCacheEnabled: true,
});

export const sendMessage = (item: SendBird.GroupChannel, message: string) => {
  const params = new sb.UserMessageParams();
  params.message = message;
  params.customType = 'MESSAGE';
  params.data = '';
  params.pushNotificationDeliveryOption = 'default';
  item.sendUserMessage(params, (_userMessage, error) => {
    if (error) return console.log(error);
  });
};
