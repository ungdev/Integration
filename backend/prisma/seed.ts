import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/prisma/build/client";
import { zimbra_password } from "../src/utils/secret";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is required to run Prisma seeds.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const roles = [
    { name: "Animation", description: "Animer, divertir et motiver les CE et les nouveaux étudiants tout au long de la pré-inté et de l'inté." },
    { name: "Arbitre", description: "Arbitrer les différents défis pendant le semaine d'intégration." },
    { name: "Argentique", description: "Couvrir les événements de l'intégration, prendre des photos" },
    { name: "Bouffe", description: "Prévoir, organiser et coordonner tous les repas de l'inté. La bouffe c'est sacré !" },
    { name: "Bar", description: "Prévoir, organiser et coordonner toutes les boissons de l'inté !" },
    { name: "Bénévole", description: "Deviens bénévole et participe à différentes activités de l'inté !" },
    { name: "Cahier de vacances", description: "Élaborer le futur cahier de vacances des nouveaux avec des petits exercices et blagues." },
    { name: "Chasse au trésor", description: "Elaborer une chasse au trésor dans toute la capitale Troyenne." },
    { name: "Communication", description: "Préparer et gérer toute la communication de l'intégration" },
    { name: "Graphisme", description: "Créer une charte graphique incroyable pour les rendre l'inté encore plus belle !" },
    { name: "Déco", description: "Être créatif et fabriquer de quoi décorer l'UTT au thème de l'inté." },
    { name: "Défis TC", description: "Préparer un défi où les nouveaux TC doivent faire preuve d'ingéniosité pour fabriquer quelque chose." },
    { name: "Dev / Info", description: "Maintenir le site et l'application de l'inté et développer de nouveaux outils informatiques." },
    { name: "Faux amphi", description: "Créer un faux premier cours compliqué pour les TC avec des professeurs et des faux élèves." },
    { name: "Faux discours de rentrée", description: "Préparer et faire un discours de rentrée pour faire une petite frayeur aux nouveaux." },
    { name: "Logistique", description: "Préparer, organiser et mettre en place tout le matériel nécessaire pour l'intégration." },
    { name: "Lac d'Orient Express", description: "Emmener nos nouveaux voir le magnifique lac de Mesnil" },
    { name: "Média", description: "Couvrir les événements de l'intégration, prendre des photos et monter des films souvenirs." },
    { name: "Mascotte", description: "Etre juste le GOAT de l'intégration !" },
    { name: "Parrainage", description: "Attribuer des parrains/marraines aux nouveaux étudiants de manière personnalisée." },
    { name: "Partenariat", description: "Rechercher et établir des partenariats utiles pour l'intégration et les nouveaux étudiants." },
    { name: "Prévention", description: "Évaluer les risques et mettre en place des mesures préventives avant et pendant l'intégration." },
    { name: "Rallye", description: "Organiser une après-midi de jeux et d'activités sportives pour les nouveaux étudiants." },
    { name: "Respo CE", description: "Gérer le planning des CE et les guider pour qu'ils accueillent au mieux les nouveaux." },
    { name: "Respo Question", description: "Répondre au mieux aux questions des nouveaux !" },
    { name: "Sécu", description: "Gérer la sécurité des événements, notamment durant le WEI et la soirée d'intégration." },
    { name: "Soirée d'intégration", description: "Organiser une soirée sur le campus UTT durant la semaine d'inté." },
    { name: "Son et lumière", description: "Installer et gérer le son et la lumière durant les événements nécessitant une ambiance spéciale." },
    { name: "Soutenabilité", description: "Mettre en place des actions pour réduire l'impact environnemental de l'intégration." },
    { name: "SVE", description: "Mettre en place le Salon de la Vie Etudiante (SVE) lors de la deuxième semaine" },
    { name: "Traduction en anglais", description: "Traduire les contenus de l'intégration pour les étudiants étrangers." },
    { name: "Village Asso", description: "Organiser un événement pour présenter les associations UTTiennes aux nouveaux étudiants." },
    { name: "Visites", description: "Organiser les visites de l'UTT et de la ville pour les nouveaux étudiants." },
    { name: "WEI", description: "Organiser le Week-end d'intégration (transport, animation, logistique, soirée, etc.)." }
];

async function main() {
    const hashedPassword = await bcrypt.hash(zimbra_password, 10);

    await prisma.$transaction(async (tx) => {

        // initRoles
        for (const role of roles) {
            const seededRole = await tx.roles.upsert({
                where: { name: role.name },
                update: { description: role.description },
                create: role,
            });

            await tx.role_points.upsert({
                where: { role_points: seededRole.id },
                update: { points: 0 },
                create: { role_points: seededRole.id, points: 0 },
            });
        }


        // initUser
        const adminUser = await tx.users.upsert({
            where: { email: "integration@utt.fr" },
            update: {
                first_name: "Integration UTT",
                last_name: "Integration UTT",
                majeur: true,
                password: hashedPassword,
                permission: "Admin",
            },
            create: {
                first_name: "Integration UTT",
                last_name: "Integration UTT",
                email: "integration@utt.fr",
                majeur: true,
                password: hashedPassword,
                permission: "Admin",
            },
        });


        // initEvent
        const existingEvent = await tx.events.findFirst({ select: { id: true } });

        if (!existingEvent) {
            await tx.events.create({
                data: {
                    pre_registration_open: false,
                    shotgun_open: false,
                    sdi_open: false,
                    wei_open: false,
                    food_open: false,
                    chall_open: false,
                },
            });
        }


        // initChallenge
        const existingChallenge = await tx.challenges.findFirst({ select: { id: true } });

        if (!existingChallenge) {
            await tx.challenges.create({
                data: {
                    title: "Free",
                    description: "Chalenge de réfrence pour les points gratuits",
                    category: "Free",
                    points: 0,
                    created_by: adminUser.id,
                },
            });
        }
    });

    console.log("Prisma seed completed.");
}

main()
    .catch((error) => {
        console.error("Prisma seed failed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });