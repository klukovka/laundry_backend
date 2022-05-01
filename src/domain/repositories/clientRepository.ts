export interface ClientRepository {
  getClientId(userId: string): Promise<string>;
}
