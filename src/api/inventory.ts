// @ts-ignore
/* eslint-disable */
import { getAuth } from '@/services/authHelper';
import { request } from '@umijs/max';

/** Get a list of tickets GET /api/v1/tickets */
export async function inventoryList(
  params: {
    // query
    /** Current page number */
    current?: number;
    /** Page size */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<INVEN_API.InvenList>(`${API_URL}/tickets`, {
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

/** Update user PUT /api/v1/tickets */
export async function updateInven(options?: { [key: string]: any }) {
  return request<INVEN_API.InvenListItem>(`${API_URL}/tickets/${options?.ticketId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

/** Add user POST /api/v1/tickets */
export async function addInven(options?: { [key: string]: any }) {
  return request<INVEN_API.InvenListItem>(`${API_URL}/tickets`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

/** Delete user DELETE /api/v1/tickets */
export async function removeInven(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${API_URL}/tickets/${options?._id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
  });
}

export async function removeManyInven(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${API_URL}/tickets/all`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

export async function importInven(options?: { [key: string]: any }) {
  return request<INVEN_API.InvenListItem>(`${API_URL}/tickets/import`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

export async function availableInven(
  params: {
    groupTicket?: string;
    expiredDate?: string;
    activatedDate?: string;
  },
  options?: { [key: string]: any },
) {
  return request<INVEN_API.InvenList>(`${API_URL}/tickets/num-ticketByDay`, {
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

export async function availableGroupInven(
  params: {
    bigTicket?: string;
    expiredDate?: string;
    activatedDate?: string;
  },
  options?: { [key: string]: any },
) {
  return request<INVEN_API.InvenList>(`${API_URL}/tickets/num-groupTicket`, {
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

/** Add user POST /api/v1/tickets */

