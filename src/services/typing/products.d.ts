// @ts-ignore
/* eslint-disable */

declare namespace PRODUCT_API {

  type ProductListItem = {
    _id?: string;
    name?: string;
    logo?: any;
    heightNote?: any;
    manual?: string;
    note?: string;
    country?: string;
    createdAt?: string;
  };

  type ProductList = {
    data?: ProductListItem[];
    /** The total number of items in the list */
    total?: number;
    status?: string;
  };

}
