import { Link } from "react-router-dom";

export const LegalsSection = () => {
    return (
        <div className="bg-slate-50 text-slate-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 text-center p-8 sm:p-10 mb-10 shadow-lg text-white">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3">Mentions Légales</h1>
                    <p className="text-base sm:text-lg text-blue-100">Informations légales et conformité RGPD</p>
                </div>

                <div className="space-y-6 pb-6">
                    <section className="surface-card p-6 sm:p-8">
                        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-900">Editeur du Site</h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <p className="font-semibold">BDE UTT</p>
                                <p className="text-sm text-slate-500 mt-1">Association loi 1901</p>
                                <p className="text-sm text-slate-600 mt-2">N° RNA : W103000735</p>
                                <p className="text-sm text-slate-600">N° SIRET : 44838667200019</p>
                                <p className="text-sm text-slate-600">N° SIREN : 448386672</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">
                                    12 rue Marie Curie
                                    <br />
                                    10000 TROYES
                                </p>
                                <p className="text-sm text-slate-600 mt-2">
                                    <a href="tel:0325717600" className="hover:text-blue-700 transition-colors">03 25 71 76 00</a>
                                </p>
                                <p className="text-sm text-slate-600">
                                    <a href="mailto:bde@utt.fr" className="hover:text-blue-700 transition-colors">bde@utt.fr</a>
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 mt-4">
                            Le projet Intégration UTT est porté par l'association BDE UTT.
                        </p>
                    </section>

                    <section className="surface-card p-6 sm:p-8">
                        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-900">Propriétaire et Hébergeur</h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <p className="font-semibold">UTT Net Group</p>
                                <p className="text-sm text-slate-500 mt-1">Association loi 1901</p>
                                <p className="text-sm text-slate-600 mt-2">N° RNA : W103000699</p>
                                <p className="text-sm text-slate-600">N° RCS : 500164249</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">
                                    12 rue Marie Curie
                                    <br />
                                    10000 TROYES
                                </p>
                                <p className="text-sm text-slate-600 mt-2">
                                    <a href="tel:0325718550" className="hover:text-blue-700 transition-colors">03 25 71 85 50</a>
                                </p>
                                <p className="text-sm text-slate-600">
                                    <a href="mailto:ung@utt.fr" className="hover:text-blue-700 transition-colors">ung@utt.fr</a>
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="surface-card p-6 sm:p-8">
                        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-900">Protection des Données Personnelles</h2>
                        <p className="text-slate-700">
                            Le site collecte et traite des données personnelles conformément a la loi Informatique et Libertés du 6 janvier 1978 modifiée et au RGPD EU-2016/679.
                        </p>
                        <p className="text-sm text-slate-600 mt-3">
                            Pour plus d'informations, consultez notre{" "}
                            <Link to="/privacy" className="font-semibold text-blue-700 hover:text-blue-900 transition-colors">
                                Politique de confidentialite
                            </Link>
                            .
                        </p>
                    </section>

                    <section className="surface-card p-6 sm:p-8">
                        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-900">Droits d'Auteur</h2>
                        <p className="text-slate-700">
                            L'ensemble du contenu de ce site est protegé par le droit d'auteur. Sauf mention contraire, les contenus relatifs au projet Integration UTT sont diffusés sous la responsabilité du BDE UTT. Toute reproduction, distribution ou modification est interdite sans autorisation écrite préalable.
                        </p>
                    </section>

                    <section className="surface-card p-6 sm:p-8">
                        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-900">Credits</h2>
                        <p className="text-slate-700">
                            Ce site est developpé pour le projet Integration UTT du BDE UTT, avec le support technique de l'association UTT Net Group.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};