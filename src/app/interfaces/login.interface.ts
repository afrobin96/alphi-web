export interface LoginData {
  access_token: string,
  user: {
    id: number,
    username: string,
    role: string,
  }
}
