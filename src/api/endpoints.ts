export const ApiEndpoints = {
  searchPartNumber: '/search-partnr.php',
  cart: '/cart.php',
  cartList: '/cartlist.php',
  orderSummary: '/ajax/order_summary.php',
  emailCheck: '/ajax/email-check.php',
} as const;

export type ApiEndpointKey = keyof typeof ApiEndpoints;
