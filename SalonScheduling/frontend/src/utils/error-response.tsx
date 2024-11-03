import IErrorResponse from "../types/error-response";

export const getErrorMessages = (data: IErrorResponse) => {
  return Object.keys(data.errors).map((field) =>
    data.errors[field].map((message, index) => <li key={index}>{message}</li>)
  );
};
