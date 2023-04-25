import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class GitHubAuthGuard extends AuthGuard("github") {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const http = context.switchToHttp();
        const req = http.getRequest();
        req.res = http.getResponse();
        return super.canActivate(context);
    }
}
