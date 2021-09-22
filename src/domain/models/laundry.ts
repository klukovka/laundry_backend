export class Laundry {
  idLaundry?: string | null;
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
    idLaundry: string | null = null
  ) {
    this.name = name;
    this.city = city;
    this.street = street;
    this.house = house;
    this.phone = phone;
    this.idLaundry = idLaundry;
  }
}
