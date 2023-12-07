// @ts-ignore
/* eslint-disable */

declare namespace DEPART_API {

  type CashierListItem = {
    _id?: string;
    name?: string;
    note?: string;
    order?: number;
    active?: boolean;
  }

  type DepartListItem = {
    _id?: string;
    name?: string;
    phone?: string;
    cashiers?: CashierListItem[];
  };

  type DepartList = {
    data?: DepartListItem[];
    /** The total number of items in the list */
    total?: number;
    status?: string;
  };

}
