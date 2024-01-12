import { useModel } from '@umijs/max';
import moment from 'moment';
import 'moment/locale/vi';

export function getDateTime(val: string) {
  moment.locale('vi');
  return moment(val).format('DD/MM/YYYY, HH:mm');
}

export function getDate(val: string) {
  return moment(val).format('DD/MM/YYYY');
}

export function getPrice(val: number) {
  let USDollar = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  return USDollar.format(val);
}

export function timeStamp(val: string) {
  const dateMomentObject = moment(val, 'DD/MM/YYYY');
  const dateObject = dateMomentObject.toISOString();
  return dateObject;
}

export function convertArrayToObject(array: string[], key: string) {
  const initialValue = {};
  return array.reduce((obj, item: any) => {
    return {
      ...obj,
      [item[key]]: { text: item.label },
    };
  }, initialValue);
}

export function convertArrayToObjectDepart(array: string[], key: string) {
  const initialValue = {};
  return array.reduce((obj, item: any) => {
    return {
      ...obj,
      [item[key]]: item.name,
    };
  }, initialValue);
}

export function convertArrayToCascader(array: string[]) {
  const initialValue = {};
  return array.map((item: any) => {
    const ticket = item.groupTickets.map((el: any) => {
      return { field: `${el.sku} - ${el.name} - ${el.unit}`, value: el._id };
    });
    return {
      field: item.name,
      value: item._id,
      ticket,
    };
  }, initialValue);
}

export function convertDepartToCascader(array: string[]) {
  const initialValue = {};
  return array.map((item: any) => {
    const cashier = item.cashiers.map((el: any) => {
      // return { label: `${el.name} - ${el.order}`, value: el._id };
      return { label: `${el.name}`, value: el._id };
    });
    return {
      label: item.name,
      options: cashier,
    };
  }, initialValue);
}

export function convertSubUserToList(array: string[]) {
  const initialValue = {};
  return array.map((item: any) => {
    return {
      label: item.name,
      value: item._id,
    };
  }, initialValue);
}

export function convertDepartToC(array: string[]) {
  const initialValue = {};
  return array.map((item: any) => {
    return {
      label: item.name,
      phone: item.phone,
    };
  }, initialValue);
}

export function CurrentUser() {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  return currentUser;
}

export const unit: any = {
  Adult: {
    name: 'Người lớn',
  },
  Child: {
    name: 'Trẻ em',
  },
  Elder: {
    name: 'Người cao tuổi',
  },
};
