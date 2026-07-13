import { Link } from "react-router-dom";

export const LegalsSection = () => {

    const ASSOCIATION_ADDRESS = import.meta.env.VITE_ASSOCIATION_ADDRESS;
    const ASSOCIATION_EMAIL = import.meta.env.VITE_ASSOCIATION_EMAIL;
    const ASSOCIATION_NAME = import.meta.env.VITE_ASSOCIATION_NAME;
    const ASSOCIATION_PHONE = import.meta.env.VITE_ASSOCIATION_PHONE;
    const ASSOCIATION_RNA = import.meta.env.VITE_ASSOCIATION_RNA;
    const ASSOCIATION_RCS = import.meta.env.VITE_ASSOCIATION_RCS;
    const BDE_ADDRESS = import.meta.env.VITE_BDE_ADDRESS;
    const BDE_EMAIL = import.meta.env.VITE_BDE_EMAIL;
    const BDE_NAME = import.meta.env.VITE_BDE_NAME;
    const BDE_PHONE = import.meta.env.VITE_BDE_PHONE;
    const BDE_RNA = import.meta.env.VITE_BDE_RNA;
    const BDE_SIRET = import.meta.env.VITE_BDE_SIRET;
    const BDE_SIREN = import.meta.env.VITE_BDE_SIREN;

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
                            <p className="font-semibold">{BDE_NAME}</p>
                            <p className="text-sm text-slate-500 mt-1">Association loi 1901</p>
                            <p className="text-sm text-slate-600 mt-2">N° RNA : {BDE_RNA}</p>
                            <p className="text-sm text-slate-600">N° SIRET : {BDE_SIRET}</p>
                            <p className="text-sm text-slate-600">N° SIREN : {BDE_SIREN}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">{BDE_ADDRESS}</p>
                            <p className="text-sm text-slate-600 mt-2">
                                <a href="tel:{BDE_PHONE}" className="hover:text-blue-700 transition-colors">{BDE_PHONE}</a>
                            </p>
                            <p className="text-sm text-slate-600">
                                <a href="mailto:{BDE_EMAIL}" className="hover:text-blue-700 transition-colors">{BDE_EMAIL}</a>
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 mt-4">
                        Le projet Intégration UTT est porté par l'association {BDE_NAME}.
                    </p>
                </section>

                <section className="surface-card p-6 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-900">Propriétaire et Hébergeur</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <p className="font-semibold">{ASSOCIATION_NAME}</p>
                            <p className="text-sm text-slate-500 mt-1">Association loi 1901</p>
                            <p className="text-sm text-slate-600 mt-2">N° RNA : {ASSOCIATION_RNA}</p>
                            <p className="text-sm text-slate-600">N° RCS : {ASSOCIATION_RCS}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">{ASSOCIATION_ADDRESS}</p>
                            <p className="text-sm text-slate-600 mt-2">
                                <a href="tel:{ASSOCIATION_PHONE}" className="hover:text-blue-700 transition-colors">{ASSOCIATION_PHONE}</a>
                            </p>
                            <p className="text-sm text-slate-600">
                                <a href="mailto:{ASSOCIATION_EMAIL}" className="hover:text-blue-700 transition-colors">{ASSOCIATION_EMAIL}</a>
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
                        L'ensemble du contenu de ce site est protegé par le droit d'auteur. Sauf mention contraire, les contenus relatifs au projet Integration UTT sont diffusés sous la responsabilité du {BDE_NAME}. Toute reproduction, distribution ou modification est interdite sans autorisation écrite préalable.
                    </p>
                </section>

                <section className="surface-card p-6 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-900">Credits</h2>
                    <p className="text-slate-700">
                        Ce site est developpé pour le projet Integration UTT du {BDE_NAME}, avec le support technique de l'association {ASSOCIATION_NAME}.
                    </p>
                </section>
            </div>
        </div>
    </div>
)};
