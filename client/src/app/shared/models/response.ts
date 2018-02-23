export interface Response<T> {
  success: boolean;
  errors: string[];
  data: T;
}
