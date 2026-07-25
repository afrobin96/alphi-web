export interface LoginData {
  access_token: string,
  user: {
    id: number,
    username: string,
    email: string,
    role: string,
    subscriptionPlan?: string;
  }
}
