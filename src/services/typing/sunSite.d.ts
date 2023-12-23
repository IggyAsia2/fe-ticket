// @ts-ignore
/* eslint-disable */

declare namespace SUN_SITE_API {

  type SunSiteItem = {
    _id?: string;
    code?: string;
    name?: string;
    address?: string;
    description?: string;
  };


  type SunSiteList = {
    data?: SunSiteItem[];
    total?: number;
    status?: string;
  };

}
