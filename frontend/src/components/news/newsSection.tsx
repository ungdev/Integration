import { useEffect, useState } from "react";

import { type News } from "../../interfaces/news.interface";
import { getAllPublished } from "../../services/requests/news.service";
import { Button } from "../ui/button";

const typeColors: Record<string, string> = {
    info: "bg-blue-100 text-blue-800",
    warning: "bg-yellow-100 text-yellow-800",
    event: "bg-purple-100 text-purple-800",
};

export const MyNews = () => {
    const [actus, setActus] = useState<News[]>([]);
    const [filteredType, setFilteredType] = useState<string>("all");
    const [loading, setLoading] = useState(true);

    const fetchNews = async () => {
        try {
            const response = await getAllPublished();
            setActus(response.data);
        } catch (err) {
            alert("Erreur lors du chargement des actus." + err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const filteredActus = filteredType === "all"
        ? actus
        : actus.filter((n) => n.type === filteredType);

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">
                🗞️ Mes Actus
            </h2>

            {/* Filtres */}
            <div className="flex justify-center gap-3 mb-6 flex-wrap">
                <Button onClick={() => setFilteredType("all")} variant={filteredType === "all" ? "default" : "outline"}>
                    Toutes
                </Button>
                <Button onClick={() => setFilteredType("info")} variant={filteredType === "info" ? "default" : "outline"}>
                    Infos
                </Button>
                <Button onClick={() => setFilteredType("event")} variant={filteredType === "event" ? "default" : "outline"}>
                    Événements
                </Button>
                <Button onClick={() => setFilteredType("warning")} variant={filteredType === "warning" ? "default" : "outline"}>
                    Alertes
                </Button>
            </div>

            {/* Actus */}
            {loading ? (
                <p className="text-center text-gray-600">Chargement en cours...</p>
            ) : filteredActus.length === 0 ? (
                <p className="text-center text-gray-600">Aucune actu pour le moment.</p>
            ) : (
                <ul className="space-y-6">
                    {filteredActus.map((news) => (
                        <li
                            key={news.id}
                            className={`surface-card p-5 ${typeColors[news.type] || "bg-gray-100 text-gray-800"}`}
                        >
                            {news.image_url && (
                                <img
                                    src={news.image_url}
                                    alt={news.title}
                                    className="w-full h-auto rounded-xl mb-4"
                                />
                            )}
                            <h3 className="text-xl font-bold mb-2">{news.title}</h3>
                            <p className="text-sm mb-2 whitespace-pre-line">{news.description}</p>
                            <p className="text-xs text-gray-500 italic">
                                Publié le {new Date(news.created_at).toLocaleDateString("fr-FR")}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
