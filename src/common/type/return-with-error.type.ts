import type { HttpException } from '@exception';

export type ReturnWithErr<T> = [T, null] | [null, HttpException];
export type ReturnPromiseWithErr<T> = Promise<ReturnWithErr<T>>;
