import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import * as randomstring from 'randomstring';
import { db } from '../database/db'; // Import de la connexion PostgreSQL
import type { AdminCreateUserDto, CreateUserContactInformationDto, VssSubmissionPayload } from '../dto/user.dto';
import { type User, userSchema } from '../schemas/Basic/user.schema';
import { vssqcmquestionSchema } from '../schemas/Basic/vssqcmquestion.schema';
import { vssqcmanswerSchema } from '../schemas/Relational/vssqcmanswer.schema';
import { registrationSchema } from '../schemas/Relational/registration.schema';
import * as auth_service from '../services/auth.service';
import * as SIEP_Utils from '../utils/siep';
import * as Banned_Service from './banned.service';
import { createRegistrationToken } from './auth.service';
import { getFaction } from './faction.service';
import { getUserRoles } from './role.service';
import { getTeam, getTeamFaction, getUserTeam } from './team.service';
import { userInformationSchema } from '../schemas/Relational/userinformation.schema';
import { addUserToRespondentStudentsList } from '../utils/billetweb';
import { generateEmailHtml, sendEmail } from './email.service';
import { email_from } from '../utils/secret';

export type VssQuestionnaireAnswer = {
    id: number;
    answer: string;
};

export type VssQuestionnaireQuestion = {
    id: number;
    question: string;
    points: number;
    type: 'single_choice' | 'multiple_choice';
    answers: VssQuestionnaireAnswer[];
};

export type VssSubmissionAnswer = {
    questionId: number;
    answerIds: number[];
};

// Fonction pour récupérer un utilisateur par email
export const getUserByEmail = async (email: string) => {
    try {
        const users = await db.select().from(userSchema).where(eq(userSchema.email, email));
        return users[0];
    } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur par email:", err);
        throw new Error('Erreur de base de données');
    }
};

export const getUserById = async (userId: number) => {
    try {
        const user = await db
            .select({
                userId: userSchema.id,
                firstName: userSchema.first_name,
                lastName: userSchema.last_name,
                email: userSchema.email,
                majeur: userSchema.majeur,
                branch: userSchema.branch,
                contact: userSchema.contact,
                permission: userSchema.permission,
                discord_id: userSchema.discord_id,
                vss_form: userSchema.vss_form,
            })
            .from(userSchema)
            .where(eq(userSchema.id, userId));
        return user[0];
    } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur par email:", err);
        throw new Error('Erreur de base de données');
    }
};

export const syncNewStudents = async (data: string) => {
    const token = await SIEP_Utils.getTokenUTTAPI();

    const newStudents = await SIEP_Utils.getNewStudentsFromUTTAPI_NOPAGE(token, data);

    const noSyncEmails = await Banned_Service.getAllBanned().then((bannedList) =>
        bannedList.map((banned) => banned.email),
    );

    const filteredStudents = newStudents.filter((student: any) => !noSyncEmails.includes(student.email));

    for (const student of filteredStudents) {
        const userInDb = await getUserByEmail(student.email.toLowerCase());

        if (!userInDb) {
            const tmpPassword = randomstring.generate(48);

            const newUser = await createUser(
                student.prenom,
                student.nom,
                student.email.toLowerCase(),
                student.Majeur,
                'Nouveau',
                student.diplome === 'MA' ? 'Master' : student.specialite,
                tmpPassword,
            );

            await auth_service.createRegistrationToken(newUser.id);
        }
    }

    return filteredStudents.length;
};

// Fonction pour enregistrer un nouvel utilisateur
export const createUser = async (
    firstName: string,
    lastName: string,
    email: string,
    majeur: boolean,
    permission: string,
    branch: string,
    password: string,
) => {
    try {
        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser: Partial<User> = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            branch: branch === 'CV_ING' ? 'RI' : branch,
            majeur: majeur,
            password: hashedPassword,
            permission: permission,
        };
        // Insérer un nouvel utilisateur dans la base de données
        const result = await db.insert(userSchema).values(newUser).returning();

        return result[0];
    } catch (err) {
        console.error("Erreur lors de la création de l'utilisateur:", err);
        throw new Error('Erreur de base de données');
    }
};

