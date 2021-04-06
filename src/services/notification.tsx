import notification from 'antd/lib/notification';

const notificationStyle = {
  boxShadow: '0px 10px 40px rgba(23, 63, 112, 0.1)',
  borderRadius: '8px',
};

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
