// @ts-ignore
/* eslint-disable */
import { getAuth } from '@/services/authHelper';
import { request } from '@umijs/max';

/** Get a list of users GET /api/v1/users */
export async function userList(
  params: {
    // query
    /** Current page number */
    current?: number;
    /** Page size */
    pageSize?: number;
    isAgent?: boolean;
    role?: string;
  },
  options?: { [key: string]: any },
) {
  return request<USER_API.UserList>(`${API_URL}/users`, {
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

export async function getUser(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${API_URL}/users/${options?.userID}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
  });
}

/** Update user PUT /api/v1/users */
export async function updateUser(options?: { [key: string]: any }) {
  return request<USER_API.UserListItem>(`${API_URL}/users/${options?.userId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

export async function updatePassword(options?: { [key: string]: any }) {
  return request<USER_API.UserListItem>(`${API_URL}/users/updateMyPassword`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

/** Add user POST /api/v1/users */
export async function addUser(options?: { [key: string]: any }) {
  return request<USER_API.UserListItem>(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

/** Delete user DELETE /api/v1/users */
export async function removeUser(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${API_URL}/users/${options?._id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
  });
}

export async function removeManyUser(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${API_URL}/users/all`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

export async function agentList(
  params: {
    // query
    /** Current page number */
    current?: number;
    /** Page size */
    pageSize?: number;
    role?: string;
  },
  options?: { [key: string]: any },
) {
  return request<USER_API.UserList>(`${API_URL}/users?isAgent=true`, {
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


export async function getSubUser(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${API_URL}/users/sub-user`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
  });
}

export async function createSubUser(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${API_URL}/users/sub-user`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

export async function removeSubUser(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${API_URL}/users/sub-user/${options?.subID}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
  });
}

export async function updateSubUser(options?: { [key: string]: any }) {
  return request<DEPART_API.DepartList>(`${API_URL}/users/sub-user/${options?.subID}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

export async function checkPinSubUser(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${API_URL}/users/sub-user/check-pin`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}
