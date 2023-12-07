// @ts-ignore
/* eslint-disable */

declare namespace TICKET_API {
  type BigTicketItem = {
    _id?: string;
    name?: string;
  }

  type TicketListItem = {
    _id?: string;
    sku?: string;
    bigTicket?: BigTicketItem;
    name?: string;
    unit?: string;
    Delivered?: number;
    Pending?: number;
    price?: number;
    discountPrice?: number;
    updatedAt?: string;
    createdAt?: string;
  };

  type TicketList = {
    data?: TicketListItem[];
    /** The total number of items in the list */
    total?: number;
    status?: string;
  };

}
