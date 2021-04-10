export const environment = {
  enablePWA: false,
  useMockedData: process.env.REACT_APP_USE_MOCKED_DATA === 'true',
  zustandStoreVersion: 1,
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
