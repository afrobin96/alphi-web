export interface Login {
  access_token: string,
  user: {
    id: number,
    username: string,
    role: string,
  }
}
