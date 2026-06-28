export interface ApiResult<T> {
  code: number;
  message: string;
  data: T;
}

export const success = <T>(data: T, message = 'success'): ApiResult<T> => ({
  code: 200,
  message,
  data
});

export const fail = (message: string, code = 500): ApiResult<null> => ({
  code,
  message,
  data: null
});
