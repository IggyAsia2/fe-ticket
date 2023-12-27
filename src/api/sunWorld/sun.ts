// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { getAuth } from '@/services/authHelper';

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
  return request<any>(`${API_URL}/suns/orders`, {
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
