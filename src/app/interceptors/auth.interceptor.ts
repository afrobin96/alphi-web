import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { AuthStore } from "../stores/auth.store";
import { Observable } from "rxjs";


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const token = authStore.token();

  if (token){
    req = req.clone({
      setHeaders:{Authorization: `Bearer ${token}`}
    })
  }
  return next(req);
}

