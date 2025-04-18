import { HttpHeaders } from "@angular/common/http";

class ApiStatusCode {
    static readonly OK = 200;
    static readonly CREATED = 201;
    static readonly NO_CONTENT = 204;
    static readonly BAD_REQUEST = 400;
    static readonly UNAUTHORIZED = 401;
    static readonly FORBIDDEN = 403;
    static readonly NOT_FOUND = 404;
    static readonly INTERNAL_SERVER_ERROR = 500;
}

const customHeaders = new HttpHeaders({
    // 'Content-Type': 'application/json',
});

export { customHeaders, ApiStatusCode };
