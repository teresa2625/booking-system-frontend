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
    status: string;
  }

  export interface BookedSlots {
    date: string;
    time: string;
  }

  export  interface PatientInfo { id: number; full_name: string, email: string, phone: string };
  export  interface PatientDetail { id: number; name: string };
  export interface PatientForm {
  dob: string;
  address: string;
  occupation: string;
  complaint: string;
  currentRX: string;
  tests: string;
  medication: string;
  others: string;
  neuro: string;
  ortho: string;
  vasc: string;
  oe: string;
  rx: string;
  dx: string;
  pxrec: string;
}
  