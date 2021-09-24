export class Laundry {
  laundryId?: string | null;
  name: string;
  city: string;
  street: string;
  house: string;
  phone: string;

  constructor(
    name: string,
    city: string,
    street: string,
    house: string,
    phone: string,
    laundryId: string | null = null
  ) {
    this.name = name;
    this.city = city;
    this.street = street;
    this.house = house;
    this.phone = phone;
    this.laundryId = laundryId;
  }
}
