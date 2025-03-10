import dotenv from "dotenv";

dotenv.config();

export const jwtSecret = process.env.JWT_SECRET || "default";
export const server_port = process.env.SERVER_PORT;
export const cas_login_url = process.env.CAS_LOGIN_URL || "default";
export const cas_validate_url = process.env.CAS_VALIDATE_URL || "default";
export const service_url = process.env.SERVICE_URL || "default";
export const dev_db_url = process.env.DATABASE_URL || "default";
export const postgres_password = process.env.POSTGRES_PASSWORD || "default";
export const postgres_user = process.env.POSTGRES_USER|| "default";
export const postgres_port = process.env.POSTGRES_PORT|| "default";
export const postgres_db = process.env.POSTGRES_DB|| "default";
export const postgres_host = process.env.POSTGRES_HOST|| "default";

