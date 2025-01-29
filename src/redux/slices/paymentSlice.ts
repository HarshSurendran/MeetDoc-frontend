import { createSlice } from '@reduxjs/toolkit';

const paymentSlice = createSlice({
    name: 'payment',
    initialState: {
        payment: {
            slotId: "",
            userId: "",
            appointmentFor: "",
            appointmentForName: "",
            doctorId: "",
            fee: 0,
            startTime: "",
            endTime: "",
            doctor: {
                name: "",
                specialisation: "",

            },
            reason: "",
        },
    },
    reducers: {
        addPayment: (state, action) => {
            state.payment = action.payload;
        },
        resetPayment: (state) => {
            state.payment.slotId = '';
            state.payment.userId = '';
            state.payment.doctorId = '';
            state.payment.fee = 0;
            state.payment.appointmentFor = "";
            state.payment.appointmentForName = "";
            state.payment.startTime = "",
            state.payment.endTime = "",
            state.payment.doctor = {
                name: "",
                specialisation:"",
                }
            state.payment.reason = "";
        },
    },
});

export const { addPayment, resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
