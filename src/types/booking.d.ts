export interface Booking {
    id?: number;
    name: string;
    phone: string;
    email: string;
    date: string;
    time: string;
  }

  export interface UpdateBooking {
    id: number;
    note: string;
    status: string;
  }

  export interface BookedSlots {
    date: string;
    time: string;
  }
  