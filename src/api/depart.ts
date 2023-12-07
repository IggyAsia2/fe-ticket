// @ts-ignore
/* eslint-disable */
import { getAuth } from '@/services/authHelper';
import { request } from '@umijs/max';

/** Get a list of roles GET /api/v1/roles */
export async function departListQuery(body: API.TokenAuth, params: {
  // query
  /** Current page number */
  current?: number;
  /** Page size */
  pageSize?: number;
},
) {
  return request<DEPART_API.DepartList>(`${API_URL}/departs`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${body.token}`
    },
    params: {
      ...params,
    },
  });
}

export async function departList(params: {
  // query
  /** Current page number */
  current?: number;
  /** Page size */
  pageSize?: number;
},
  options?: { [key: string]: any },
) {
  return request<DEPART_API.DepartList>(`${API_URL}/departs`, {
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

export async function updateDepart(options?: { [key: string]: any }) {
  return request<DEPART_API.DepartList>(`${API_URL}/departs/${options?.departID}`, {
    method: options?.method,
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

export async function updateCashier(options?: { [key: string]: any }) {
  return request<DEPART_API.DepartList>(`${API_URL}/departs/${options?.departID}/${options?.cashierID}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

export async function addCashier(options?: { [key: string]: any }) {
  return request<DEPART_API.DepartList>(`${API_URL}/departs/${options?.departID}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

export async function addDepart(options?: { [key: string]: any }) {
  return request<DEPART_API.DepartListItem>(`${API_URL}/departs`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

export async function removeDepart(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${API_URL}/departs/${options?._id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
  });
}

export async function removeCashier(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${API_URL}/departs/${options?.departID}/${options?.cashierID}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
  });
}

