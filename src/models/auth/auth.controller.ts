import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticationGuard } from './guards/jwt-guards.guard';
import { AdminAuthGuard } from './guards/admin.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Public()
  // @Transactional()
  @Post('sign-up')
  async createAccount(@Body() createUserDto: any) {
    return await this.authService.signUp(createUserDto);
  }
  @Post('sign-in')
  async signIn(@Body() data: any) {
    return await this.authService.signIn(data);
  }

  @Get('verified-email/:token_email')
  async verifiedActionConfirmEmail(@Param('token_email') token_email: string) {
    return await this.authService.verifiedActionConfirmEmail(token_email);
  }

  @Get('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return await this.authService.forgotPassword(email);
  }

  @UseGuards(AuthenticationGuard, AdminAuthGuard)
  @Get('')
  async findAll() {
    return await this.authService.findAll();
  }

  @Post('change-password')
  async setNewPassword(@Body() data: any) {
    return await this.authService.setNewPassword(data);
  }
}
