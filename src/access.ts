/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser }: any = initialState ?? {};
  const role = currentUser?.role.name;
  return {
    canAdmin: role === 'admin',
    canSale: role === 'sale',
    canSeeOrder: role === 'admin' || role === 'accountant',
  };
}
