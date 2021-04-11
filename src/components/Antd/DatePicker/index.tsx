import dateFnsGenerateConfig from './generate-date-fns-config';
import generatePicker from 'antd/es/date-picker/generatePicker';
import 'antd/es/date-picker/style/index';

export const DatePicker = generatePicker<Date>(dateFnsGenerateConfig);
