import { eq } from "drizzle-orm";
import { db } from "../database/db";
import { teamSchema } from "../schemas/Basic/team.schema";
import { userTeamsSchema } from "../schemas/Relational/userteams.schema";
import { teamFactionSchema } from "../schemas/Relational/teamfaction.schema";
import { userSchema } from "../schemas/Basic/user.schema";

export const createTeam = async (teamName: string, members: number[]) => {

    const newTeam = await db.insert(teamSchema).values({ name: teamName }).returning();
    const teamId = newTeam[0].id;
    await Promise.all(members.map((userId) =>
      db.insert(userTeamsSchema).values({ team_id: teamId, user_id: userId })
    ));
  
    return newTeam;
};

export const createTeamLight = async (teamName: string, factionId: number) => {

  const newTeam = await db.insert(teamSchema).values({ name: teamName }).returning({teamId : teamSchema.id});

  if(factionId){
    await db.insert(teamFactionSchema).values({faction_id : factionId, team_id: newTeam[0].teamId});
  }

  return newTeam;
};

export const getUserTeam = async(userId : number) => {

    const userTeam = await db.select({userTeam: userTeamsSchema.team_id}).from(userTeamsSchema).where(eq(userTeamsSchema.user_id, userId));

    return userTeam[0]
}

export const getTeams = async() => {

  const teams = await db.select(
    {
    teamId : teamSchema.id,
    name : teamSchema.name,
    description : teamSchema.description,
    type : teamSchema.type}).from(teamSchema);

  return teams
}

export const modifyTeam = async ( teamID: number, teamMembers: number[], factionID:number, name? :string) => {

  // 1. Mise à jour des champs de l'équipe

  
  if (name !== undefined) {
    await db
      .update(teamSchema)
      .set({name: name})
      .where(eq(teamSchema.id, teamID));
  }

  // 2. Mise à jour des membres de l’équipe (remplace les anciens)
  if(teamMembers.length !== 0){
    if (Array.isArray(teamMembers)) {
      // Supprimer les anciens membres
      await db.delete(userTeamsSchema).where(eq(userTeamsSchema.team_id, teamID));

      // Ajouter les nouveaux
      if (teamMembers.length > 0) {
        await db.insert(userTeamsSchema).values(
          teamMembers.map((userID) => ({
            user_id: userID,
            team_id: teamID,
          }))
        );
      }
    }
  }

  // 3. Mise à jour de la faction (remplace la relation précédente)
  if (factionID !== undefined) {
    // Supprimer l’ancienne relation
    await db.delete(teamFactionSchema).where(eq(teamFactionSchema.team_id, teamID));

    // Ajouter la nouvelle
    await db.insert(teamFactionSchema).values({
      team_id: teamID,
      faction_id: factionID,
    });
  }

  // 4. Retour de la team modifiée
  const updatedTeam = await db
    .select()
    .from(teamSchema)
    .where(eq(teamSchema.id, teamID));

  return updatedTeam[0];
};


export const getTeamUsers = async (teamId: any) => {

  const users = await db
    .select({
      userId: userSchema.id,
      firstName: userSchema.first_name,
      lastName: userSchema.last_name,
      email: userSchema.email,
      // ajoute ici les colonnes que tu veux
    })
    .from(userSchema)
    .innerJoin(userTeamsSchema, eq(userSchema.id, userTeamsSchema.user_id))
    .where(eq(userTeamsSchema.team_id, teamId));

  return users;
};

export const getTeamFaction = async (teamId: any) => {

  const teamFactionId = await db
    .select({
      factionId: teamFactionSchema.faction_id,
    })
    .from(teamFactionSchema)
    .where(eq(teamFactionSchema.team_id, teamId));

  return teamFactionId[0];
};

export const deleteTeam = async (teamID: number) => {
  // 1. Supprimer la relation avec les utilisateurs (table user_teams)
  await db.delete(userTeamsSchema).where(eq(userTeamsSchema.team_id, teamID));

  // 2. Supprimer la relation avec la faction (table team_faction)
  await db.delete(teamFactionSchema).where(eq(teamFactionSchema.team_id, teamID));

  // 3. Supprimer l'équipe de la table principale (teams)
  const deletedTeam = await db
    .delete(teamSchema)
    .where(eq(teamSchema.id, teamID))
    .returning();

  // Si aucune équipe n'est supprimée, on retourne une erreur
  if (deletedTeam.length === 0) {
    throw new Error("Équipe non trouvée.");
  }

  return deletedTeam[0]; // Retourne les informations de l'équipe supprimée
};


export const addTeamMember = async (teamId: number, userId: number) => {

  const newTeamMember = await db.insert(userTeamsSchema).values({ user_id: userId, team_id: teamId, });

  return newTeamMember;
};

export const getUsersWithTeam = async () => {
  try {
    const userswithteam = await db.select(
      {
        userId: userTeamsSchema.user_id,
        teamId: userTeamsSchema.team_id,
      }
    ).from(userTeamsSchema);
    return userswithteam; 
  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs possédant une team ', err);
    throw new Error('Erreur de base de données');
  }
};
