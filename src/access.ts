/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser }: any = initialState ?? {};
  const role = currentUser?.role.name;
  const email = currentUser?.email
  const userArr = ['admin@gmail.com', 'vsttravel@gmail.com']
  return {
    canDad: email === 'admin@gmail.com',
    canDeleteUser: userArr.includes(email),
    canAdmin: role === 'admin',
    canSale: role === 'sale',
    canSeeOrder: role === 'admin' || role === 'accountant',
    canSeeProduct: role !== 'accountant',
    canSeeInventory: role === 'admin'
  };
}