// Fonction pour comparer les mots de passe (utilisée lors de la connexion)
export const comparePassword = async (enteredPassword: string, storedPassword: string) => {
    return await bcrypt.compare(enteredPassword, storedPassword);
};

export const updateUserStudent = async (firstName: string, lastName: string, email: string) => {
    try {
        const result = await db
            .update(userSchema)
            .set({
                first_name: firstName,
                last_name: lastName,
            })
            .where(eq(userSchema.email, email));

        return result.rows[0];
    } catch (err) {
        console.error("Erreur lors de la récupération et de l'update de l'utilisateur par email:", err);
        throw new Error('Erreur de base de données');
    }
};

export const adminCreateUser = async (data: AdminCreateUserDto) => {
    const email = data.email.toLowerCase();

    const userInDb = await getUserByEmail(email);

    if (userInDb) {
        throw new Error('Utilisateur déjà existant');
    }

    const isBanned = await Banned_Service.getBannedByEmail(email);

    if (isBanned) {
        throw new Error('Adresse email bannie. Rendez vous dans la page Admin/Bannis.');
    }

    const tmpPassword = randomstring.generate(48);

    const newUser = await createUser(
        data.firstName,
        data.lastName,
        email,
        data.major,
        'Nouveau',
        data.branch === 'MA' ? 'Master' : data.branch,
        tmpPassword,
    );

    const registrationToken = await createRegistrationToken(newUser.id);

    if (data.withNotification) {
        const htmlEmail = generateEmailHtml('templateWelcome', {
            token: registrationToken,
        });

        const emailOptions = {
            from: email_from,
            to: [email],
            cc: [],
            bcc: [],
            subject: `[EN BELOW] Bienvenue à l'UTT !`,
            text: ``,
            html: htmlEmail || '',
        };

        await sendEmail(emailOptions);
    }

    return newUser;
};

export const getUsersAdmin = async () => {
    try {
        const users = await db
            .select({
                userId: userSchema.id,
                firstName: userSchema.first_name,
                lastName: userSchema.last_name,
                email: userSchema.email,
                majeur: userSchema.majeur,
                branch: userSchema.branch,
                contact: userSchema.contact,
                permission: userSchema.permission,
                discord_id: userSchema.discord_id,
            })
            .from(userSchema);
        return users;
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs ', err);
        throw new Error('Erreur de base de données');
    }
};

export const getUsers = async () => {
    try {
        const users = await db
            .select({
                userId: userSchema.id,
                firstName: userSchema.first_name,
                lastName: userSchema.last_name,
                permission: userSchema.permission,
                email: userSchema.email,
            })
            .from(userSchema);
        return users;
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs ', err);
        throw new Error('Erreur de base de données');
    }
};

export const getUserContactInformation = async (userId: number) => {
    try {
        const user = await db
            .select({
                userId: userInformationSchema.user_id,
                emergency_contact_name: userInformationSchema.emergency_contact_name,
                emergency_contact_phone: userInformationSchema.emergency_contact_phone,
            })
            .from(userInformationSchema)
            .where(eq(userInformationSchema.user_id, userId));
        return user[0];
    } catch (err) {
        console.error("Erreur lors de la récupération des informations de contact de l'utilisateur ", err);
        throw new Error('Erreur de base de données');
    }
};

export const createUserContactInformation = async (userId: number, contact: CreateUserContactInformationDto) => {
    try {
        const newContactInfo = {
            user_id: userId,
            emergency_contact_name: contact.emergency_contact_name,
            emergency_contact_phone: contact.emergency_contact_phone,
        };

        const result = await db
            .insert(userInformationSchema)
            .values(newContactInfo)
            .onConflictDoUpdate({
                target: userInformationSchema.user_id,
                set: {
                    emergency_contact_name: contact.emergency_contact_name,
                    emergency_contact_phone: contact.emergency_contact_phone,
                },
            })
            .returning();
        return result[0];
    } catch (err) {
        console.error("Erreur lors de la création des informations de contact de l'utilisateur:", err);
        throw new Error('Erreur de base de données');
    }
};

