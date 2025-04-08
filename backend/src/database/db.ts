import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { postgres_user, postgres_db, postgres_host, postgres_password, postgres_port } from '../utils/secret';

// ✅ Import de tous tes schémas ici
import * as user from '../schemas/Basic/user.schema';
import * as team from '../schemas/Basic/team.schema';
import * as perm from '../schemas/Basic/permanence.schema';
import * as event from '../schemas/Basic/event.schema';
import * as faction from '../schemas/Basic/faction.schema';
import * as role from '../schemas/Basic/role.schema';
import * as challenge from '../schemas/Basic/challenge.schema';

import * as userTeam from '../schemas/Relational/userteams.schema';
import * as teamFaction from '../schemas/Relational/teamfaction.schema';
import * as teamShotgun from '../schemas/Relational/teamshotgun.schema';
import * as userPermanence from '../schemas/Relational/userpermanences.schema';
import * as userRole from '../schemas/Relational/userroles.schema';
import * as challengValidation from '../schemas/Relational/challengevalidation.schema';


const client = new Client({
  connectionString: `postgresql://${postgres_user}:${postgres_password}@${postgres_host}:${postgres_port}/${postgres_db}`,
});

client.connect();

export const db = drizzle(client, {
  schema: {
    ...user,
    ...team,
    ...event,
    ...faction,
    ...role,
    ...perm,
    ...challenge,

    ...userTeam,
    ...teamFaction,
    ...teamShotgun,
    ...userPermanence,
    ...userRole,
    ...challengValidation,

  },
});
