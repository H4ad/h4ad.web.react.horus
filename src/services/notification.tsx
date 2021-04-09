import notification from 'antd/lib/notification';

notification.config({
  placement: 'topRight',
  duration: 5,
});

export const createSuccessNotification = (description: string): void => {
  notification.close(description);

  notification.success({
    message: 'Sucesso!',
    description: description,
  });
};

export const createErrorNotification = (description: string): void => {
  notification.close(description);

  notification.error({
    key: description,
    message: 'Oops...',
    description: description,
  });
};
