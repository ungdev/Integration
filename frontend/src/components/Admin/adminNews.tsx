import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import { MIMEType } from '../../interfaces/import.interface';
import { type News } from '../../interfaces/news.interface';
import { createNews, deleteNews, getAllNews, publishNews, updateNews } from '../../services/requests/news.service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { AdminFileImport } from './adminFileImport';

export const AdminNews = () => {
    const [newsList, setNewsList] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingImageUrl, setEditingImageUrl] = useState<string | null>(null);
    const [submitDraftImage, setSubmitDraftImage] = useState<
        ((itemOverride?: string) => Promise<string | null>) | null
    >(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'info',
        published: false,
        target: 'Tous',
    });

    const fetchNews = async () => {
        try {
            const response = await getAllNews();
            setNewsList(response);
        } catch {
            Swal.fire('❌ Erreur', 'Erreur lors du chargement des actus', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const getErrorMessage = (err: unknown, fallback: string) => {
        if (typeof err === 'object' && err !== null && 'response' in err) {
            const response = (err as { response?: { data?: { msg?: string } } }).response;
            if (response?.data?.msg) {
                return response.data.msg;
            }
        }

        return fallback;
    };

    const resolveNewsImageUrl = (imageUrl: string) => {
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            return imageUrl;
        }

        const baseUrl = import.meta.env.VITE_API_URL as string;
        if (imageUrl.startsWith('/api/') && baseUrl.endsWith('/api')) {
            return `${baseUrl}${imageUrl.slice(4)}`;
        }

        return `${baseUrl}${imageUrl}`;
    };

    const handleCreateOrUpdate = async () => {
        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                type: formData.type,
                published: formData.published,
                target: formData.target,
            };

            let response;
            if (editingId) {
                const uploadedImageUrl = submitDraftImage ? await submitDraftImage(String(editingId)) : null;

                const image_url = uploadedImageUrl ? uploadedImageUrl : editingImageUrl === null ? null : undefined;

                response = await updateNews({
                    ...payload,
                    id: String(editingId),
                    image_url,
                });
            } else {
                response = await createNews(payload);

                const createdId = response?.data?.id;
                if (createdId && submitDraftImage) {
                    const image_url = await submitDraftImage(String(createdId));
                    if (image_url) {
                        await updateNews({
                            ...payload,
                            id: String(createdId),
                            image_url,
                        });
                    }
                }
            }

            await Swal.fire('✅ Succès', response.message, 'success');
            resetForm();
            fetchNews();
        } catch (err: unknown) {
            Swal.fire('❌ Erreur', getErrorMessage(err, 'Erreur lors de la sauvegarde'), 'error');
        }
    };

    const handleDeleteNews = async (newsId: number) => {
        const confirmDelete = await Swal.fire({
            title: '⚠️ Supprimer cette actu ?',
            text: 'Es-tu sûr de vouloir la supprimer ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non',
        });

        if (!confirmDelete.isConfirmed) return;

        try {
            const response = await deleteNews(newsId);
            await Swal.fire('✅ Supprimée', response.message, 'success');
            resetForm();
            fetchNews();
        } catch {
            Swal.fire('❌ Erreur', "Erreur lors de la suppression de l'actu", 'error');
        }
    };

    const handlePublish = async (news: News) => {
        const confirmPublish = await Swal.fire({
            title: '✅ Confirmer la publication ?',
            text: 'Souhaitez-vous publier cette actualité ?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non',
        });

        if (!confirmPublish.isConfirmed) return;

        const sendEmail = await Swal.fire({
            title: '📧 Notifier par email ?',
            text: 'Voulez-vous envoyer une notification aux utilisateurs concernés ?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non',
        });

        try {
            const response = await publishNews(news, sendEmail.isConfirmed);
            await Swal.fire('✅ Publiée', response.message, 'success');
            fetchNews();
        } catch (err: unknown) {
            Swal.fire('❌ Erreur', getErrorMessage(err, 'Erreur lors de la publication'), 'error');
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
        setEditingImageUrl(news.image_url ?? null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            type: 'info',
            published: false,
            target: 'Tous',
        });
        setEditingId(null);
        setEditingImageUrl(null);
    };

    return (
        <Card className="w-full max-w-7xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                    {editingId ? "Modifier l'actu" : 'Créer une actu'}
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

                    <AdminFileImport
                        category="news"
                        item={editingId ? String(editingId) : 'image'}
                        title="Image de l'actu"
                        acceptedTypes={[MIMEType.JPEG, MIMEType.PNG]}
                        draft
                        draftInitialUrl={editingImageUrl}
                        onDraftDelete={() => {
                            setEditingImageUrl(null);
                            setSubmitDraftImage(null);
                        }}
                        onDraftSubmitReady={(submit) => setSubmitDraftImage(() => submit)}
                    />

                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="border rounded p-2 w-full">
                        <option value="info">Info</option>
                        <option value="warning">Avertissement</option>
                        <option value="event">Événement</option>
                    </select>

                    <select
                        name="target"
                        value={formData.target}
                        onChange={handleInputChange}
                        className="border rounded p-2 w-full">
                        <option value="Tous">Tous</option>
                        <option value="Nouveau">Nouveau</option>
                        <option value="Student">Étudiant</option>
                        <option value="Admin">Admin</option>
                    </select>

                    <div className="flex gap-2">
                        <Button onClick={handleCreateOrUpdate}>
                            {editingId ? 'Valider la modification' : "Créer l'actu"}
                        </Button>
                        {editingId && (
                            <Button variant="outline" onClick={resetForm}>
                                Annuler
                            </Button>
                        )}
                    </div>
                </div>

                {/* Liste des actus */}
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Toutes les actus</h3>
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
                                        <p className="text-sm text-gray-600 whitespace-pre-line">{news.description}</p>
                                        {news.image_url && (
                                            <img
                                                src={resolveNewsImageUrl(news.image_url)}
                                                alt={news.title}
                                                className="w-32 h-auto rounded mb-2"
                                            />
                                        )}
                                        <p className="text-xs text-gray-400">
                                            Type : {news.type} | Cible : {news.target} | Publiée :{' '}
                                            {news.published ? '✅' : '❌'}
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
