import Elysia, { t } from 'elysia';
import { authMiddleware } from '@middleware/auth.middleware';
import { roleMiddleware } from '@middleware/role-middleware';
import { UserService } from './user.service';
import { updateUserBody } from './dto/update-user.dto';

export const userRouter = new Elysia({ prefix: 'users' });
const userService = new UserService();

userRouter
  .use(authMiddleware)
  .get('/me', async ({ store, error }) => {
    const [users, err] = await userService.findOne({ id: store.userId });
    if (err) throw error(err.status, { ...err });
    return users;
  })
  .get('/', async ({ error }) => {
    const [users, err] = await userService.findMany();
    if (err) throw error(err.status, { ...err });
    return users;
  })
  .get(
    '/:id',
    async ({ params, error }) => {
      const [user, err] = await userService.findOne({ id: params.id });
      if (err) throw error(err.status, { ...err });
      return user;
    },
    { params: t.Object({ id: t.Number() }) },
  )
  .put(
    '/:id',
    async ({ params, body, error }) => {
      const [user, err] = await userService.update(params.id, body);
      if (err) throw error(err.status, { ...err });
      return user;
    },
    { params: t.Object({ id: t.Number() }), body: updateUserBody },
  )
  .patch(
    '/archive/:id',
    async ({ params, error }) => {
      const [user, err] = await userService.archive(params.id);
      if (err) throw error(err.status, { ...err });
      return user;
    },
    { params: t.Object({ id: t.Number() }) },
  )
  .patch(
    '/unarchive/:id',
    async ({ params, error }) => {
      const [user, err] = await userService.unArchive(params.id);
      if (err) throw error(err.status, { ...err });
      return user;
    },
    { params: t.Object({ id: t.Number() }) },
  )
  .delete(
    '/:id',
    async ({ params, error }) => {
      const [user, err] = await userService.delete(params.id);
      if (err) throw error(err.status, { ...err });
      return user;
    },
    { params: t.Object({ id: t.Number() }), ...roleMiddleware(['SUPER_ADMIN']) },
  );
