// @ts-ignore
/* eslint-disable */
import { getAuth } from '@/services/authHelper';
import { request } from '@umijs/max';

/** Get a list of roles GET /api/v1/roles */
export async function rightGroupList(
  params: {
    // query
    /** Current page number */
    current?: number;
    /** Page size */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<PERM_API.PermList>(`${API_URL}/right-group`, {
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
