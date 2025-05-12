import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import UserContext from "../../../shared/contexts/user.context";
import { catchError, throwError } from "rxjs";
import { Router } from "@angular/router";

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    const ctx = inject(UserContext);
    const router = inject(Router);
    const token = ctx.user()?.token;
    if (!token) {
        return next(req);
    }

    const authReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    });

    return next(authReq).pipe(
        catchError(err => {
            if (err.status === 401) {
                ctx.changeUserDetails(null);
                router.navigate(['/auth/login']);
            }
            return throwError(() => err);
        })
    );
};

export const stripFormDataContentTypeInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.body instanceof FormData) {
        const headers = req.headers.delete('Content-Type');
        req = req.clone({ headers });
    }
    return next(req);
}