import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  createNews,
  deleteNews,
  getAllNews,
  publishNews,
  updateNews,
} from "../../services/requests/news.service";
import { News } from "../../interfaces/news.interface";

export const AdminNews = () => {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);

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
    } catch (err) {
      alert("Erreur lors du chargement des actus");
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

  const handleCreateOrUpdate = async () => {
    try {
      if (editingId) {
        const response = await updateNews({ id: editingId, ...formData });
        alert(response.message);
      } else {
        const response = await createNews(formData);
        alert(response.message);
      }

      resetForm();
      fetchNews();
    } catch (err: any) {
      alert(err.response?.data?.msg || "Erreur lors de la sauvegarde");
    }
  };

  const handleDeleteNews = async (newsId: number) => {
    try {
      const response = await deleteNews(newsId);
      alert(response.message);
      fetchNews();
    } catch (err) {
      console.error("Erreur lors de la suppression de l'actu", err);
    }
  };

  const handlePublish = async (news: News) => {
    try {
      const response = await publishNews(news);
      alert(response.message);
      fetchNews();
    } catch (err: any) {
      alert(err.response?.data?.msg || "Erreur lors de la publication");
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
    setEditingId(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {editingId ? "Modifier l'actu" : "Créer une actu"}
      </h2>

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
          <option value="Student">Student</option>
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
                  <p className="text-sm text-gray-600">{news.description}</p>
                  <p className="text-xs text-gray-400">
                    Type : {news.type} | Cible : {news.target} | Publiée :{" "}
                    {news.published ? "✅" : "❌"}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!news.published && (
                    <Button variant="default" onClick={() => handlePublish(news)}>
                      Publier
                    </Button>
                  )}
                  <Button variant="secondary" onClick={() => handleEdit(news)}>
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteNews(news.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