export const getCurrentUserOnboardingStatus = async (userId: number) => {
    try {
        const [user] = await db
            .select({
                vss_form: userSchema.vss_form,
                permission: userSchema.permission,
            })
            .from(userSchema)
            .where(eq(userSchema.id, userId));

        if (user.permission != 'Nouveau') {
            return {
                hasemergencyContactInformation: true,
                vss_form: 'validated',
                needsVssForm: false,
            };
        }

        const [contactInformation] = await db
            .select({
                userId: userInformationSchema.user_id,
            })
            .from(userInformationSchema)
            .where(eq(userInformationSchema.user_id, userId));

        const vssForm = user?.vss_form ?? 'pending';

        return {
            hasemergencyContactInformation: Boolean(contactInformation),
            vss_form: vssForm,
            needsVssForm: vssForm === 'pending' || vssForm === 'toretry',
        };
    } catch (err) {
        console.error("Erreur lors de la récupération du statut d'onboarding:", err);
        throw new Error('Erreur de base de données');
    }
};

export const getVssQuestionnaire = async () => {
    try {
        const questions = await db.select().from(vssqcmquestionSchema);
        const answers = await db.select().from(vssqcmanswerSchema);

        return questions.map((question) => ({
            id: question.id,
            question: question.question,
            points: question.points,
            type: question.type,
            answers: answers
                .filter((answer) => answer.questionid === question.id)
                .map((answer) => ({
                    id: answer.id,
                    answer: answer.answer,
                })),
        }));
    } catch (err) {
        console.error('Erreur lors de la récupération du questionnaire VSS:', err);
        throw new Error('Erreur de base de données');
    }
};

export const submitVssQuestionnaire = async (userId: number, payload: VssSubmissionPayload) => {
    try {
        const [user] = await db
            .select({
                vss_form: userSchema.vss_form,
            })
            .from(userSchema)
            .where(eq(userSchema.id, userId));

        if (!user) {
            throw new Error('Utilisateur introuvable');
        }

        if (user.vss_form === 'validated' || user.vss_form === 'rejected') {
            return {
                score: 0,
                maxScore: 0,
                status: user.vss_form,
            };
        }

        const questions = await db.select().from(vssqcmquestionSchema);
        const answers = await db.select().from(vssqcmanswerSchema);

        const answersByQuestion = new Map<number, typeof answers>();
        for (const answer of answers) {
            const currentAnswers = answersByQuestion.get(answer.questionid) ?? [];
            currentAnswers.push(answer);
            answersByQuestion.set(answer.questionid, currentAnswers);
        }

        const responsesByQuestion = new Map<number, Set<number>>();
        for (const response of payload.answers ?? []) {
            responsesByQuestion.set(response.questionId, new Set(response.answerIds));
        }

        for (const question of questions) {
            const response = responsesByQuestion.get(question.id);
            if (!response || response.size === 0) {
                throw new Error('Toutes les questions doivent recevoir une réponse.');
            }
        }

        let score = 0;
        const maxScore = questions.reduce((total, question) => total + question.points, 0);

        for (const question of questions) {
            const questionAnswers = answersByQuestion.get(question.id) ?? [];
            const correctAnswerIds = questionAnswers.filter((answer) => answer.is_correct).map((answer) => answer.id);
            const selectedAnswerIds = Array.from(responsesByQuestion.get(question.id) ?? []);

            const isCorrect =
                selectedAnswerIds.length === correctAnswerIds.length &&
                selectedAnswerIds.every((answerId) => correctAnswerIds.includes(answerId));

            if (isCorrect) {
                score += question.points;
            }
        }

        let status: 'pending' | 'toretry' | 'validated' | 'rejected' = 'validated';
        if (score < Math.ceil(maxScore / 2)) {
            status = user.vss_form === 'toretry' ? 'rejected' : 'toretry';
        }

        const [updatedUser] = await db
            .update(userSchema)
            .set({ vss_form: status })
            .where(eq(userSchema.id, userId))
            .returning({
                vss_form: userSchema.vss_form,
                email: userSchema.email,
                firstName: userSchema.first_name,
                lastName: userSchema.last_name,
            });

        if (status == 'validated') {
            addUserToRespondentStudentsList({
                ...updatedUser,
            });
        }
        return {
            score,
            maxScore,
            status: updatedUser?.vss_form ?? status,
        };
    } catch (err) {
        console.error('Erreur lors de la soumission du questionnaire VSS:', err);
        throw new Error('Erreur de base de données');
    }
};

