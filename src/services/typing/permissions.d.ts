// @ts-ignore
/* eslint-disable */

declare namespace PERM_API {

  type PermListItem = {
    _id?: string;
    name?: string;
  };

  type PermList = {
    data?: PermListItem[];
    /** The total number of items in the list */
    total?: number;
    status?: string;
  };

}
