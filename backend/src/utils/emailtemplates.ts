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
        <img src="https://integration.utt.fr/img/logo_original.png" alt="Integration UTT Logo" style="width: 100px;">
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
            <img src="https://integration.utt.fr/img/logo_original.png" alt="Integration UTT Logo" style="width: 100px;">
            <h1 style="font-size: 21px; font-weight: bold; margin: 10px 0;">INTEGRATION UTT</h1>
        </div>
        <div class="content">

            <p>Salut à toi !!!!</p><p>

            <p>Si tu reçois ce mail, c’est que tu es sur le point de rejoindre l’UTT et de vivre tes premières années en école supérieure.</p>
            
            <p>Mais après toutes ces vacances, il est important de ne pas s’endormir et de vite se remettre au travail !</p>
            
            <p>C’est pourquoi l’intégration te propose un cahier de vacances qui te permettra de te remettre à niveau.</p>
            
            <p>Toutes les bases y sont revues, de la terminale… jusqu’au CP. À toi de nous prouver que tu en es capable ! Méthodologie et rigueur seront nécessaires pour en venir à bout (et pas mal d’humour également).</p>
            
            <p>Ce cahier sera examiné par un jury extrêmement talentueux : des ingénieurs hors pair, ayant déjà prouvé leur valeur lors d’un concours de Ricard sur la plage de Banyuls-sur-Mer.</p>
            
            <p>À toi de leur montrer que tu peux égaler leurs compétences ! Ce jury n’hésitera pas à te récompenser pour tes efforts si tu nous renvoies tes réponses à cette adresse mail.</p>
            <p>Alors si tu veux y participer, tu peux le télécharger juste ici et le renvoyer à <a href="mailto:clement.duranson@utt.fr">clement.duranson@utt.fr</a> avant le dimanche 31 août.</p>
            <a href="{{notebook}}" target="_blank" class="button">Cahier de vacances !</a>
          
            
            <p>Nous serons présents sur les réseaux tout au long de l'été pour te tenir informé(e), te partager des astuces, et plein d'autres trucs trop cools ! </strong>Rejoins le site de l'intégration</strong> pour bien être informé des actus ! Tu as reçu dans le premier mail de notre part, un lien pour réinitialiser ton mot de passe et te connecter.</p>
            <a href="https://integration.utt.fr/" target="_blank" class="button">Inscris toi !</a>
            <p>Pense aussi à rejoindre notre Discord, c'est uniquement par ce biais que tu pourras <strong>contacter tes chefs d'équipe</strong> et en savoir plus sur l'intégration ! </p>
            <a href="https://discord.gg/Ea8XwgX5HS" target="_blank" class="button">Rejoindre Discord</a>
              <p>Alors, bon courage à toi, nous sommes impatients de lire tes meilleures réponses.</p>
            
            <p>À très vite !</p>
            
            <p>Toute l’équipe de l’intégration</p>
        </div>
        <div class="footer">
            <p style="font-size: 16px; font-weight: bold;">Rejoins nous sur les réseaux !</p>
            <div class="social-icons">
                <a href="https://www.facebook.com/bde.utt" target="_blank" rel="noopener"><img src="https://cdn.tools.unlayer.com/social/icons/rounded/facebook.png" alt="Facebook"></a>
                <a href="https://twitter.com/bdeutt" target="_blank" rel="noopener"><img src="https://cdn.tools.unlayer.com/social/icons/rounded/twitter.png" alt="Twitter"></a>
                <a href="https://www.instagram.com/bdeutt" target="_blank" rel="noopener"><img src="https://cdn.tools.unlayer.com/social/icons/rounded/instagram.png" alt="Instagram"></a>
                <a href="https://discord.gg/Ea8XwgX5HS" target="_blank">
            <img src="https://cdn.tools.unlayer.com/social/icons/rounded/discord.png" alt="Discord">
        </a>
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
                            <img src="https://integration.utt.fr/img/logo_original.png" alt="Logo Comic" style="width: 18%; max-width: 104.4px; height: auto;">
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

                    <!-- Bloc FRANÇAIS -->
                    <tr>
                        <td align="center" style="padding: 10px;">
                            <img src="https://integration.utt.fr/img/logo_original.png" alt="Logo Comic" style="width: 18%; max-width: 104.4px; height: auto;">
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
                            <p>Bravo pour ton admission à l'UTT ! Nous sommes l'équipe d'intégration, des étudiants bénévoles qui préparent minutieusement ton arrivée pour que celle-ci reste inoubliable.</p>
                            <p>Un tas d'événements incroyables, dont la participation est basée sur le volontariat, t'attendent dès le <strong><u>Lundi 1er Septembre</u></strong> que tu arrives en 1ère année, en 3ème année, en master ou en Bachelor.</p>
                            <p>Tout est fait pour que tu t'éclates et que tu rencontres les personnes qui feront de ton passage à l'UTT un moment inoubliable. Mais avant toute chose, il faut te préparer.</p>
                            <p>Assure-toi de réaliser les tâches suivantes avant ton arrivée :</p>
                            <p>Pour pouvoir te connecter au site de l'intégration il te suffit de changer ton mot de passe en cliquant sur ce lien suivant : </p>

                            <p><a href="https://integration.utt.fr/Register?token={{token}}" style="color: #e74160; font-weight: bold;" target="_blank">Changer ton mot de passe</a></p>
                                                        <p style="color: red; font-weight: bold;">Attention, ce lien est valable uniquement une fois !</p>
                            <p>Une fois cela fait, tu pourras te connecter à ton compte et y retrouver toutes les informations relatives aux événements de la semaine via le lien suivant : <p><a href="https://integration.utt.fr/" style="color: #e74160; font-weight: bold;" target="_blank">https://integration.utt.fr</a></p>Pense aussi à lier ton compte discord via la rubrique <strong>"Mon Compte" </strong> pour échanger avec les membres de ton équipe et avec les autres arrivants.
                            <p></p>
                            <p style="font-size: 11pt; margin: 0;">Lorsque tu arrives à l'UTT, un.e étudiant.e plus ancien.ne devient ton parrain ou ta marraine. Il ou elle sera ton contact privilégié pour découvrir l'école mais aussi la vie étudiante troyenne et répondre à toutes tes questions que ce soit sur l'UTT, les logements, les cours, la vie à Troyes,...</p>
                            <p style="font-size: 11pt; margin: 10px 0;">Pour t'attribuer quelqu'un qui te correspond au mieux on t'invite à remplir <a href="https://docs.google.com/forms/d/e/1FAIpQLScThti-8I0ceHVb8RBYPzLcGhXNo2KPMg_nQHshrb6hC8EG_w/viewform?pli=1&fbzx=-7742379441906364887" style="color: #e74160; font-weight: bold;" target="_blank">ce questionnaire</a></p>
                            <p style="font-size: 15px; font-weight: bold; margin: 20px 0;">Pense à nous rejoindre sur les réseaux sociaux !</p>
                            <p style="margin: 0;">
                                <a href="https://www.facebook.com/bde.utt" target="_blank">
                                    <img src="https://cdn.tools.unlayer.com/social/icons/rounded/facebook.png" alt="Facebook" style="width: 33%; max-width: 30.37px; height: auto; margin: 5px;">
                                </a>
                                <a href="https://www.instagram.com/bde.utt" target="_blank">
                                    <img src="https://cdn.tools.unlayer.com/social/icons/rounded/instagram.png" alt="Instagram" style="width: 33%; max-width: 30.37px; height: auto; margin: 5px;">
                                </a>
                                <a href="https://discord.gg/Ea8XwgX5HS" target="_blank">
                                    <img src="https://cdn.tools.unlayer.com/social/icons/rounded/discord.png" alt="Discord" style="width: 33%; max-width: 30.37px; height: auto; margin: 5px;">
                                </a>
                            </p>
                        </td>
                    </tr>

                    <!-- Séparateur -->
                    <tr>
                        <td style="border-top: 2px solid #ccc; padding: 20px 0;"></td>
                    </tr>

                    <!-- Bloc ENGLISH -->
                                        <tr>
                        <td align="center" style="padding: 10px;">
                            <img src="https://integration.utt.fr/img/logo_original.png" alt="Logo Comic" style="width: 18%; max-width: 104.4px; height: auto;">
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 21px; font-weight: bold; line-height: 240%; margin: 20px 0; text-align: center;">
                            INTEGRATION UTT
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 15px; line-height: 140%; margin: 20px 0; text-align: center;">
    <p>Hello there, newcomer!</p>
    <p>Congratulations on your admission to UTT! We are the integration team – volunteer students who are carefully preparing your arrival to make it truly unforgettable.</p>
    <p>A bunch of amazing events, all based on voluntary participation, await you starting on <strong><u>Monday, September 1st</u></strong>, whether you're arriving in your 1st year, 3rd year, Master's or Bachelor’s program.</p>
    <p>Everything is set up for you to have fun and meet the people who will make your time at UTT unforgettable. But first things first – it’s time to get ready.</p>
    <p>Please make sure to complete the following tasks before you arrive:</p>
    <p>To access the integration website, you just need to change your password by clicking the following link:</p>

    <p><a href="https://integration.utt.fr/Register?token={{token}}" style="color: #e74160; font-weight: bold;" target="_blank">Change your password</a></p>
    <p style="color: red; font-weight: bold;">Warning: this link is valid only once!</p>
    <p>Once that’s done, you’ll be able to log into your account and find all the information about the integration week events here: <p><a href="https://integration.utt.fr/" style="color: #e74160; font-weight: bold;" target="_blank">https://integration.utt.fr</a></p>Also, don’t forget to link your Discord account via the <strong>"My Account"</strong> section so you can connect with your team and the other newcomers.
    <p></p>
    <p style="font-size: 11pt; margin: 0;">When you arrive at UTT, an older student will become your mentor ("parrain" or "marraine"). They will be your main contact to help you discover the school and student life in Troyes, and to answer any questions you may have about UTT, housing, classes, life in Troyes, etc.</p>
    <p style="font-size: 11pt; margin: 10px 0;">To match you with someone who fits you best, we invite you to fill out <a href="https://docs.google.com/forms/d/e/1FAIpQLScThti-8I0ceHVb8RBYPzLcGhXNo2KPMg_nQHshrb6hC8EG_w/viewform?pli=1&fbzx=-7742379441906364887" style="color: #e74160; font-weight: bold;" target="_blank">this questionnaire</a></p>
    <p style="font-size: 15px; font-weight: bold; margin: 20px 0;">Don't forget to follow us on social media!</p>
    <p style="margin: 0;">
        <a href="https://www.facebook.com/bde.utt" target="_blank">
            <img src="https://cdn.tools.unlayer.com/social/icons/rounded/facebook.png" alt="Facebook" style="width: 33%; max-width: 30.37px; height: auto; margin: 5px;">
        </a>
        <a href="https://www.instagram.com/bde.utt" target="_blank">
            <img src="https://cdn.tools.unlayer.com/social/icons/rounded/instagram.png" alt="Instagram" style="width: 33%; max-width: 30.37px; height: auto; margin: 5px;">
        </a>
        <a href="https://discord.gg/Ea8XwgX5HS" target="_blank">
            <img src="https://cdn.tools.unlayer.com/social/icons/rounded/discord.png" alt="Discord" style="width: 33%; max-width: 30.37px; height: auto; margin: 5px;">
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

