// @ts-ignore
/* eslint-disable */
import { timeStamp } from '@/helper/helper';
import { getAuth } from '@/services/authHelper';
import { request } from '@umijs/max';
import dayjs from 'dayjs';

/** Get a list of orders GET /api/v1/orders */
export async function orderList(
  params: {
    // query
    /** Current page number */
    current?: number;
    /** Page size */
    pageSize?: number;
    exportUser?: string;
    state?: string;
  },
  options?: { [key: string]: any },
) {
  return request<ORDER_API.OrderList>(`${API_URL}/orders`, {
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

export async function reportList(
  params: {
    // query
    /** Current page number */
    current?: number;
    /** Page size */
    pageSize?: number;
    exportUser?: string;
    state?: string;
    'updatedAt[gte]'?: string;
    'updatedAt[lte]'?: string;
  },
  options?: { [key: string]: any },
) {
  const getState = !params.state ? '&state=Finished' : ''
  const getGte = !params['updatedAt[gte]'] ?
    `&updatedAt[gte]=${timeStamp(dayjs().format('DD/MM/YYYY'))}`
    : ''
  const getLte = !params['updatedAt[lte]'] ?
    `&updatedAt[lte]=${timeStamp(dayjs().add(1, 'day').format('DD/MM/YYYY'))}`
    : ''
  return request<ORDER_API.OrderList>(`${API_URL}/orders/report?sort=updatedAt${getState}${getGte}${getLte}`, {
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

/** Get Order Get /api/v1/orders */
export async function getOrder(options?: { [key: string]: any }) {
  return request<ORDER_API.OrderListItem>(`${API_URL}/orders/link-order/${options?.oid}`, {
    method: 'GET',
    // headers: {
    //   Authorization: `Bearer ${getAuth()}`
    // },
    data: {
      ...(options || {}),
    }
  });
}

/** Update user PUT /api/v1/orders */
export async function updateOrder(options?: { [key: string]: any }) {
  return request<ORDER_API.OrderListItem>(`${API_URL}/orders/${options?.oid}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

export async function updateManyOrder(options?: { [key: string]: any }) {
  return request<ORDER_API.OrderListItem>(`${API_URL}/orders/all`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

export async function reduceOrder(options?: { [key: string]: any }) {
  return request<ORDER_API.OrderListItem>(`${API_URL}/orders/reduce`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

export async function cancelOrder(options?: { [key: string]: any }) {
  return request<ORDER_API.OrderListItem>(`${API_URL}/orders/cancel/${options?.oid}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

export async function cancelManyOrder(options?: { [key: string]: any }) {
  return request<ORDER_API.OrderListItem>(`${API_URL}/orders/cancel-many`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

/** Add user POST /api/v1/orders */
export async function addOrder(options?: { [key: string]: any }) {
  return request<ORDER_API.OrderListItem>(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

export async function sendMailOrder(options?: { [key: string]: any }) {
  return request<ORDER_API.OrderListItem>(`${API_URL}/orders/send-mail`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

export async function importHistoryList(
  params: {
    // query
    /** Current page number */
    current?: number;
    /** Page size */
    pageSize?: number;
    importUser?: string;
  },
  options?: { [key: string]: any },
) {
  return request<any>(`${API_URL}/importHistory`, {
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
