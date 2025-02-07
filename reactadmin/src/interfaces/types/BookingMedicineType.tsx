export interface BookingMedicine {
    medicine_id: string,
    dosage: string,
    qty: string,
    usage?: string
}

export type BookingMedicinePayloadInput = {
    medicine_catalogue_id?: string,
    medicines: BookingMedicine[];
};

export type BookingPayloadForSubmit = Omit<BookingMedicinePayloadInput, 'medicines'> & {
    medicines?: string
}

export type TBookingMedicine = {
    [key: string]: string
}