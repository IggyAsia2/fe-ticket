import Cookies from "js-cookie";

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser }: any = initialState ?? {};
  const role = currentUser?.role.name;
  const email = currentUser?.email
  const SubUser = Cookies.get('SubUser');
  const userArr = ['admin@gmail.com', 'vsttravel@gmail.com']
  return {
    canDad: email === 'admin@gmail.com',
    canDeleteUser: userArr.includes(email),
    canAdmin: role === 'admin',
    canSale: role === 'sale',
    canSeeOrder: role !== 'agent',
    canSeeProduct: role !== 'agent',
    canSeeInventory: role === 'admin' || role === 'accountant',
    canSeeImportList: email === 'admin@gmail.com' || role === 'accountant',
    canAgent: role === 'agent',
    canMelinh: email === 'bachgia134@gmail.com',
    canSubAdmin: SubUser === 'Admin',
    canSubUser: role === 'agent' && SubUser !== undefined
  };
}
