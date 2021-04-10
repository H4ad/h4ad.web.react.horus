export const environment = {
  enablePWA: false,
  useMockedData: process.env.REACT_APP_USE_MOCKED_DATA === 'true',
  zustandStoreVersion: 1,
  api: {
    baseUrl: process.env.REACT_APP_BASE_URL,
  },
  graphql: {
    getBoardsInfoForBoardStatistic: `query {
      boards(ids:[{boardIds}]) {
        id,
        items {
          id,
          name,
          column_values(ids: {columnValueIds}) { 
            id,
            value
          } 
        } 
      }
    }`,
    getUsersByIds: `query {
      users (ids: {userIds}) {
        id,
        name,
        email,
        photo_thumb_small
      }
    }`,
  },
};
