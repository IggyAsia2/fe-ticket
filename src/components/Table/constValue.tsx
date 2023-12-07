import dayjs from 'dayjs';
import moment from 'moment';
const rangePresets: any = [
  { label: 'Hôm nay', value: [dayjs(), dayjs()] },
  { label: 'Hôm qua', value: [dayjs().add(-1, 'd'), dayjs().add(-1, 'd')] },
  { label: 'Tuần này', value: [moment().startOf('week'), moment().endOf('week')] },
  {
    label: 'Tuần trước',
    value: [
      moment().subtract(1, 'weeks').startOf('week'),
      moment().subtract(1, 'weeks').endOf('week'),
    ],
  },
  { label: 'Tháng này', value: [moment().startOf('month'), moment().endOf('month')] },
  {
    label: 'Tháng trước',
    value: [
      moment().subtract(1, 'months').startOf('month'),
      moment().subtract(1, 'months').endOf('month'),
    ],
  },
];

export { rangePresets };
