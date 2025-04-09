import Elysia from 'elysia';
import { AuthService } from './auth.service';
import { createUserBody } from '../user/dto/create-user.dto';
import { signInBody } from './dto/sign-in.dto';
import { signOutBody } from './dto/sign-out.dto';
import { refreshTokenBody } from './dto/refresh-token.dto';

export const authRouter = new Elysia({ prefix: 'auth' });
const authService = new AuthService();

authRouter
  // TODO: remove sign up api
  .post(
    '/sign-up',
    async ({ body, error }) => {
      const [token, err] = await authService.signUp(body);
      if (err) throw error(err.status, { ...err });
      return token;
    },
    { body: createUserBody },
  )
  .post(
    '/sign-in',
    async ({ body, error }) => {
      const [token, err] = await authService.signIn(body);
      if (err) throw error(err.status, { ...err });
      return token;
    },
    { body: signInBody },
  )
  .post(
    '/sign-out',
    async ({ body, error }) => {
      const err = await authService.signOut(body);
      if (err) throw error(err.status, { ...err });
    },
    { body: signOutBody },
  )
  .post(
    '/sign-out-everywhere',
    async ({ body, error }) => {
      const err = await authService.signOutEverywhere(body);
      if (err) throw error(err.status, { ...err });
    },
    { body: signOutBody },
  )
  .post(
    '/refresh-token',
    async ({ body, error }) => {
      const [token, err] = await authService.refreshToken(body);
      if (err) throw error(err.status, { ...err });
      return token;
    },
    { body: refreshTokenBody },
  );
