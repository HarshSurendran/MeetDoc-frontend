export type UserAddress = {
    district: string
    locality: string,
    pincode: string,
    state: string,
    country: string
}

export type User = {
    name: string,
    email: string,
    gender: string,
    phone: string,
    date_of_birth: string,
    occupation: string,
    address: UserAddress,
    rating: number,
    photo: string
}