export const getUsersAll = async () => {
    try {
        const users = await db.select().from(userSchema);

        const userWithTeam = await Promise.all(
            users.map(async (user) => {
                const roles = await getUserRoles(user.id);
                let teamId = await getUserTeam(user.id);
                teamId = teamId ?? null;

                let teamName: string | null = null;
                let factionId: number | null = null;
                let factionName: string | null = null;

                if (teamId) {
                    const team = await getTeam(teamId);
                    teamName = team?.teamName ?? null;

                    factionId = await getTeamFaction(teamId);
                    const faction = await getFaction(factionId);
                    factionName = faction?.name ?? null;
                }

                return {
                    ...user,
                    teamId,
                    teamName,
                    factionId,
                    factionName,
                    roles,
                };
            }),
        );

        return userWithTeam;
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs ', err);
        throw new Error('Erreur de base de données');
    }
};

export const getUsersbyPermission = async (permission: string) => {
    try {
        const users = await db
            .select({
                userId: userSchema.id,
                firstName: userSchema.first_name,
                lastName: userSchema.last_name,
                email: userSchema.email,
                branch: userSchema.branch,
            })
            .from(userSchema)
            .where(eq(userSchema.permission, permission));
        return users;
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs ', err);
        throw new Error('Erreur de base de données');
    }
};

export const updateUserPassword = async (userId: number, password: string) => {
    try {
        const result = await db
            .update(userSchema)
            .set({
                password: password,
            })
            .where(eq(userSchema.id, userId));

        return result.rows[0];
    } catch (err) {
        console.error("Erreur lors de la récupération et de l'update de l'utilisateur par email:", err);
        throw new Error('Erreur de base de données');
    }
};

export const updateUserInfoByUserId = async (userId: number, branch?: string, contact?: string) => {
    try {
        const result = await db
            .update(userSchema)
            .set({
                branch: branch,
                contact: contact,
            })
            .where(eq(userSchema.id, userId));

        return result;
    } catch (err) {
        console.error('Erreur lors de la mise à jour des infos utilisateur:', err);
        throw new Error('Erreur de base de données');
    }
};

export const updateUserByAdmin = async (userId: number, updates: Partial<User>) => {
    try {
        if (Object.keys(updates).length === 0) {
            throw new Error('Aucune donnée à mettre à jour');
        }

        const result = await db.update(userSchema).set(updates).where(eq(userSchema.id, userId));

        return result;
    } catch (err) {
        console.error("Erreur lors de la mise à jour par l'admin:", err);
        throw new Error('Erreur de base de données');
    }
};

export const deleteUserById = async (userId: number) => {
    try {
        const user_registration_token = await db
            .select({ user_id: registrationSchema.user_id })
            .from(registrationSchema)
            .where(eq(registrationSchema.user_id, userId));

        if (user_registration_token.length > 0) {
            await db.delete(registrationSchema).where(eq(registrationSchema.user_id, userId));
        }

        const result = await db.delete(userSchema).where(eq(userSchema.id, userId));
        return result;
    } catch (err) {
        console.error("Erreur lors de la suppression de l'utilisateur:", err);
        throw new Error('Erreur de base de données');
    }
};
