import fs from "fs";
import Papa from "papaparse";
import { db } from "../prisma/db";

export interface BusAttribution {
    userId: number;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
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
    const results = await db.bus_attribution.findMany({
        include: {
            users: { select: { id: true, first_name: true, last_name: true, email: true } }
        }
    });
    return results.map(r => ({
        userId: r.users.id,
        firstName: r.users.first_name,
        lastName: r.users.last_name,
        email: r.users.email,
        bus: r.bus,
        departure_time: r.departure_time,
    }));
};

// Récupérer une attribution précise par userId
export const getBusAttributionByUserId = async (userId: number): Promise<BusAttribution | null> => {
    const result = await db.bus_attribution.findUnique({
        where: { user_id: userId },
        include: {
            users: { select: { id: true, first_name: true, last_name: true, email: true } }
        }
    });
    if (!result) return null;
    return {
        userId: result.users.id,
        firstName: result.users.first_name,
        lastName: result.users.last_name,
        email: result.users.email,
        bus: result.bus,
        departure_time: result.departure_time,
    };
};

export const importBusFromCSV = async (filePath: string): Promise<void> => {
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
        user_id: Number(r.user_id),
        bus: Number(r.bus),
        departure_time: r.departure_time,
    }));

    await db.bus_attribution.createMany({ data: parsedData, skipDuplicates: true });
};
