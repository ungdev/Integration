import { eq } from "drizzle-orm";
import { db } from "../database/db";
import { teamSchema } from "../schemas/Basic/team.schema";
import { userTeamsSchema } from "../schemas/Relational/userteams.schema";

export const createTeam = async (teamName: string, members: number[]) => {

    const newTeam = await db.insert(teamSchema).values({ name: teamName }).returning();
    const teamId = newTeam[0].id;
    await Promise.all(members.map((userId) =>
      db.insert(userTeamsSchema).values({ team_id: teamId, user_id: userId })
    ));
  
    return newTeam;
};

export const getUserTeam = async(userId : number) => {

    const userTeam = await db.select({userTeam: userTeamsSchema.team_id}).from(userTeamsSchema).where(eq(userTeamsSchema.user_id, userId));

    return userTeam[0]
}
