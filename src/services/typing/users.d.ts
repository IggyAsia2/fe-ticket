// @ts-ignore
/* eslint-disable */

declare namespace USER_API {

  type RoleItem = {
    _id?: string;
    name?: string;
  }

  type UserListItem = {
    _id?: string;
    name?: string;
    phone?: string;
    email?: string;
    moneny?: number;
    discountAgent?: number;
    role?: RoleItem;
    active?: boolean;
    avatar?: string;
    updatedAt?: string;
    createdAt?: string;
  };

  type UserList = {
    data?: UserListItem[];
    /** The total number of items in the list */
    total?: number;
    status?: string;
  };

}
