export function getLoggedInUser() {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
}

export function setLoggedInUser(user: any) {
  localStorage.setItem('user', JSON.stringify(user));
}