export interface LoginToken {
  access_token: string;
  refresh_token: string;
}

export interface LoginTokenResponse extends LoginToken {
  message: string;
}
