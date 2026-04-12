export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 text-white p-8 pb-4 text-center">
            <div className="flex flex-col items-center gap-2">
                <p className="font-semibold">Intégration UTT, un projet du <a href="https://bde.utt.fr" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">BDE UTT</a></p>
                <div className="flex gap-6 mt-1 text-sm">
                    <a href="/legals" className="text-blue-400 hover:underline">Mentions légales</a>
                    <a href="/privacy" className="text-blue-400 hover:underline">Politique de confidentialité</a>
                </div>
                <div className="flex justify-around w-full">
                    <p>&copy; {currentYear} Semaine d'Intégration UTT - <a href="https://bde.utt.fr" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">BDE UTT</a></p>
                    <p>Hébergé et maintenu par <a href="https://uttnetgroup.fr" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">UTT Net Group</a></p>
                </div>
            </div>
        </footer>
    );
}