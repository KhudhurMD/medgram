// Objective: Handle cookies
export const getCookie = (name: string) => {
  if (typeof window !== 'undefined') {
    return document.cookie.split('; ').reduce((r, v) => {
      const parts = v.split('=');
      if (!parts[1] || !parts[0]) return r;
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
  }
};

export const setCookie = (name: string, value: string) => {
  if (typeof window !== 'undefined') {
    document.cookie = `${name}=${value}; path=/`;
  }
};

export const deleteCookie = (name: string) => {
  if (typeof window !== 'undefined') {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }
};
