
export interface IComparisonDataDto {
    userResults: [
        {
            _id: {
                year: number,
                month: number
            },
            count: number
        }
    ],
    doctorResults: [
        {
            _id: {
                year: number,
                month: number
            },
            count: number
        }
    ],
    appointmentResults: [
        {
            _id: {
                year: number,
                month: number
            },
            count: number
        }
    ]
}

export interface ISingleData {
   
        _id: {
            year: number,
            month: number
        },
        count: number
 
}


export interface IComparisonData {
    name: string,
    users: number,
    doctors: number,
    appointments: number
}

export interface IRevenueDataDto {   
    revenueByMonth: [
        {
            month: number,
            amount: number
        }
    ],
    totalRevenue: number,
    year: number
}

export interface IRevenueData {
    year: number,
    revenueByMonth: 
        {
            month: number,
            amount: number
        }[],
    totalRevenue: number
}