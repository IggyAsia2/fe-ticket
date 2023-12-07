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
    email?: string;
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
