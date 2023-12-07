// @ts-ignore
/* eslint-disable */

declare namespace ROLE_API {

  type RistLole = {
    value?: string;
    label?: string;
  }

  type RoleListItem = {
    _id?: string;
    name?: string;
  };

  type RoleList = {
    data?: RoleListItem[];
    /** The total number of items in the list */
    total?: number;
    status?: string;
  };


}
