export interface AdminCreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    major: boolean;
    branch: string;
    withNotification: boolean;
}
