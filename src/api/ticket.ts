// @ts-ignore
/* eslint-disable */
import { getAuth } from '@/services/authHelper';
import { request } from '@umijs/max';

/** Get a list of groupTickets GET /api/v1/groupTickets */
export async function ticketList(
  params: {
    // query
    /** Current page number */
    current?: number;
    /** Page size */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<TICKET_API.TicketList>(`${API_URL}/groupTickets?sort=sku`, {
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

export async function ticketList2(
  params: {
    // query
    /** Current page number */
    current?: number;
    /** Page size */
    pageSize?: number;
    fields?: string;
  },
  options?: { [key: string]: any },
) {
  return request<TICKET_API.TicketList>(`${API_URL}/groupTickets/all`, {
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

/** Update user PUT /api/v1/groupTickets */
export async function updateTicket(options?: { [key: string]: any }) {
  return request<TICKET_API.TicketListItem>(`${API_URL}/groupTickets/${options?.ticketId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

export async function exportInven(options?: { [key: string]: any }) {
  return request<INVEN_API.InvenListItem>(`${API_URL}/groupTickets/export`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

export async function exportGroupInven(options?: { [key: string]: any }) {
  return request<INVEN_API.InvenListItem>(`${API_URL}/groupTickets/export-group`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

export async function exportGroupAgentInven(options?: { [key: string]: any }) {
  return request<INVEN_API.InvenListItem>(`${API_URL}/groupTickets/export-agent-group`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}



/** Add user POST /api/v1/groupTickets */
export async function addTicket(options?: { [key: string]: any }) {
  return request<TICKET_API.TicketListItem>(`${API_URL}/groupTickets`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

/** Delete user DELETE /api/v1/groupTickets */
export async function removeTicket(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${API_URL}/groupTickets/${options?._id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
  });
}

export async function removeManyTicket(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${API_URL}/groupTickets/all`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuth()}`
    },
    data: {
      ...(options || {}),
    }
  });
}

