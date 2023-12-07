import Cookies from 'js-cookie';

export function getAuth() {
  const jwt = Cookies.get('jwt');
  return jwt;
}
