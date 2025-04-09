import { Request, Response } from "express";
import * as export_service from "../services/export.service";
import * as user_service from '../services/user.service';
import * as team_service from "../services/team.service";
import * as permanence_service from "../services/permanence.service";
import * as event_service from "../services/event.service";
import { spreadsheet_id } from "../utils/secret";
import { Ok, Error } from "../utils/responses";

export const exportAllDataToSheets = async (req: Request, res: Response) => {
  try {
    // 1. Récupération depuis la DB
    const userList = await user_service.getUsersAll();
    const teamList = await team_service.getTeamsAll();
    const permanenceList = await permanence_service.getAllPermanencesWithUsers();
    const shotgunList = await event_service.getAllTeamShotguns();


    // 2. Mapping -> format pour Google Sheets (array de array)
    const usersValues = [
      ["ID", "Prénom", "Nom", "Email", "Branche", "Permission", "Majeur", "Contact", "Team", "Faction"],
      ...userList.map(u => [
        u.id ?? 0,
        u.first_name ?? "No first name",
        u.last_name ?? "No last name",
        u.email ?? "No email",
        u.branch ?? "No branch",
        u.permission ?? "No permissions",
        u.majeur ?? "Pas de données",
        u.contact ?? "No contact",
        u.teamName ?? "No Team",
        u.factionName ?? "No faction"
      ])
    ];

    const teamsValues = [
      ["ID", "Nom", "Type", "Faction"],
      ...teamList.map(t => [
        t.id,
        t.name ?? "No name",
        t.type ?? "No type",
        t.teamFaction?.name ?? "No faction"
      ])
    ];

    const permanenceValues = [
      ["ID", "Nom", "Début", "Fin", "Lieu", "Inscrits (noms+emails)"],
      ...permanenceList.map(p => [
        p.id,
        p.name ?? "Sans nom",
        p.start_at?.toISOString() ?? "N/A",
        p.end_at?.toISOString() ?? "N/A",
        p.location ?? "Sans lieu",
        p.users.map(u => `${u.first_name} ${u.last_name} (${u.email})`).join(" ; ") || "Aucun inscrit"
      ])
    ];
    

    const shotgunValues = [
    ["ID", "Nom de l'équipe", "Type", "Horodatage"],
    ...shotgunList.map(s => [
        s.id,
        s.teamName ?? "No name",
        s.teamType ?? "No type",
        s.timestamp?.toISOString() ?? "No timestamp"
    ])
    ];
    // 3. Envoi vers les feuilles
    await export_service.writeToGoogleSheet(spreadsheet_id, "USER!A1", usersValues);
    await export_service.writeToGoogleSheet(spreadsheet_id, "TEAM!A1", teamsValues);
    await export_service.writeToGoogleSheet(spreadsheet_id, "PERMANENCES!A1", permanenceValues);
    await export_service.writeToGoogleSheet(spreadsheet_id, "SHOTGUN!A1", shotgunValues);


    Ok(res, { msg: "Export réalisé avec succès !" });

  } catch (error) {
    console.error(error);
    Error(res, { msg: "Erreur lors de l'export vers Google Sheets" });
  }
};
