// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { getAuth } from '@/services/authHelper';
import { timeStamp } from '@/helper/helper';
import dayjs from 'dayjs';

export async function sunWorldList(params: {
  // query
  /** Current page number */
  current?: number;
  /** Page size */
  pageSize?: number;
},
  options?: { [key: string]: any },
) {
  return request<SUN_SITE_API.SunSiteList>(`${API_URL}/suns`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function sunProductList(params: {
},
  options?: { [key: string]: any },
) {
  return request<SUN_SITE_API.SunSiteList>(`${API_URL}/suns/products`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function createSunOrder(options?: { [key: string]: any }) {
  return request<any>(`${API_URL}/suns/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

export async function orderSunList(params: {
  current?: number;
  /** Page size */
  pageSize?: number;
},
  options?: { [key: string]: any },
) {
  return request<any>(`${API_URL}/suns/orders?sort=-orderDate`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function reportSunList(
  params: {
    // query
    /** Current page number */
    current?: number;
    /** Page size */
    pageSize?: number;
    orderUser?: string;
    'orderDate[gte]'?: string;
    'orderDate[lte]'?: string;
  },
  options?: { [key: string]: any },
) {
  const getGte = !params['orderDate[gte]'] ?
    `&orderDate[gte]=${timeStamp(dayjs().format('DD/MM/YYYY'))}`
    : ''
  const getLte = !params['orderDate[lte]'] ?
    `&orderDate[lte]=${timeStamp(dayjs().add(1, 'day').format('DD/MM/YYYY'))}`
    : ''
  return request<ORDER_API.OrderList>(`${API_URL}/suns/reports?sort=orderDate${getGte}${getLte}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
