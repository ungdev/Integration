import dotenv from "dotenv";

dotenv.config();

export const jwtSecret = process.env.JWT_SECRET || "default";
export const server_port = process.env.SERVER_PORT;
