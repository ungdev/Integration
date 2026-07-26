import { db } from '../db';
import { vssqcmanswerSchema } from '../../schemas/Relational/vssqcmanswer.schema';
import { vssqcmquestionSchema } from '../../schemas/Basic/vssqcmquestion.schema';

type SeedQuestion = {
    question: string;
    points: number;
    type: 'single_choice' | 'multiple_choice';
    answers: {
        answer: string;
        is_correct: boolean;
    }[];
};

const qcmQuestions: SeedQuestion[] = [
    {
        question: 'Oui = ',
        points: 1,
        type: 'single_choice',
        answers: [
            { answer: 'Non', is_correct: false },
            { answer: 'Toujours oui', is_correct: false },
            { answer: 'Peut-être non plus tard', is_correct: true },
        ],
    },
    {
        question: 'Non = ',
        points: 1,
        type: 'single_choice',
        answers: [
            { answer: 'Oui', is_correct: false },
            { answer: 'Non', is_correct: true },
            { answer: "Peut-être oui si j'insiste", is_correct: false },
        ],
    },
    {
        question: 'En résumé, le consentement',
        points: 2,
        type: 'multiple_choice',
        answers: [
            { answer: 'concerne une action précise', is_correct: true },
            { answer: "ne peut-être considéré comme éclairé venant d'un personne en état d'ébriété", is_correct: true },
            { answer: 'doit être libre et éclairé', is_correct: true },
            { answer: 'peut être retiré à tout moment', is_correct: true },
            {
                answer: "spécifique, enthousiaste; valable quand la personne chancèle sous l'effet de l'alcool",
                is_correct: false,
            },
            { answer: "peut s'obtenir en insistant", is_correct: false },
            { answer: 'est valable quand la personne est bourrée', is_correct: false },
        ],
    },
    {
        question:
            "B a embrassé A de force. B était complètement bourré. Il s'agit d'une agression sexuelle. La prise d'alcool est alors une condition :",
        points: 1,
        type: 'single_choice',
        answers: [
            { answer: 'Aggravante', is_correct: true },
            { answer: 'Atténuante', is_correct: false },
        ],
    },
    {
        question: 'Parmi les situations suivantes, lesquelles sont des agressions sexuelles :',
        points: 1,
        type: 'multiple_choice',
        answers: [
            { answer: "Se frotter à quelqu'un•e", is_correct: true },
            { answer: 'Caresser les fesses de son•sa partenaire endormi•e', is_correct: true },
            { answer: "Embrasser quelqu'un•e de force", is_correct: true },
            { answer: "Embrasser par surprise quelqu'un•e qui danse au milieu de la foule", is_correct: true },
            { answer: "Embrasser quelqu'un•e tant alcoolisé•e qu'iel vient de vomir", is_correct: true },
        ],
    },
    {
        question: "Un.e de tes amis touche les fesses de B et l'enlace. B a un mouvement de recul. Que peux-tu faire ?",
        points: 1,
        type: 'multiple_choice',
        answers: [
            { answer: "Rien de particulier. B ne s'en souviendra sûrement pas.", is_correct: false },
            { answer: 'Demander à B si elle•il va bien', is_correct: true },
            {
                answer: "Prendre cet•te ami•e à part et lui faire comprendre qu'il•elle a mal agi, que B n'avait pas envie d'être touché•e.",
                is_correct: true,
            },
            { answer: 'Eloigner ton ami•e de B', is_correct: true },
            { answer: "Le signaler à un tiers si tu penses que B peut avoir besoin d'aide", is_correct: true },
        ],
    },
    {
        question: "A qui et où peux-tu demander de l'aide si tu en as besoin ?",
        points: 1,
        type: 'multiple_choice',
        answers: [
            { answer: 'Dans une zone dédiée lors des soirées, appelée la Safe Zone', is_correct: true },
            { answer: 'Au stand de prévention', is_correct: true },
            { answer: 'A la team prévention', is_correct: true },
            { answer: "Aux organisateurs de l'intégration (en t-shirt touge)", is_correct: true },
            { answer: "A tes chefs d'équipe", is_correct: true },
            { answer: 'A ta marraine UTTienne/ A ton parrain UTTien', is_correct: true },
            { answer: 'À un•e ami•e', is_correct: true },
        ],
    },
    {
        question:
            'En cas de VSS, quelles sont les peines maximales légalement encourue par une personne ayant commis une agression sexuelle ?',
        points: 1,
        type: 'single_choice',
        answers: [
            { answer: "75 000 € d'amende et 5 ans d'emprisonnement", is_correct: true },
            { answer: "10 000€ d'amende", is_correct: false },
            { answer: '15 ans de prison', is_correct: false },
        ],
    },
    {
        question: 'Quelles sont les conséquences possibles pour la victime de VSS ?',
        points: 1,
        type: 'multiple_choice',
        answers: [
            { answer: 'Aucun effet particulier', is_correct: false },
            { answer: 'Problèmes somatiques (nausées, migraines, fatigue)', is_correct: true },
            { answer: 'Dysfonction sexuelle', is_correct: true },
            { answer: "Crainte de l'intimité", is_correct: true },
            { answer: 'Dépression majeure', is_correct: true },
            { answer: 'Détresse psychologique', is_correct: true },
        ],
    },
    {
        question: 'Que puis-je faire si je suis témoins de VSS ?',
        points: 1,
        type: 'multiple_choice',
        answers: [
            { answer: "Dire à la victime de faire attention à elle et de mieux s'habiller", is_correct: false },
            { answer: 'Aller voir la team prévention ou les super-orgas', is_correct: true },
            { answer: 'Appeler France Victime (01 80 52 33 86)', is_correct: true },
            { answer: "Appeler le numéro d'astreinte", is_correct: true },
        ],
    },
    {
        question:
            "A quelle sentence s'expose une personne commettant un viol ? \n Article 222-23   Version en vigueur depuis le 23 avril 2021 \n Tout acte de pénétration sexuelle, de quelque nature qu'il soit, ou tout acte bucco-génital commis sur la personne d'autrui ou sur la personne de l'auteur par violence, contrainte, menace ou surprise est un viol. \n Le viol est puni de quinze ans de réclusion criminelle.",
        points: 1,
        type: 'multiple_choice',
        answers: [
            { answer: '15 ans de réclusion criminelle', is_correct: true },
            { answer: "100 000€ d'amence et 20 ans de réclusion criminelle", is_correct: false },
            { answer: "100 000€ d'amence et 10 ans de réclusion criminelle", is_correct: false },
        ],
    },
    {
        question: "Qu'est-ce qui est considéré comme un acte de bizutage (et qui est donc interdit) ? ",
        points: 1,
        type: 'multiple_choice',
        answers: [
            { answer: "Se dénuder ou inciter quelqu'un à se dénuder (Limousin, Maréchal...)", is_correct: true },
            { answer: "Obliger quelqu'un à boire de l'alcool de force lors d'une soirée", is_correct: true },
            {
                answer: 'Organiser une chasse au trésor géante à travers toute la ville pour les nouveaux',
                is_correct: false,
            },
            { answer: 'Humilier publiquement un nouveau devant le groupe', is_correct: true },
            { answer: 'Forcer une personne à effectuer des tâches dégradantes ou dangereuses', is_correct: true },
            { answer: "Défier un nouveau à réciter l'annuaire téléphonique en dansant la macarena", is_correct: false },
            { answer: 'Motiver les nouveaux à se déguiser en canard', is_correct: false },
            { answer: 'Forcer les nouveaux à porter un déguisement obscène', is_correct: true },
        ],
    },
    {
        question: "A quelles sanctions s'expose l'auteur du bizutage ?",
        points: 1,
        type: 'multiple_choice',
        answers: [
            { answer: "Une exclusion de l'intégration", is_correct: true },
            { answer: 'Rien du tout', is_correct: false },
            {
                answer: "Le bizutage est un délit. Il est puni de 6 mois d'emprisonnement et de 7 500 € d'amende.",
                is_correct: true,
            },
            { answer: 'Si la victime est une personne vulnérable, les peines sont doublées', is_correct: true },
            { answer: 'Une mauvaise note', is_correct: false },
        ],
    },
];

export const initQcmvss = async () => {
    const existingQuestion = await db.select().from(vssqcmquestionSchema).limit(1);

    if (existingQuestion.length > 0) {
        return;
    }

    for (const seedQuestion of qcmQuestions) {
        const [createdQuestion] = await db
            .insert(vssqcmquestionSchema)
            .values({
                question: seedQuestion.question,
                points: seedQuestion.points,
                type: seedQuestion.type,
            })
            .returning({ id: vssqcmquestionSchema.id });

        if (!createdQuestion) {
            throw new Error(`Question not inserted: ${seedQuestion.question}`);
        }

        await db.insert(vssqcmanswerSchema).values(
            seedQuestion.answers.map((seedAnswer) => ({
                questionid: createdQuestion.id,
                answer: seedAnswer.answer,
                is_correct: seedAnswer.is_correct,
            })),
        );
    }
};
