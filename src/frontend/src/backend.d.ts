import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PinCode {
    expiresAt: bigint;
    code: string;
    createdAt: bigint;
    expiryType: ExpiryType;
    isActive: boolean;
}
export interface Movie {
    id: bigint;
    title: string;
    createdAt: bigint;
    posterUrl: string;
    videoUrl: string;
}
export enum ExpiryType {
    thirtyDays = "thirtyDays",
    ninetyDays = "ninetyDays",
    twentyMinutes = "twentyMinutes",
    unlimited = "unlimited"
}
export interface backendInterface {
    addMovie(token: string, title: string, posterUrl: string, videoUrl: string): Promise<{
        id: bigint;
        ok: boolean;
    }>;
    adminLogin(username: string, password: string): Promise<{
        ok: boolean;
        token: string;
    }>;
    adminLogout(token: string): Promise<boolean>;
    checkDeviceToken(deviceToken: string): Promise<boolean>;
    createPinCode(token: string, expiryType: ExpiryType): Promise<{
        ok: boolean;
        code: string;
    }>;
    deleteMovie(token: string, id: bigint): Promise<boolean>;
    getInitialCredentials(): Promise<{
        username: string;
        password: string;
    }>;
    getMovie(id: bigint): Promise<Movie | null>;
    getMovies(page: bigint, pageSize: bigint): Promise<{
        total: bigint;
        movies: Array<Movie>;
    }>;
    listPinCodes(token: string): Promise<{
        ok: boolean;
        pins: Array<PinCode>;
    }>;
    revokePinCode(token: string, code: string): Promise<boolean>;
    updateAdminCredentials(token: string, newUsername: string, newPassword: string): Promise<boolean>;
    updateMovie(token: string, id: bigint, title: string, posterUrl: string, videoUrl: string): Promise<boolean>;
    validateAdminToken(token: string): Promise<boolean>;
    validatePinCode(code: string): Promise<{
        ok: boolean;
        deviceToken: string;
    }>;
}
