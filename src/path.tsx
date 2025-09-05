export const homePath = "/";
export const dashboardPath = "/dashboard";
export const productPath = (productId: string) => `/products/${productId}`;
export const addProductPath = "/products/add";
export const editProductPath = (productId: string) =>
  `/products/${productId}/edit/`;
export const adminLoginPath = "/admin-login";
