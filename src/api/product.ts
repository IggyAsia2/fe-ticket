// @ts-ignore
/* eslint-disable */
import { getAuth } from '@/services/authHelper';
import { request } from '@umijs/max';

/** Get a list of bigTickets GET /api/v1/bigTickets */
export async function productList(
  params: {
    // query
    /** Current page number */
    current?: number;
    /** Page size */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<PRODUCT_API.ProductList>(`${API_URL}/bigTickets?sort=name`, {
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

/** Get a list of bigTickets GET /api/v1/bigTickets */
export async function getProduct(
  options?: { [key: string]: any },
) {
  return request<PRODUCT_API.ProductList>(`${API_URL}/bigTickets/${options?.productId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    ...(options || {}),
  });
}

export async function getProductToLink(options?: { [key: string]: any }) {
  return request<PRODUCT_API.ProductList>(`${API_URL}/bigTickets/link`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

/** Update user PUT /api/v1/bigTickets */
export async function updateProduct(options?: { [key: string]: any }) {
  // console.log({...options});
  return request<PRODUCT_API.ProductListItem>(`${API_URL}/bigTickets/${options?.productId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${getAuth()}`,
      "Content-Type": "multipart/form-data"
    },
    data: {
      ...(options || {}),
    }
  });
}

/** Add user POST /api/v1/bigTickets */
export async function addProduct(options?: { [key: string]: any }) {
  return request<PRODUCT_API.ProductListItem>(`${API_URL}/bigTickets`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuth()}`,
    },
    data: {
      ...(options || {}),
    }
  });
}

/** Delete user DELETE /api/v1/bigTickets */
export async function removeProduct(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${API_URL}/bigTickets/${options?._id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getAuth()}`,
    },
  });
}

export async function removeManyProduct(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${API_URL}/bigTickets/all`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}
