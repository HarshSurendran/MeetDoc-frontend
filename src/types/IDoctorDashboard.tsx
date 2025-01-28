
export interface IDoctorDashboardDto {
    slots: [
        {
            _id: {
                year: number,
                month: number
            },
            count: number
        }
    ],
    appointments: [
        {
            _id: {
                year: number,
                month: number
            },
            count: number
        }
    ],
}

export interface IDoctorDashboard {
    name: string,
    slots: number,
    appointments: number
}

