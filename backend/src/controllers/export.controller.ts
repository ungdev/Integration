import { Request, Response } from "express";
// src/services/export.service.ts
import * as export_service from "../services/export.service";
import * as user_service from '../services/user.service'
import * as team_service from "../services/team.service";
import { spreadsheet_id } from "../utils/secret";
import { Ok, Error } from "../utils/responses";


export const exportAllDataToSheets = async (req: Request, res: Response) => {

  // 1. Récupération depuis la DB
  const userList = await user_service.getUsersAll();
  const teamList = await team_service.getTeamsAll();

  // 2. Mapping -> format pour Google Sheets (array de array)
  const usersValues = [
    ["ID", "Prénom", "Nom", "Email", "Branche", "Permission", "Birthday", "Contact", "Team", "Faction"],
    ...userList.map(u => [
        u.id ?? 0, 
        u.first_name ?? "No first name", 
        u.last_name ?? "No last name", 
        u.email ?? "No email",
        u.branch ?? "No branch", 
        u.permission ?? "No permissions",
        u.birthday ?? "No birthday",
        u.contact ?? "No contact", 
        u.teamName ?? "No Team",
        u.factionName ?? "No faction"
        /*u.discord_id ?? "No discord_id",
        u.team_id ?? 0,
        u.teamName,
        u.userWishes ?? "No wishes"*/
        ])];

  const teamsValues = [
    ["ID", "Nom", "Faction"],
    ...teamList.map(t => [t.id, t.name, t.teamFaction.name])
  ];


  // 3. Envoi vers les différentes feuilles
  try{
    await export_service.writeToGoogleSheet(spreadsheet_id, "USER!A1", usersValues);
    await export_service.writeToGoogleSheet(spreadsheet_id, "TEAM!A1", teamsValues);

    Ok(res, { msg: "Export réalisé avec succès !"})
  }catch(error){
    Error(res, {msg:"Error while exporting to Gsheet"})
  }

};
