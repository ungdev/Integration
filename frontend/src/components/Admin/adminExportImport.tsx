import { ChangeEvent, useState } from "react";
import { Button } from "../ui/button";
import { exportBus, exportDb, importFoodMenu, importPlannings } from "../../services/requests/im_export.service";
import { FileText } from "lucide-react";

export const AdminExportConnect = () => {
  const [loading, setLoading] = useState<{ db: boolean; bus: boolean }>({
    db: false,
    bus: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [showBusExport, setShowBusExport] = useState(false);

  const busUrl = "https://integration.utt.fr/api/exports/bus/bus.csv";

  const handleExport = async (
    type: "db" | "bus",
    exportFn: () => Promise<{ message: string }>
  ) => {
    setLoading((prev) => ({ ...prev, [type]: true }));
    setError(null);
    setMessage("");
    try {
      const response = await exportFn();
      setMessage(response.message);
      if (type === "bus") setShowBusExport(true);
    } catch (err) {
      console.error(`Erreur export ${type}`, err);
      setError(
        type === "db"
          ? "Erreur lors de l'export vers Google Sheets."
          : "Erreur lors de l'export des bus."
      );
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg space-y-6">
      <h2 className="text-3xl font-extrabold text-center text-gray-900">
        ⚡ Exporter les données
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          onClick={() => handleExport("db", exportDb)}
          disabled={loading.db}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-6 rounded-xl shadow-md transition-all duration-200"
        >
          {loading.db ? "⏳ Export en cours..." : "Exporter vers Google Sheets"}
        </Button>

        <Button
          onClick={() => handleExport("bus", exportBus)}
          disabled={loading.bus}
          className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 px-6 rounded-xl shadow-md transition-all duration-200"
        >
          {loading.bus ? "⏳ Export en cours..." : "Exporter les bus"}
        </Button>
      </div>

      {error && (
        <p className="text-center text-sm text-red-500 font-medium animate-fade-in">
          {error}
        </p>
      )}
      {message && !error && (
        <p className="text-center text-sm text-green-600 font-medium animate-fade-in">
          ✅ {message}
        </p>
      )}

      {showBusExport && (
        <div className="bg-gray-50 shadow-inner rounded-2xl p-6 space-y-4 border animate-fade-in text-center">
          <h3 className="text-xl font-semibold text-gray-800">
            📄 Télécharger le csv des bus
          </h3>
          <a
            href={busUrl}
            download
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
          >
            ⬇️ Télécharger le csv
          </a>
        </div>
      )}
    </div>
  );
};



export const AdminImportFoodMenu = () => {
  const [menu, setMenu] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setMessage("");
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      if (selected.type !== "application/pdf") {
        setError("Seuls les fichiers PDF sont autorisés");
        setMenu(null);
      } else {
        setMenu(selected);
      }
    }
  };

  const handleImport = async () => {
    if (!menu) {
      setError("Veuillez sélectionner un fichier PDF avant d’importer.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("foodFile", menu);

      const response = await importFoodMenu(formData);
      setMessage(response.message || "Importation réussie !");
    } catch (err) {
      console.error("Erreur lors de l’importation du menu", err);
      setError("Une erreur est survenue pendant l’importation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
        Importer le menu au format PDF
      </h2>

      {/* Rappel des règles de nommage */}
      <p className="text-center text-sm text-red-600 font-medium mb-4">
        ⚠️ Le fichier doit être nommé FoodMenu.pdf <br />
      </p>

      <div className="flex flex-col items-center mb-4 space-y-4">
        {/* Input fichier masqué */}
        <input
          id="menuFileInput"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <label
          htmlFor="menuFileInput"
          className="cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-6 rounded-xl shadow-md transition-all duration-200"
        >
          Choisir un fichier
        </label>

        {/* Affiche le nom du fichier sélectionné */}
        {menu && (
          <div className="flex items-center space-x-2 text-gray-700">
            <FileText className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium">{menu.name}</span>
          </div>
        )}

        {/* Bouton importer */}
        <Button
          onClick={handleImport}
          disabled={loading}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 px-6 rounded-xl shadow-md transition-all duration-200"
        >
          {loading ? "Import en cours..." : "Importer le PDF"}
        </Button>
      </div>

      {error && (
        <p className="text-center text-sm text-red-500 font-medium">{error}</p>
      )}
      {message && (
        <p className="text-center text-sm text-green-600 font-medium">
          {message}
        </p>
      )}
    </div>
  );
};


export const AdminImportPlannings = () => {
  const [planning, setPlanning] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [selectedPlanning, setSelectedPlanning] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setMessage("");
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      if (selected.type !== "application/pdf") {
        setError("Seuls les fichiers PDF sont autorisés");
        setPlanning(null);
      } else {
        setPlanning(selected);
      }
    }
  };

  const handleImport = async (planningName: string) => {
    if (!planning) {
      setError("Veuillez sélectionner un fichier PDF avant d’importer.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage("");
    setSelectedPlanning(planningName);

    try {
      const formData = new FormData();
      formData.append("planningFile", planning);

      const response = await importPlannings(formData);
      setMessage(response.message || `Importation réussie pour ${planningName} !`);
    } catch (err) {
      console.error("Erreur lors de l’importation du planning", err);
      setError("Une erreur est survenue pendant l’importation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
        Importer les plannings au format PDF
      </h2>

      {/* Rappel des règles de nommage */}
      <p className="text-center text-sm text-red-600 font-medium mb-4">
        ⚠️ Le fichier doit être nommé en minuscules, sans accents, au format <br />
        <code className="font-mono">filiere.pdf</code> (ex: <code>tc.pdf</code>, <code>bachelor.pdf</code>)
      </p>

      <div className="flex flex-col items-center mb-4 space-y-4">
        {/* Input fichier masqué */}
        <input
        id="planningFileInput"
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      <label
        htmlFor="planningFileInput"
        className="cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-6 rounded-xl shadow-md transition-all duration-200"
      >
        Choisir un fichier
      </label>

        {/* Affiche le nom du fichier sélectionné */}
        {planning && (
          <div className="flex items-center space-x-2 text-gray-700">
            <FileText className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium">{planning.name}</span>
          </div>
        )}

        {/* Différents boutons d'import */}
        <div className="grid grid-cols-1 gap-3 w-full">
          <Button
            onClick={() => handleImport("Planning TC")}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-xl shadow-md"
          >
            {loading && selectedPlanning === "Planning TC"
              ? "Import en cours..."
              : "Planning TC"}
          </Button>

          <Button
            onClick={() => handleImport("Planning Bachelor IA")}
            disabled={loading}
            className="bg-violet-600 hover:bg-violet-700 text-white py-2 px-6 rounded-xl shadow-md"
          >
            {loading && selectedPlanning === "Planning Bachelor IA"
              ? "Import en cours..."
              : "Planning Bachelor IA"}
          </Button>

          <Button
            onClick={() => handleImport("Planning Branche (non-alternant)")}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-xl shadow-md"
          >
            {loading && selectedPlanning === "Planning Branche (non-alternant)"
              ? "Import en cours..."
              : "Planning Branche (non-alternant)"}
          </Button>

          <Button
            onClick={() => handleImport("Planning Branche FISEA (alternants)")}
            disabled={loading}
            className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-xl shadow-md"
          >
            {loading && selectedPlanning === "Planning Branche FISEA (alternants)"
              ? "Import en cours..."
              : "Planning Branche FISEA (alternants)"}
          </Button>

          <Button
            onClick={() => handleImport("Planning Master")}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-xl shadow-md"
          >
            {loading && selectedPlanning === "Planning Master"
              ? "Import en cours..."
              : "Planning Master"}
          </Button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <p className="text-center text-sm text-red-500 font-medium">{error}</p>
      )}
      {message && (
        <p className="text-center text-sm text-green-600 font-medium">
          {message}
        </p>
      )}
    </div>
  );
};
