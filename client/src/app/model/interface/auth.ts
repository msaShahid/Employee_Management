export interface ILoginResponse {
    token: string;
    user: {
      id: string;
      email: string;
      username: string;
    };
  }
  