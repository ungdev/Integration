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
export const google_client_id =process.env.GOOGLE_CLIENT_ID  || "default";
export const google_client_secret =process.env.GOOGLE_CLIENT_SECRET || "default";
export const google_client_uri =process.env.GOOGLE_REDIRECT_URI || "default";
export const spreadsheet_id = process.env.SPREADSHEET_ID || "default";
export const api_utt_username = process.env.API_UTT_USERNAME || "default";
export const api_utt_password = process.env.API_UTT_PASSWORD || "default";
export const api_utt_auth_url = process.env.API_UTT_AUTH_URL || "default";
export const api_utt_admis_url = process.env.API_UTT_ADMIS_URL || "default";
export const zimbra_host = process.env.ZIMBRA_HOST || "default";
export const zimbra_user = process.env.ZIMBRA_USER || "default";
export const zimbra_password = process.env.ZIMBRA_PASSWORD || "default";
