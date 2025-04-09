import Handlebars from 'handlebars';

// Template pour l'e-mail de réinitialisation de mot de passe
export const templateResetPassword = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation de mot de passe</title>
</head>
<body style="font-family: 'Comic Sans MS', 'Comic Sans', sans-serif; font-size: 12pt; margin: 0; padding: 0; background-color: #ffffff; text-align: center;">
    <div class="header">
        <img src="https://integration.utt.fr/ressources/logo_original.png" alt="Integration UTT Logo" style="width: 100px;">
        <h1 style="font-size: 21px; font-weight: bold; margin: 10px 0;">INTEGRATION UTT</h1>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 20px;">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 100%; margin: 0 auto; background-color: #f8f8f8; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <h2 style="font-size: 24px; margin: 0;">Réinitialisation de mot de passe</h2>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px; text-align: left; font-size: 16px;">
                            <p>Bonjour,</p>
                            <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :</p>
                            <p style="text-align: center; margin: 30px 0;">
                                <a href="{{resetLink}}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #e74160; text-decoration: none; border-radius: 4px;">Réinitialiser mon mot de passe</a>
                            </p>
                            <p><strong>Attention le lien n'est valide que pendant 1h.</strong></p>
                            <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet e-mail.</p>
                            <p>Merci,</p>
                            <p>L'équipe intégration UTT</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <p style="font-size: 12px; color: #999999;">Si vous avez des questions, n'hésitez pas à <a href="mailto:integration@utt.fr" style="color: #e74160; text-decoration: none;">nous contacter</a>.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;


export const templateNotebook = `
<!DOCTYPE html>
<html>
<head>
    <title>Integration UTT</title>
    <style>
        body {
            font-family: 'Comic Sans MS', 'Comic Sans', sans-serif;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            box-sizing: border-box;
        }
        .header, .footer {
            text-align: center;
        }
        .content {
            text-align: center;
            font-size: 15px;
        }
        .content p {
            line-height: 1.4;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 10px 0;
            background-color: #e74160;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
        }
        .social-icons {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 10px 0;
        }
        .social-icons a {
            margin: 0 10px;
        }
        .social-icons img {
            width: 30px;
            height: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://integration.utt.fr/ressources/logo_original.png" alt="Integration UTT Logo" style="width: 100px;">
            <h1 style="font-size: 21px; font-weight: bold; margin: 10px 0;">INTEGRATION UTT</h1>
        </div>
        <div class="content">
            <p>Hello petit nouveau ! Pour commencer l’intégration dès maintenant, on t’a préparé un petit cahier de vacances !! Rien de sérieux ni d'obligatoire ne t’inquiète pas, mais de quoi t’occuper avant la rentrée. Alors si tu veux y participer, tu peux le télécharger juste ici et le renvoyer à <a href="mailto:integration+cahier@utt.fr">integration+cahier@utt.fr</a> avant le lundi 26 août. Nous te renverrons ensuite ta correction, et si tu as été assez drôle tu pourras même apparaître dans le best of du cahier de vacances !! Bisous et à la rentrée !!</p>
            <a href={{notebook}} target="_blank" class="button">Cahier de vacances !</a>
            <p>Nous serons présents sur les réseaux tout au long de l'été pour te tenir informé(e), te partager des astuces, et plein d'autres trucs trop cools ! Rejoins le site de l'intégration pour bien être informé des actus !</p>
            <a href="https://integration.utt.fr/" target="_blank" class="button">Inscris toi !</a>
            <p>Pense aussi à rejoindre notre Discord, tu pourras y discuter avec des nouveaux, et poser tes questions aux étudiants déjà à l'UTT !</p>
            <a href="https://discord.gg/Ea8XwgX5HS" target="_blank" class="button">Rejoindre Discord</a>
        </div>
        <div class="footer">
            <p style="font-size: 16px; font-weight: bold;">Rejoins nous sur les réseaux !</p>
            <div class="social-icons">
                <a href="https://www.facebook.com/bde.utt" target="_blank" rel="noopener"><img src="https://cdn.tools.unlayer.com/social/icons/rounded/facebook.png" alt="Facebook"></a>
                <a href="https://twitter.com/bdeutt" target="_blank" rel="noopener"><img src="https://cdn.tools.unlayer.com/social/icons/rounded/twitter.png" alt="Twitter"></a>
                <a href="https://www.instagram.com/bdeutt" target="_blank" rel="noopener"><img src="https://cdn.tools.unlayer.com/social/icons/rounded/instagram.png" alt="Instagram"></a>
            </div>
        </div>
    </div>
</body>
</html>

`;

