export type FilterDayTolerance = '0' | '3' | '7' | '14';

export type PassengerDetailsData = {
    Adult1?: {
        firstName?: string;
        sureName?: string;
        gender?: 'Male' | 'Female';
        mobileNumber?: string;
    };
};
