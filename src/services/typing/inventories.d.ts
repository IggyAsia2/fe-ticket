// @ts-ignore
/* eslint-disable */

declare namespace INVEN_API {
  type GroupTicketItem = {
    _id?: string;
    name?: string;
    sku?: string;
    unit?: string;
  }

  type InvenListItem = {
    _id?: string;
    name?: string;
    groupTicket?: GroupTicketItem;
    serial?: string;
    code?: string;
    purchaseId?: string;
    activatedDate?: Date;
    expiredDate?: Date;
    state?: string;
    importUser?: string;
  };

  type InvenList = {
    data?: InvenListItem[];
    /** The total number of items in the list */
    total?: number;
    status?: string;
  };

}
