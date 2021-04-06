import * as baseAxios from 'axios';

export const getCancelToken = () => baseAxios.default.CancelToken.source();
