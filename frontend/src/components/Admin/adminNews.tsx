import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { type News } from "../../interfaces/news.interface";
import {
    createNews,
    deleteNews,
    getAllNews,
    publishNews,
    updateNews,
} from "../../services/requests/news.service";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export const AdminNews = () => {
    const [newsList, setNewsList] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "info",
        published: false,
        target: "Tous",
    });

    const fetchNews = async () => {
        try {
            const response = await getAllNews();
            setNewsList(response);
        } catch {
            Swal.fire("❌ Erreur", "Erreur lors du chargement des actus", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleCreateOrUpdate = async () => {
        try {
            const formDataToSend = new FormData();

            if (selectedFile) {
                formDataToSend.append("file", selectedFile);
            }

            formDataToSend.append("title", formData.title);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("type", formData.type);
            formDataToSend.append("published", String(formData.published));
            formDataToSend.append("target", formData.target);

            let response;
            if (editingId) {
                formDataToSend.append("id", String(editingId));
                response = await updateNews(formDataToSend);
            } else {
                response = await createNews(formDataToSend);
            }

            await Swal.fire("✅ Succès", response.message, "success");
            resetForm();
            fetchNews();
        } catch (err: any) {
            Swal.fire("❌ Erreur", err.response?.data?.msg || "Erreur lors de la sauvegarde", "error");
        }
    };

    const handleDeleteNews = async (newsId: number) => {
        const confirmDelete = await Swal.fire({
            title: "⚠️ Supprimer cette actu ?",
            text: "Es-tu sûr de vouloir la supprimer ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Non",
        });

        if (!confirmDelete.isConfirmed) return;

        try {
            const response = await deleteNews(newsId);
            await Swal.fire("✅ Supprimée", response.message, "success");
            resetForm();
            fetchNews();
        } catch {
            Swal.fire("❌ Erreur", "Erreur lors de la suppression de l'actu", "error");
        }
    };

    const handlePublish = async (news: News) => {
        const confirmPublish = await Swal.fire({
            title: "✅ Confirmer la publication ?",
            text: "Souhaitez-vous publier cette actualité ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Non",
        });

        if (!confirmPublish.isConfirmed) return;

        const sendEmail = await Swal.fire({
            title: "📧 Notifier par email ?",
            text: "Voulez-vous envoyer une notification aux utilisateurs concernés ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Non",
        });

        try {
            const response = await publishNews(news, sendEmail.isConfirmed);
            await Swal.fire("✅ Publiée", response.message, "success");
            fetchNews();
        } catch (err: any) {
            Swal.fire("❌ Erreur", err.response?.data?.msg || "Erreur lors de la publication", "error");
        }
    };

    const handleEdit = (news: News) => {
        setFormData({
            title: news.title,
            description: news.description,
            type: news.type,
            published: news.published,
            target: news.target,
        });
        setEditingId(news.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            type: "info",
            published: false,
            target: "Tous",
        });
        setSelectedFile(null);
        setPreviewUrl(null);
        setEditingId(null);
    };

    const handleRemoveImage = () => {
        setPreviewUrl(null);
    };
    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                    {editingId ? "Modifier l'actu" : "Créer une actu"}
                </CardTitle>
            </CardHeader>
            <CardContent>

                {/* Formulaire de création ou d'édition */}
                <div className="space-y-4 mb-8">
                    <Input
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Titre de l'actu"
                    />
                    <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Contenu de l'actu"
                    />

                    {/* Image upload amélioré */}
                    <div className="flex flex-col items-start gap-2">
                        <Button
                            type="button"
                            onClick={() => document.getElementById("fileInput")?.click()}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold"
                        >
                            Choisir une image
                        </Button>

                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />

                        {selectedFile && (
                            <p className="text-sm text-gray-600">{selectedFile.name}</p>
                        )}

                        {previewUrl && (
                            <div className="flex flex-col items-center mt-2">
                                <div className="w-48 h-48 rounded-xl overflow-hidden shadow-lg border border-gray-300">
                                    <img
                                        src={previewUrl}
                                        alt="Aperçu"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={handleRemoveImage}
                                    className="mt-2"
                                >
                                    Retirer l'image
                                </Button>
                            </div>
                        )}
                    </div>

                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="border rounded p-2 w-full"
                    >
                        <option value="info">Info</option>
                        <option value="warning">Avertissement</option>
                        <option value="event">Événement</option>
                    </select>

                    <select
                        name="target"
                        value={formData.target}
                        onChange={handleInputChange}
                        className="border rounded p-2 w-full"
                    >
                        <option value="Tous">Tous</option>
                        <option value="Nouveau">Nouveau</option>
                        <option value="Student">Étudiant</option>
                        <option value="Admin">Admin</option>
                    </select>

                    <div className="flex gap-2">
                        <Button onClick={handleCreateOrUpdate}>
                            {editingId ? "Valider la modification" : "Créer l'actu"}
                        </Button>
                        {editingId && (
                            <Button variant="outline" onClick={resetForm}>
                                Annuler
                            </Button>
                        )}
                    </div>
                </div>

                {/* Liste des actus */}
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    Toutes les actus
                </h3>
                {loading ? (
                    <p>Chargement...</p>
                ) : newsList.length === 0 ? (
                    <p>Aucune actu.</p>
                ) : (
                    <ul className="space-y-4">
                        {newsList.map((news) => (
                            <li key={news.id} className="p-4 bg-gray-50 border rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">{news.title}</p>
                                        <p className="text-sm text-gray-600 whitespace-pre-line">
                                            {news.description}
                                        </p>
                                        {news.image_url && (
                                            <img
                                                src={news.image_url}
                                                alt={news.title}
                                                className="w-32 h-auto rounded mb-2"
                                            />
                                        )}
                                        <p className="text-xs text-gray-400">
                                            Type : {news.type} | Cible : {news.target} | Publiée :{" "}
                                            {news.published ? "✅" : "❌"}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        {!news.published && (
                                            <Button variant="default" onClick={() => handlePublish(news)}>
                                                📢 Publier
                                            </Button>
                                        )}
                                        <Button variant="secondary" onClick={() => handleEdit(news)}>
                                            ✏️ Modifier
                                        </Button>
                                        <Button variant="destructive" onClick={() => handleDeleteNews(news.id)}>
                                            🗑️ Supprimer
                                        </Button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
};
