/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser }: any = initialState ?? {};
  const role = currentUser?.role.name;
  const email = currentUser?.email
  return {
    canDad: email === 'admin@gmail.com',
    canAdmin: role === 'admin',
    canSale: role === 'sale',
    canSeeOrder: role === 'admin' || role === 'accountant',
    canSeeProduct: role !== 'accountant',
    canSeeInventory: role === 'admin'
  };
}
