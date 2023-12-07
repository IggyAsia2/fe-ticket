// @ts-ignore
/* eslint-disable */
import { getAuth } from '@/services/authHelper';
import { request } from '@umijs/max';

/** Get a list of roles GET /api/v1/roles */
export async function ristLole(
) {
  return request<ROLE_API.RistLole>(`${API_URL}/roles/roleList`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    }
  });
}

/** Update user PUT /api/v1/users */
export async function updateRole(options?: { [key: string]: any }) {
  return request<ROLE_API.RoleList>(`${API_URL}/roles`, {
    method: 'POST',
    data: {
      method: 'update',
      ...(options || {}),
    }
  });
}

/** Add user POST /api/v1/roles */
export async function addRole(options?: { [key: string]: any }) {
  return request<ROLE_API.RoleListItem>(`${API_URL}/roles`, {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    }
  });
}

/** Delete user DELETE /api/v1/roles */
export async function removeRole(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${API_URL}/roles`, {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    }
  });
}
