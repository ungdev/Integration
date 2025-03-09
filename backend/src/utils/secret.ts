import dotenv from "dotenv";

dotenv.config();

export const jwtSecret = process.env.JWT_SECRET || "default";
export const server_port = process.env.SERVER_PORT;
export const cas_login_url = process.env.CAS_LOGIN_URL || "default";
export const cas_validate_url = process.env.CAS_VALIDATE_URL || "default";
export const service_url = process.env.SERVICE_URL || "default";
