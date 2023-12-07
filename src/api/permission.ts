// @ts-ignore
/* eslint-disable */
import { getAuth } from '@/services/authHelper';
import { request } from '@umijs/max';

/** Get a list of roles GET /api/v1/roles */
export async function role(
  params: {
    // query
    /** Current page number */
    current?: number;
    /** Page size */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<PERM_API.PermList>(`${API_URL}/roles`, {
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

/** Update user PUT /api/v1/roles */
export async function updateRole(options?: { [key: string]: any }) {
  return request<PERM_API.PermListItem>(`${API_URL}/roles/${options?.roleId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

/** Add user POST /api/v1/roles */
export async function addRole(options?: { [key: string]: any }) {
  return request<PERM_API.PermListItem>(`${API_URL}/roles`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

/** Delete user DELETE /api/v1/roles */
export async function removeRole(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${API_URL}/roles/${options?._id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
  });
}
