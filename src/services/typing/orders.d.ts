// @ts-ignore
/* eslint-disable */

declare namespace ORDER_API {
  type OrderListItem = {
    _id?: string;
    orderId?: string;
    customerName?: string;
    customerEmail?: string;
    customerCar?: string;
    customerPhone?: string;
    quantity?: number;
    price?: number;
    subTotal?: number;
    exportUser?: string;
    paidDate?: Date;
    bookDate?: Date;
    state?: string;
    allOfTicket?: string[]
    groupTicket?: any
  };

  type OrderList = {
    data?: OrderListItem[];
    /** The total number of items in the list */
    total?: number;
    status?: string;
  };

}
