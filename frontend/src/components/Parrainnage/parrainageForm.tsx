import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const ParrainageNewStudent = () => (
    <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                Tu vas intégrer l'UTT ?
            </CardTitle>
            <p className="text-lg md:text-xl text-gray-700">
                Tu souhaites être accompagné par un étudiant pour découvrir ta nouvelle école ? Remplis vite ce formulaire !
            </p>
        </CardHeader>
        <CardContent className="space-y-10">
            {/* <div className="relative pb-[56.25%] rounded-xl shadow-lg overflow-hidden">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLScThti-8I0ceHVb8RBYPzLcGhXNo2KPMg_nQHshrb6hC8EG_w/viewform?embedded=true"
            className="absolute inset-0 w-full h-full border-none"
            title="Formulaire Parrainage Nouvel Étudiant"
            loading="lazy"
          >
            Chargement…
          </iframe>
        </div> */}
            <p className="text-red-500 font-medium text-center">
                🚫 Ce formulaire n'est pas encore disponible.
            </p>
        </CardContent>
    </Card>
);

export const ParrainageStudent = () => (
    <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                Tu veux devenir parrain/marraine à l'UTT ?
            </CardTitle>
            <p className="text-lg md:text-xl text-gray-700">
                Remplis ce formulaire pour accompagner un nouvel étudiant et lui faire découvrir la vie UTTienne !
            </p>
        </CardHeader>
        <CardContent className="space-y-10">
            {/* <div className="relative pb-[56.25%] rounded-xl shadow-lg overflow-hidden">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLScM8LTorRrysnWNGKAX31Snqo2QQz02032m-CK7lUA0MpBaQQ/viewform?embedded=true"
            className="absolute inset-0 w-full h-full border-none"
            title="Formulaire Parrainage Étudiant Actuel"
            loading="lazy"
          >
            Chargement…
          </iframe>
        </div> */}
            <p className="text-red-500 font-medium text-center">
                🚫 Ce formulaire n'est pas encore disponible.
            </p>
        </CardContent>
    </Card>
);
