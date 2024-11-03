export interface IErrorDictionary {
  [field: string]: string[];
}

export default interface IErrorResponse {
  errors: IErrorDictionary;
}
