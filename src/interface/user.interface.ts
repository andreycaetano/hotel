export interface IUser {
    username: string;
    password: string;
    email: string;
}

export type TLogin = Pick<IUser, 'email' | 'password'>

export interface ITokenPayload {
    id: number;
    iat: number; 
    exp: number;
}