export const templateAttributionBus = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Intégration UTT</title>
    <style>
        /* Style de la liste */
        .custom-list {
            list-style-type: none; /* Supprime les puces par défaut */
            padding: 0;
            margin: 0;
            text-align: center; /* Centre la liste dans son conteneur */
        }

        .custom-list li {
            position: relative;
            padding-left: 30px; /* Espace pour le tiret */
            text-align: left; /* Aligne le texte à gauche dans chaque élément */
        }

        .custom-list li::before {
            content: "-"; /* Tiret avant chaque élément */
            position: absolute;
            left: 0; /* Place le tiret à gauche de chaque élément */
            top: 0;
            font-weight: bold; /* Optionnel : rend le tiret plus gras */
        }
    </style>
</head>
<body style="font-family: 'Comic Sans MS', 'Comic Sans', sans-serif; font-size: 11pt; margin: 0; padding: 0; background-color: #ffffff; text-align: center;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 20px;">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 100%; margin: 0 auto;">
                    <tr>
                        <td align="center" style="padding: 10px;">
                            <img src="https://integration.utt.fr/ressources/logo_original.png" alt="Logo Comic" style="width: 18%; max-width: 104.4px; height: auto;">
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 21px; font-weight: bold; line-height: 240%; margin: 20px 0; text-align: center;">
                            INTEGRATION UTT
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 15px; line-height: 140%; margin: 20px 0; text-align: center;">
                            <p>Salut !</p>
                            <p>Si tu reçois ce message c'est que tu pars au WEI (youhouu !), tu trouveras dans celui-ci le bus avec lequelle tu vas te rendre sur le lieu pour ce week-end</p>
                            <p>Fais bien attention à ne <strong>pas être en retard</strong> sous peine de rater ton bus, ça serait embêtant à la fois pour toi et pour nous.</p>
                            <p>Autre point très important, les essentiels pour le WEI, tu trouveras ci-dessous un rappel des objets obligatoire à ramener pour passer un bon week-end. Il risque de pleuvoir alors prévoyez bien en conséquences !</p>
                            <ul style="list-style-type: disc; padding: 0; margin: 0; text-align: left; display: inline-block; padding-left: 20px;">
                                <li>Un sac de couchage chaud</li>
                                <li>Des vêtements qui ne craignent rien (dès le départ en bus vendredi matin)</li>
                                <li>Des vêtements qui tiennent chaud</li>
                                <li>Un matelas gonflable ou un tapis de sol (pour le confort du dodo)</li>
                                <li>Un k-way</li>
                                <li>Ta carte d'identité</li>
                                <li>De l'argent (CB et/ou espèces) si tu veux pouvoir acheter à boire au WEI</li>
                                <li>Une serviette et du savon (si tu veux être propre</li>
                                <li>Une bombe anti-moustique (ton corps te remerciera)</li>
                                <li>De la crème solaire (ton corps te remerciera aussi)</li>
                                <li>Ton autorisation parentale si tu es mineur</li>
                                <li>Des bouchons d'oreilles si tu en as</li>
                                <li>Ton écocup, ton tupperware ainsi que des couverts (sinon, tu dis au revoir au miam miam)
                                </li>
                            </ul>
                            <p>Pour rappel, voici la vidéo des indispensables du WEI <a
                        href="https://drive.google.com/file/d/1IzeIgHVcoFB4Wk4ngky1HicoBbd08zHO/view?usp=drivesdk"
                        target="_blank"
                        rel="noopener noreferrer">ici</a></p>
                            <p>Concernant ton bus, tu as été attribué au bus <strong>{{bus}}</strong></p>
                            <p>Maintenant il faut que tu sois présent en amphi de verdure à l'UTT à <strong>{{time}}</strong></p>
                            <p>Voilà, toute l'équipe de l'intégration te souhaite un excellent WEI ;)</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

