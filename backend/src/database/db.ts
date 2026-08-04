import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { postgres_db, postgres_host, postgres_password, postgres_port, postgres_user } from '../shared/secrets/secrets';

// ✅ Import de tous tes schémas ici
import * as challenge from '../schemas/Basic/challenge.schema';
import * as event from '../schemas/Basic/event.schema';
import * as faction from '../schemas/Basic/faction.schema';
import * as perm from '../schemas/Basic/permanence.schema';
import * as permanence from '../schemas/Basic/permanence.schema';
import * as role from '../schemas/Basic/role.schema';
import * as team from '../schemas/Basic/team.schema';
import * as user from '../schemas/Basic/user.schema';
import * as busattribution from '../schemas/Relational/busattribution.schema';
import * as challengValidation from '../schemas/Relational/challengevalidation.schema';
import * as registration from '../schemas/Relational/registration.schema';
import * as rolepoints from '../schemas/Relational/rolepoints.schema';
import * as teamFaction from '../schemas/Relational/teamfaction.schema';
import * as teamShotgun from '../schemas/Relational/teamshotgun.schema';
import * as userPermanence from '../schemas/Relational/userpermanences.schema';
import * as userRole from '../schemas/Relational/userroles.schema';
import * as userTeam from '../schemas/Relational/userteams.schema';
import * as tent from '../schemas/Relational/usertent.schema';

const schema = {
    ...user,
    ...team,
    ...perm,
    ...event,
    ...faction,
    ...role,
    ...challenge,
    ...permanence,
    ...userTeam,
    ...teamFaction,
    ...teamShotgun,
    ...userPermanence,
    ...userRole,
    ...challengValidation,
    ...busattribution,
    ...registration,
    ...tent,
    ...rolepoints,
};

const client = new Client({
    connectionString: `postgresql://${postgres_user}:${postgres_password}@${postgres_host}:${postgres_port}/${postgres_db}`,
});

client.connect();

export const db = drizzle(client, { schema: schema });
