import { eq } from "drizzle-orm";
import fs from "fs";
import Papa from "papaparse";
import { db } from "../database/db";
import { userSchema } from "../schemas/Basic/user.schema";
import { busAttributionSchema } from "../schemas/Relational/busattribution.schema";

export interface BusAttribution {
    userId: number;
    firstName: string | null;
    lastName: string | null;
    email: string;
    bus: number;
    departure_time: string;
}

type CsvBus = {
    user_id: number;
    bus: number;
    departure_time: string;
};

// Récupérer toutes les attributions bus + user
export const getAllBusAttributions = async (): Promise<BusAttribution[]> => {
    const results = await db
        .select({
            userId: userSchema.id,
            firstName: userSchema.first_name,
            lastName: userSchema.last_name,
            email: userSchema.email,
            bus: busAttributionSchema.bus,
            departure_time: busAttributionSchema.departure_time
        })
        .from(busAttributionSchema)
        .innerJoin(userSchema, eq(userSchema.id, busAttributionSchema.user_id));

    return results;
};

// Récupérer une attribution précise par userId
export const getBusAttributionByUserId = async (userId: number): Promise<BusAttribution | null> => {
    const result = await db
        .select({
            userId: userSchema.id,
            firstName: userSchema.first_name,
            lastName: userSchema.last_name,
            email: userSchema.email,
            bus: busAttributionSchema.bus,
            departure_time: busAttributionSchema.departure_time,
        })
        .from(busAttributionSchema)
        .innerJoin(userSchema, eq(userSchema.id, busAttributionSchema.user_id))
        .where(eq(busAttributionSchema.user_id, userId));

    return result.length > 0 ? result[0] : null;
};

export const importBusFromCSV = async (
    filePath: string
): Promise<void> => {
    const fileContent = fs.readFileSync(filePath, "utf8");

    const { data, errors } = Papa.parse<CsvBus>(fileContent, {
        header: true,
        skipEmptyLines: true,
    });

    if (errors.length > 0) {
        console.error("CSV parsing errors:", errors);
        throw new Error("Erreur lors du parsing du CSV.");
    }

    const parsedData = data.map((r) => ({
        user_id: r.user_id,
        bus: r.bus,
        departure_time: r.departure_time,

    }));

    await db.insert(busAttributionSchema).values(parsedData);
};
