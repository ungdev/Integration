export const PrivacySection = () => (
    <div className="bg-slate-50 text-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 text-center p-8 sm:p-10 mb-10 shadow-lg text-white">
                <h1 className="text-3xl sm:text-4xl font-bold mb-3">Politique de Confidentialité</h1>
                <p className="text-base sm:text-lg text-blue-100">Vos données personnelles et votre vie privée</p>
            </div>

            <div className="space-y-6 pb-6">
                <section className="surface-card p-6 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-900">Vie Privée et Données à Caractère Personnel</h2>
                    <p className="text-slate-700">
                        A l'Université de Technologie de Troyes et au sein des associations BDE UTT et UTT Net Group, nous respectons votre vie privée. Les données collectées et utilisées par la plateforme Integration UTT sont nécessaires pour la gestion des membres, des inscriptions aux évènements et des services propoés pendant l'intégration.
                    </p>
                </section>

                <section className="surface-card p-6 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-900">Données Personnelles Collectées</h2>
                    <p className="text-sm text-slate-600 mb-3">
                        Les données suivantes sont effectivement stockées et traitées par la plateforme Intégration UTT.
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-slate-700">
                        <li>Identité: nom, prenom</li>
                        <li>Coordonnées: adresse email UTT, contact saisi dans le profil (optionnel)</li>
                        <li>Données de compte: mot de passe de connexion chiffré, date de création</li>
                        <li>Informations profil: branche/niveau suivie à l'UTT, majorité</li>
                        <li>Liaison externe optionnelle: identifiant Discord en cas de connexion Discord (optionnel)</li>
                        <li>Organisation intégration: éuipe, faction, rôles et préférences de rôles/commissions (optionnel, pour les organisateurs uniquement)</li>
                        <li>Participation aux services: inscriptions permanences, attribution bus, binôme tente, validations de challenges</li>
                    </ul>
                </section>

                <section className="surface-card p-6 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-900">Comment Ces Informations Sont-Elles Utilisées ?</h2>
                    <p className="text-sm text-slate-600 mb-3">
                        Les données à caractère personnel sont des informations qui permettent sous quelque forme que ce soit, directement ou indirectement, l'identification des personnes physiques auxquelles elles s'appliquent.
                    </p>
                    <p className="font-semibold mb-2 text-slate-800">Ces informations sont utilisées pour :</p>
                    <ul className="list-disc pl-6 space-y-1 text-slate-700">
                        <li>Permettre l'authentification (mot de passe ou CAS), la gestion de session et la sécurisation des accès</li>
                        <li>Gérer les comptes utilisateurs, les droits d'accès et les rôles d'organisation</li>
                        <li>Permettre les fonctionnalités du site: profil, affectations d'equipes/factions, permanences, bus, tentes, challenges et évènements</li>
                        <li>Afficher certaines informations aux organisateurs pour la coordination opérationnelle (ex: contact, équipe, rôle)</li>
                        <li>Lier un compte Discord lorsque l'utilisateur active cette option</li>
                        <li>Executer des opérations d'administration (support, import/export, modération et gestion interne)</li>
                    </ul>
                </section>

                <section className="surface-card p-6 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-900">Durée de Conservation des Données</h2>
                    <p className="text-slate-700 mb-2">
                        Les données personnelles sont conservées pendant un (1) an maximum, puis supprimées.
                        <br />
                        Des données anonymisées peuvent être conservées à des fins statistiques et d'amélioration du service, mais ne permettent pas l'identification des individus.
                    </p>
                    <p className="text-slate-700">Les cookies de session sont détruits à la déconnexion ou à leur expiration.</p>
                </section>

                <section className="surface-card p-6 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-900">Vos Droits sur Vos Données</h2>
                    <p className="text-sm text-slate-600 mb-3">Conformément à la réglementation sur les données à caractère personnel, vous disposez des droits suivants :</p>
                    <ul className="list-disc pl-6 space-y-1 text-slate-700">
                        <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
                        <li><strong>Droit de rectification :</strong> corriger des données inexactes vous concernant</li>
                        <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
                        <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
                        <li><strong>Droit à la portabilité :</strong> récupérer vos données dans un format structuré</li>
                    </ul>
                </section>

                <section className="surface-card p-6 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-900">Comment Exercer Vos Droits ?</h2>
                    <p className="text-slate-700 mb-3">Si vous avez des questions ou que vous souhaitez exercer vos droits (accès, rectification, suppression), vous pouvez :</p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-700">
                        <li>
                            Envoyer un courriel à {" "}
                            <a href="mailto:integration@utt.fr" className="font-semibold text-blue-700 hover:text-blue-900 transition-colors">
                                integration@utt.fr
                            </a>
                        </li>
                        <li>
                            Contacter le délégué à la protection des données :{" "}
                            <a href="mailto:ung+dpo@utt.fr" className="font-semibold text-blue-700 hover:text-blue-900 transition-colors">
                                ung+dpo@utt.fr
                            </a>
                        </li>
                        <li>
                            Par courrier : UTT Net Group, 12 rue Marie Curie, CS 42060, 10004 TROYES CEDEX
                        </li>
                    </ul>
                    <p className="text-sm text-slate-600 mt-3">
                        Si vous estimez, après nous avoir contacté, que vos droits ne sont pas respectés, vous pouvez adresser une réclamation en ligne à la CNIL ou par voie postale.
                    </p>
                </section>

                <section className="surface-card p-6 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-900">Responsable du Traitement</h2>
                    <p className="text-slate-700 mb-2">
                        Le responsable du traitement des données pour la plateforme Intégration UTT est <strong>Arthur Dodin</strong>, Président de l'association UTT Net Group.
                    </p>
                    <p className="text-slate-700">
                        L'équipe technique et les administrateurs du site pourront accéder aux données dans le cadre de la gestion de la plateforme et du support technique.
                    </p>
                </section>

                <section className="surface-card p-6 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-900">Sécurité des Données</h2>
                    <p className="text-slate-700 mb-2">
                        Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées afin de garantir un niveau de sécurité adapté au risque, conformément aux exigences du RGPD.
                    </p>
                    <p className="text-slate-700">Ces données ne seront en aucun cas échangées, distribuées ou vendues à un tiers.</p>
                </section>

                <section className="surface-card p-6 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-900">Cookies</h2>
                    <p className="text-slate-700 mb-2">
                        Nous utilisons des cookies afin d'obtenir des statistiques sur notre site web. Ces informations ne seront en aucun cas vendues, échangées ou données. Ces cookies sont anonymisés.
                    </p>
                    <p className="text-slate-700">
                        Afin d'assurer le fonctionnement du service à l'utilisateur authentifié, des cookies de session sont inscrits sur le navigateur lors de l'authentification sur le site. Ceux-ci ont pour seule fonction d'assurer la persistance de la session authentifiée de l'utilisateur. Ils sont détruits lors de la déconnexion ou à leur expiration.
                    </p>
                </section>
            </div>
        </div>
    </div>
);
