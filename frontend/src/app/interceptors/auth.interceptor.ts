import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get the auth token from localStorage or a service
  const authToken = localStorage.getItem('forge_access_token');

  // Clone the request and add the authorization header if token exists
  if (authToken) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    return next(authReq);
  }

  // Pass the request as is if no token
  return next(req);
};