`;


export const templateWelcome = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Intégration UTT</title>
</head>
<body style="font-family: 'Comic Sans MS', 'Comic Sans', sans-serif; font-size: 11pt; margin: 0; padding: 0; background-color: #ffffff; text-align: center;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 20px;">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 100%; margin: 0 auto;">
                    <tr>
                        <td align="center" style="padding: 10px;">
                            <img src="https://integration.utt.fr/ressources/logo_original.png" alt="Logo Comic" style="width: 18%; max-width: 104.4px; height: auto;">
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 21px; font-weight: bold; line-height: 240%; margin: 20px 0; text-align: center;">
                            INTEGRATION UTT
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 15px; line-height: 140%; margin: 20px 0; text-align: center;">
                            <p>Salut à toi jeune nouveau !</p>
                            <p>Bravo pour ton acceptation à l'UTT ! Nous sommes l'équipe d'intégration, des étudiants bénévoles qui préparent minutieusement ton arrivée pour que celle-ci reste inoubliable.</p>
                            <p>Un tas d'événements incroyables, tous basés sur la base du volontariat, t'attendent dès le <strong><u>Lundi 2 Septembre</u></strong> si tu arrives en première année et dès le <strong><u>Mardi 3 Septembre</u></strong> si tu arrives en 3ème année ou en master.</p>
                            <p>Tout est fait pour que tu t'éclates et que tu rencontres les personnes qui feront de ton passage à l'UTT un moment inoubliable. Mais avant toute chose, il faut te préparer.</p>
                            <p>Assure-toi de réaliser les tâches suivantes avant ton arrivée :</p>
                            <ul style="list-style-type: disc; padding: 0; margin: 0; text-align: left; display: inline-block; padding-left: 20px;">
                                <li style="margin-bottom: 10px;">Connecte-toi et crée ton compte sur le site de l'intégration pour qu'on puisse avoir ton moyen de contact !</li>
                            </ul>
                            <p>Maintenant, il te suffit de changer ton mot de passe en cliquant sur ce lien :</p>
                            <p><a href="https://integration.utt.fr/Register?token={{token}}" style="color: #e74160; font-weight: bold;" target="_blank">Changer ton mot de passe</a></p>
                            <p>Une fois cela fait, tu pourras te connecter à ton compte.</p>
                            <p style="color: red; font-weight: bold;">Attention, ce lien est valable uniquement une fois !</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="margin-top: 20px; text-align: center;">
                            <p style="font-size: 11pt; margin: 0;">Lorsque tu arrives à l'UTT, un.e étudiant.e plus ancien.ne devient ton parrain ou ta marraine. Il ou elle sera ton contact privilégié pour découvrir l'école mais aussi la vie étudiante troyenne et répondre à toutes tes questions que ce soit sur l'UTT, les logements, les cours, la vie à Troyes,...</p>
                            <p style="font-size: 11pt; margin: 10px 0;">Pour t'attribuer quelqu'un qui te correspond au mieux on t'invite à remplir ce questionnaire :</p>
                            <p style="margin: 0;"><a href="https://docs.google.com/forms/d/e/1FAIpQLScRSe2IMVGRA9jMhifQTJiGWbyPJIh6f5g-Spzel9dwhGmMFA/viewform?usp=sf_link" style="color: #657c7f; text-decoration: none;" target="_blank">https://docs.google.com/forms/d/e/1FAIpQLScRSe2IMVGRA9jMhifQTJiGWbyPJIh6f5g-Spzel9dwhGmMFA/viewform?usp=sf_link</a></p>
                            <p style="font-size: 15px; font-weight: bold; margin: 20px 0;">Pense à nous rejoindre sur les réseaux sociaux !</p>
                            <p style="margin: 0;">
                                <a href="https://www.facebook.com/bde.utt" target="_blank">
                                    <img src="https://cdn.tools.unlayer.com/social/icons/rounded/facebook.png" alt="Facebook" style="width: 33%; max-width: 30.37px; height: auto; margin: 5px;">
                                </a>
                                <a href="https://www.instagram.com/bde.utt" target="_blank">
                                    <img src="https://cdn.tools.unlayer.com/social/icons/rounded/instagram.png" alt="Instagram" style="width: 33%; max-width: 30.37px; height: auto; margin: 5px;">
                                </a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>



`;
// Fonction pour compiler le template
export const compileTemplate = (data: any, templateName: string) => {
  const compiledTemplate = Handlebars.compile(templateName);
  return compiledTemplate(data);
};