export const templateNotifyNews = `
  <div style="background-color: #f0f0f0; padding: 30px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 30px; border-radius: 8px; font-family: Arial, sans-serif; font-size: 14px; color: #333; text-align: center;">
      
      <!-- Logo centré -->
      <div style="margin-bottom: 20px;">
        <img src="https://integration.utt.fr/img/logo_original.png" alt="Logo Intégration UTT" style="width: 120px; height: auto; margin: 0 auto; display: block;">
        <h1 style="font-size: 24px; color: #e74160; margin-top: 10px;">Intégration UTT</h1>
      </div>

      <!-- Contenu -->
      <h2 style="color: #e74160; font-size: 20px; margin-bottom: 10px;">🗞️ Nouvelle actu !</h2>
      <h3 style="margin: 10px 0; font-size: 18px;">{{title}}</h3>
      <p style="margin: 10px 0; color: #555;">👉 Rendez-vous sur le site de l'inté dans l'onglet <strong>News</strong> pour en savoir plus.</p>

      <!-- Bouton -->
      <p style="margin-top: 20px;">
        <a href="https://integration.utt.fr" style="display: inline-block; padding: 12px 20px; background-color: #e74160; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">Accéder au site</a>
      </p>
    </div>
  </div>
`;



// Fonction pour compiler le template
export const compileTemplate = (data: any, templateName: string) => {
    const compiledTemplate = Handlebars.compile(templateName);
    return compiledTemplate(data);
};
