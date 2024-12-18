export type AuthRequestTypeWithBody = {
  email?: string;
  login?: string;
  password: string;
};

export type ConfirmationTypeWithBody = {
  code: string;
};

export type EmailResendTypeWithBody = {
  email: string;
};
