export interface LaundryRepository {
  getLaundryId(userId: string): Promise<string>;
}
