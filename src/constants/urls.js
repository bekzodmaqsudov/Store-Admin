export const urls = {
   catigories: {
     get: '/catigories',
     post: '/catigories',
     patch: (id) => `/catigories/${id}`,
     delete:  (id) => `/catigories/${id}`
   },

   products: {
    get: '/products',
    post: '/products',
    patch: (id) => `/products/${id}`,
    delete:  (id) => `/products/${id}`
   }
}