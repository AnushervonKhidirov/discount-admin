import Elysia from 'elysia';
import swagger from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';

import { authRouter } from './auth/auth.router';
import { userRouter } from './user/user.router';
import { companyRouter } from './company/company.router';
import { bankRouter } from './bank/bank.router';
import { uploadRouter } from './upload/upload.router';
import { discountRouter } from './discount/discount.router';
import { cashbackRouter } from './cashback/cashback.router';
import { storeRouter } from './store/store.router';

const PORT = process.env.PORT ?? 4000;

const app = new Elysia();

app.use(swagger());
app.use(cors());

app.use(authRouter);
app.use(userRouter);
app.use(companyRouter);
app.use(bankRouter);
app.use(uploadRouter);
app.use(discountRouter);
app.use(cashbackRouter);
app.use(storeRouter);

app.listen(PORT);
