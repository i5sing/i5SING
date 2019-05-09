import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "../services";

@Controller('/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {
    }

    @Post()
    login(@Body('username') username: string, @Body('password') password: string) {
        return this.authService.login(username, password);
    }

    @Post('/logout')
    logout() {
        return this.authService.logout();
    }
}
