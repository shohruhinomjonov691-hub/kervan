export interface BookingInput {
  name: string;
  phone: string;
  branch: string;
  date: string;
  time: string;
  guests: number;
}

export interface ContactInput {
  name: string;
  email: string;
  message: string;
}
