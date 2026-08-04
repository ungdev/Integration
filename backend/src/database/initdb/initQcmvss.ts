import { and, eq, sql } from 'drizzle-orm';
import { db } from '../db';
import { vssqcmanswerSchema } from '../../schemas/Relational/vssqcmanswer.schema';
import { vssqcmquestionSchema } from '../../schemas/Basic/vssqcmquestion.schema';

type SeedQuestion = {
    question: string;
    questionEn: string;
    points: number;
    type: 'single_choice' | 'multiple_choice';
    answers: {
        answer: string;
        answerEn: string;
        is_correct: boolean;
    }[];
};

const qcmQuestions: SeedQuestion[] = [
    {
        question: 'Oui = ',
        questionEn: 'Yes = ',
        points: 1,
        type: 'single_choice',
        answers: [
            { answer: 'Non', answerEn: 'No', is_correct: false },
            { answer: 'Toujours oui', answerEn: 'Always yes', is_correct: false },
            { answer: 'Peut-être non plus tard', answerEn: 'Maybe no later', is_correct: true },
        ],
    },
    {
        question: 'Non = ',
        questionEn: 'No = ',
        points: 1,
        type: 'single_choice',
        answers: [
            { answer: 'Oui', answerEn: 'Yes', is_correct: false },
            { answer: 'Non', answerEn: 'No', is_correct: true },
            { answer: "Peut-être oui si j'insiste", answerEn: 'Maybe yes if I keep insisting', is_correct: false },
        ],
    },
    {
        question: 'En résumé, le consentement',
        questionEn: 'In short, consent',
        points: 2,
        type: 'multiple_choice',
        answers: [
            { answer: 'concerne une action précise', answerEn: 'concerns a specific act', is_correct: true },
            {
                answer: "ne peut-être considéré comme éclairé venant d'un personne en état d'ébriété",
                answerEn: 'cannot be considered informed when coming from an intoxicated person',
                is_correct: true,
            },
            { answer: 'doit être libre et éclairé', answerEn: 'must be free and informed', is_correct: true },
            { answer: 'peut être retiré à tout moment', answerEn: 'can be withdrawn at any time', is_correct: true },
            {
                answer: "spécifique, enthousiaste; valable quand la personne chancèle sous l'effet de l'alcool",
                answerEn: 'specific, enthusiastic; valid when the person is staggering from alcohol',
                is_correct: false,
            },
            { answer: "peut s'obtenir en insistant", answerEn: 'can be obtained by insisting', is_correct: false },
            {
                answer: 'est valable quand la personne est bourrée',
                answerEn: 'is valid when the person is drunk',
                is_correct: false,
            },
        ],
    },
    {
        question:
            "B a embrassé A de force. B était complètement bourré. Il s'agit d'une agression sexuelle. La prise d'alcool est alors une condition :",
        questionEn:
            'B forced a kiss on A. B was completely drunk. It is a sexual assault. Alcohol consumption is then a:',
        points: 1,
        type: 'single_choice',
        answers: [
            { answer: 'Aggravante', answerEn: 'Aggravating factor', is_correct: true },
            { answer: 'Atténuante', answerEn: 'Mitigating factor', is_correct: false },
        ],
    },
    {
        question: 'Parmi les situations suivantes, lesquelles sont des agressions sexuelles :',
        questionEn: 'Which of the following situations are sexual assaults:',
        points: 1,
        type: 'multiple_choice',
        answers: [
            { answer: "Se frotter à quelqu'un•e", answerEn: 'Rubbing against someone', is_correct: true },
            {
                answer: 'Caresser les fesses de son•sa partenaire endormi•e',
                answerEn: 'Caressing your sleeping partner’s buttocks',
                is_correct: true,
            },
            { answer: "Embrasser quelqu'un•e de force", answerEn: 'Kissing someone by force', is_correct: true },
            {
                answer: "Embrasser par surprise quelqu'un•e qui danse au milieu de la foule",
                answerEn: 'Kissing someone by surprise who is dancing in the middle of the crowd',
                is_correct: true,
            },
            {
                answer: "Embrasser quelqu'un•e tant alcoolisé•e qu'iel vient de vomir",
                answerEn: 'Kissing someone so drunk that they have just vomited',
                is_correct: true,
            },
        ],
    },
    {
        question: "Un.e de tes amis touche les fesses de B et l'enlace. B a un mouvement de recul. Que peux-tu faire ?",
        questionEn: 'One of your friends touches B’s buttocks and hugs them. B steps back. What can you do?',
        points: 1,
        type: 'multiple_choice',
        answers: [
            {
                answer: "Rien de particulier. B ne s'en souviendra sûrement pas.",
                answerEn: 'Nothing special. B probably will not remember it anyway.',
                is_correct: false,
            },
            { answer: 'Demander à B si elle•il va bien', answerEn: 'Ask B if they are okay', is_correct: true },
            {
                answer: "Prendre cet•te ami•e à part et lui faire comprendre qu'il•elle a mal agi, que B n'avait pas envie d'être touché•e.",
                answerEn:
                    'Take that friend aside and make them understand they acted badly, that B did not want to be touched.',
                is_correct: true,
            },
            { answer: 'Eloigner ton ami•e de B', answerEn: 'Move your friend away from B', is_correct: true },
            {
                answer: "Le signaler à un tiers si tu penses que B peut avoir besoin d'aide",
                answerEn: 'Report it to a third party if you think B may need help',
                is_correct: true,
            },
        ],
    },
    {
        question: "A qui et où peux-tu demander de l'aide si tu en as besoin ?",
        questionEn: 'Who can you ask for help, and where, if you need it?',
        points: 1,
        type: 'multiple_choice',
        answers: [
            {
                answer: 'Dans une zone dédiée lors des soirées, appelée la Safe Zone',
                answerEn: 'In a dedicated area during parties, called the Safe Zone',
                is_correct: true,
            },
            { answer: 'Au stand de prévention', answerEn: 'At the prevention booth', is_correct: true },
            { answer: 'A la team prévention', answerEn: 'To the prevention team', is_correct: true },
            {
                answer: "Aux organisateurs de l'intégration (en t-shirt touge)",
                answerEn: 'To the integration organizers (wearing red T-shirts)',
                is_correct: true,
            },
            { answer: "A tes chefs d'équipe", answerEn: 'To your team leaders', is_correct: true },
            {
                answer: 'A ta marraine UTTienne/ A ton parrain UTTien',
                answerEn: 'To your UTT mentor / buddy',
                is_correct: true,
            },
            { answer: 'À un•e ami•e', answerEn: 'To a friend', is_correct: true },
        ],
    },
    {
        question:
            'En cas de VSS, quelles sont les peines maximales légalement encourue par une personne ayant commis une agression sexuelle ?',
        questionEn:
            'In a VSS case, what is the maximum legally punishable sentence for a person who committed sexual assault?',
        points: 1,
        type: 'single_choice',
        answers: [
            {
                answer: "75 000 € d'amende et 5 ans d'emprisonnement",
                answerEn: 'A €75,000 fine and 5 years in prison',
                is_correct: true,
            },
            { answer: "10 000€ d'amende", answerEn: 'A €10,000 fine', is_correct: false },
            { answer: '15 ans de prison', answerEn: '15 years in prison', is_correct: false },
        ],
    },
    {
        question: 'Quelles sont les conséquences possibles pour la victime de VSS ?',
        questionEn: 'What are the possible consequences for a VSS victim?',
        points: 1,
        type: 'multiple_choice',
        answers: [
            { answer: 'Aucun effet particulier', answerEn: 'No particular effect', is_correct: false },
            {
                answer: 'Problèmes somatiques (nausées, migraines, fatigue)',
                answerEn: 'Somatic problems (nausea, migraines, fatigue)',
                is_correct: true,
            },
            { answer: 'Dysfonction sexuelle', answerEn: 'Sexual dysfunction', is_correct: true },
            { answer: "Crainte de l'intimité", answerEn: 'Fear of intimacy', is_correct: true },
            { answer: 'Dépression majeure', answerEn: 'Major depression', is_correct: true },
            { answer: 'Détresse psychologique', answerEn: 'Psychological distress', is_correct: true },
        ],
    },
    {
        question: 'Que puis-je faire si je suis témoins de VSS ?',
        questionEn: 'What can I do if I witness VSS?',
        points: 1,
        type: 'multiple_choice',
        answers: [
            {
                answer: "Dire à la victime de faire attention à elle et de mieux s'habiller",
                answerEn: 'Tell the victim to be careful and dress better',
                is_correct: false,
            },
            {
                answer: 'Aller voir la team prévention ou les super-orgas',
                answerEn: 'Go see the prevention team or the super-organizers',
                is_correct: true,
            },
            {
                answer: 'Appeler France Victime (01 80 52 33 86)',
                answerEn: 'Call France Victime (01 80 52 33 86)',
                is_correct: true,
            },
            { answer: "Appeler le numéro d'astreinte", answerEn: 'Call the on-call number', is_correct: true },
        ],
    },
    {
        question:
            "A quelle sentence s'expose une personne commettant un viol ? \n Article 222-23   Version en vigueur depuis le 23 avril 2021 \n Tout acte de pénétration sexuelle, de quelque nature qu'il soit, ou tout acte bucco-génital commis sur la personne d'autrui ou sur la personne de l'auteur par violence, contrainte, menace ou surprise est un viol. \n Le viol est puni de quinze ans de réclusion criminelle.",
        questionEn:
            'What sentence does a person committing rape face?\n Article 222-23   Valid since April 23, 2021 \n Any act of sexual penetration, of whatever nature, or any oral-genital act committed on another person or on the perpetrator by violence, coercion, threat, or surprise is rape. \n Rape is punishable by fifteen years of criminal imprisonment.',
        points: 1,
        type: 'multiple_choice',
        answers: [
            {
                answer: '15 ans de réclusion criminelle',
                answerEn: '15 years of criminal imprisonment',
                is_correct: true,
            },
            {
                answer: "100 000€ d'amence et 20 ans de réclusion criminelle",
                answerEn: 'A €100,000 fine and 20 years of criminal imprisonment',
                is_correct: false,
            },
            {
                answer: "100 000€ d'amence et 10 ans de réclusion criminelle",
                answerEn: 'A €100,000 fine and 10 years of criminal imprisonment',
                is_correct: false,
            },
        ],
    },
    {
        question: "Qu'est-ce qui est considéré comme un acte de bizutage (et qui est donc interdit) ? ",
        questionEn: 'What is considered hazing (and is therefore prohibited)? ',
        points: 1,
        type: 'multiple_choice',
        answers: [
            {
                answer: "Se dénuder ou inciter quelqu'un à se dénuder (Limousin, Maréchal...)",
                answerEn: 'Undressing or forcing someone to undress (Limousin, Maréchal...)',
                is_correct: true,
            },
            {
                answer: "Obliger quelqu'un à boire de l'alcool de force lors d'une soirée",
                answerEn: 'Forcing someone to drink alcohol at a party',
                is_correct: true,
            },
            {
                answer: 'Organiser une chasse au trésor géante à travers toute la ville pour les nouveaux',
                answerEn: 'Organizing a giant treasure hunt across the whole city for the newcomers',
                is_correct: false,
            },
            {
                answer: 'Humilier publiquement un nouveau devant le groupe',
                answerEn: 'Publicly humiliating a newcomer in front of the group',
                is_correct: true,
            },
            {
                answer: 'Forcer une personne à effectuer des tâches dégradantes ou dangereuses',
                answerEn: 'Forcing a person to perform degrading or dangerous tasks',
                is_correct: true,
            },
            {
                answer: "Défier un nouveau à réciter l'annuaire téléphonique en dansant la macarena",
                answerEn: 'Challenging a newcomer to recite the phone book while dancing the Macarena',
                is_correct: false,
            },
            {
                answer: 'Motiver les nouveaux à se déguiser en canard',
                answerEn: 'Encouraging newcomers to dress up as a duck',
                is_correct: false,
            },
            {
                answer: 'Forcer les nouveaux à porter un déguisement obscène',
                answerEn: 'Forcing newcomers to wear an obscene costume',
                is_correct: true,
            },
        ],
    },
    {
        question: "A quelles sanctions s'expose l'auteur du bizutage ?",
        questionEn: 'What penalties does the person responsible for hazing face?',
        points: 1,
        type: 'multiple_choice',
        answers: [
            {
                answer: "Une exclusion de l'intégration",
                answerEn: 'An exclusion from the integration',
                is_correct: true,
            },
            { answer: 'Rien du tout', answerEn: 'Nothing at all', is_correct: false },
            {
                answer: "Le bizutage est un délit. Il est puni de 6 mois d'emprisonnement et de 7 500 € d'amende.",
                answerEn: 'Hazing is a criminal offense. It is punishable by 6 months in prison and a €7,500 fine.',
                is_correct: true,
            },
            {
                answer: 'Si la victime est une personne vulnérable, les peines sont doublées',
                answerEn: 'If the victim is a vulnerable person, the penalties are doubled',
                is_correct: true,
            },
            { answer: 'Une mauvaise note', answerEn: 'A bad grade', is_correct: false },
        ],
    },
];

const ensureTranslationColumns = async () => {
    await db.execute(sql`ALTER TABLE "vssqcmquestion" ADD COLUMN IF NOT EXISTS "question_en" text;`);
    await db.execute(sql`ALTER TABLE "vssqcmanswer" ADD COLUMN IF NOT EXISTS "answer_en" text;`);
};

const updateQuestionTranslations = async () => {
    for (const seedQuestion of qcmQuestions) {
        await db
            .update(vssqcmquestionSchema)
            .set({ question_en: seedQuestion.questionEn })
            .where(eq(vssqcmquestionSchema.question, seedQuestion.question));

        const [question] = await db
            .select({ id: vssqcmquestionSchema.id })
            .from(vssqcmquestionSchema)
            .where(eq(vssqcmquestionSchema.question, seedQuestion.question));

        if (!question) {
            continue;
        }

        for (const seedAnswer of seedQuestion.answers) {
            await db
                .update(vssqcmanswerSchema)
                .set({ answer_en: seedAnswer.answerEn })
                .where(
                    and(
                        eq(vssqcmanswerSchema.questionid, question.id),
                        eq(vssqcmanswerSchema.answer, seedAnswer.answer),
                    ),
                );
        }
    }
};

export const initQcmvss = async () => {
    await ensureTranslationColumns();

    const existingQuestion = await db.select().from(vssqcmquestionSchema).limit(1);

    if (existingQuestion.length > 0) {
        await updateQuestionTranslations();
        return;
    }

    for (const seedQuestion of qcmQuestions) {
        const [createdQuestion] = await db
            .insert(vssqcmquestionSchema)
            .values({
                question: seedQuestion.question,
                question_en: seedQuestion.questionEn,
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
                answer_en: seedAnswer.answerEn,
                is_correct: seedAnswer.is_correct,
            })),
        );
    }
};
