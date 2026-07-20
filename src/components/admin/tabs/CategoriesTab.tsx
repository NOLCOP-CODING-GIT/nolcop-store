import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, AlertTriangle, Package } from "lucide-react";
import { supabase } from "../../../supabaseClient";
import { Table } from "../Table";
import { Modal } from "../Modal";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  created_at: string;
  products?: Product[];
}

export const CategoriesTab: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // Modales
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // États du formulaire
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(
    null,
  );
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*, products:products!category_id(id, name, price)")
      .order("created_at", { ascending: false });

    if (data && !error) {
      setCategories(data as Category[]);
    } else {
      console.error("Erreur lors de la récupération des catégories", error);
    }
  };

  // --- Helpers pour le formatage ---

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Enlève les accents
      .replace(/[\s\W-]+/g, "-"); // Remplace espaces et caractères spéciaux par des tirets
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData({
      ...formData,
      name: newName,
      slug: generateSlug(newName),
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // 1. Création d'un nom de fichier unique
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `categories/${fileName}`;

      // 2. Upload dans le bucket 'categories'
      const { error: uploadError } = await supabase.storage
        .from("categories")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 3. Récupération de l'URL publique
      const {
        data: { publicUrl },
      } = supabase.storage.from("categories").getPublicUrl(filePath);

      setFormData({ ...formData, image: publicUrl });
    } catch (error) {
      console.error("Erreur upload:", error);
      alert("Erreur lors de l'upload de l'image.");
    } finally {
      setLoading(false);
    }
  };

  const formatRef = (id: string) => {
    // Génère une référence type CAT + 5 premiers caractères de l'UUID
    return `CAT${id.split("-")[0].substring(0, 5).toUpperCase()}`;
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("fr-BJ", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
  };

  // --- Gestion du Formulaire (Ajout / Modification) ---

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentCategoryId(null);
    setFormData({ name: "", slug: "", image: "", description: "" });
    setIsFormModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setIsEditing(true);
    setCurrentCategoryId(category.id);
    setFormData({
      name: category.name,
      slug: category.slug,
      image: category.image,
      description: category.description || "",
    });
    setIsFormModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing && currentCategoryId) {
        const { error } = await supabase
          .from("categories")
          .update(formData)
          .eq("id", currentCategoryId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert([formData]);
        if (error) throw error;
      }

      setIsFormModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la catégorie", error);
      alert("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  // --- Gestion de la Suppression ---

  const openDeleteModal = (id: string) => {
    setCurrentCategoryId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!currentCategoryId) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", currentCategoryId);

      if (error) throw error;

      setIsDeleteModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie", error);
      alert(
        "Impossible de supprimer cette catégorie. Elle est peut-être liée à des produits.",
      );
    } finally {
      setLoading(false);
      setCurrentCategoryId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gris-canon-de-fusil">
          Gestion des Catégories
        </h2>
        <button
          onClick={openAddModal}
          className="flex items-center px-4 py-2.5 bg-bleu-saphir text-blanc rounded-xl hover:bg-bleu-saphir/90 transition-all font-semibold text-sm cursor-pointer shadow-xs"
        >
          <Plus className="h-4 w-4 mr-2" /> Ajouter une catégorie
        </button>
      </div>

      <Table
        headers={[
          "Ref",
          "Image",
          "Nom",
          "Slug",
          "Produits",
          "Date création",
          "Actions",
        ]}
      >
        {categories.map((category) => (
          <tr
            key={category.id}
            className="hover:bg-gris-canon-de-fusil/2 transition-colors"
          >
            <td className="px-6 py-4 text-xs font-black text-bleu-saphir/70">
              {formatRef(category.id)}
            </td>
            <td className="px-6 py-4">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-10 h-10 object-cover rounded-lg bg-gray-100"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fallback = e.currentTarget
                      .nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
              ) : null}

              <div
                className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg text-gray-400"
                style={{ display: category.image ? "none" : "flex" }}
              >
                <Package className="h-5 w-5" />
              </div>
            </td>
            <td className="px-6 py-4 text-sm font-bold text-gris-canon-de-fusil">
              {category.name}
            </td>
            <td className="px-6 py-4 text-sm font-medium text-gris-canon-de-fusil/60">
              {category.slug}
            </td>
            <td className="px-6 py-4 text-sm">
              {category.products && category.products.length > 0 ? (
                <div className="flex flex-wrap gap-1 max-w-xs">
                  {category.products.map((p) => (
                    <span
                      key={p.id}
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-bleu-saphir/10 text-bleu-saphir"
                    >
                      {p.name}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-gray-400 italic">
                  Aucun produit
                </span>
              )}
            </td>
            <td className="px-6 py-4 text-sm text-gris-canon-de-fusil/80">
              {formatDate(category.created_at)}
            </td>
            <td className="px-6 py-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(category)}
                  className="text-bleu-saphir p-1.5 hover:bg-bleu-saphir/5 rounded-lg cursor-pointer transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => openDeleteModal(category.id)}
                  className="text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
        {categories.length === 0 && (
          <tr>
            <td
              colSpan={7}
              className="px-6 py-8 text-center text-sm text-gris-canon-de-fusil/60"
            >
              Aucune catégorie trouvée.
            </td>
          </tr>
        )}
      </Table>

      {/* Modale d'ajout / modification */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => !loading && setIsFormModalOpen(false)}
        title={isEditing ? "Modifier la catégorie" : "Ajouter une catégorie"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gris-canon-de-fusil/60 uppercase mb-1">
              Nom de la catégorie
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={handleNameChange}
              className="w-full px-4 py-2.5 border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:border-bleu-saphir text-sm font-semibold"
              placeholder="Ex: Informatique"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gris-canon-de-fusil/60 uppercase mb-1">
              Slug (Généré automatiquement)
            </label>
            <input
              type="text"
              required
              readOnly
              value={formData.slug}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none text-sm font-medium text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gris-canon-de-fusil/60 uppercase mb-1">
              Image de la catégorie
            </label>

            {/* Prévisualisation */}
            {formData.image && (
              <div className="mb-2">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Input fichier */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-xs font-semibold text-gris-canon-de-fusil/60 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-bleu-saphir file:text-blanc hover:file:bg-bleu-saphir/90"
            />

            {/* Champ caché pour stocker l'URL dans la DB */}
            <input type="hidden" value={formData.image} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gris-canon-de-fusil/60 uppercase mb-1">
              Description (Optionnelle)
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:border-bleu-saphir text-sm font-semibold resize-none"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              disabled={loading}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-200 transition-all cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-bleu-saphir text-blanc text-sm font-bold rounded-xl hover:bg-bleu-saphir/90 transition-all flex items-center justify-center disabled:opacity-50 cursor-pointer"
            >
              {loading
                ? "Enregistrement..."
                : isEditing
                  ? "Mettre à jour"
                  : "Créer"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modale de confirmation de suppression */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !loading && setIsDeleteModalOpen(false)}
        title="Confirmer la suppression"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gris-canon-de-fusil mb-2">
              Êtes-vous sûr ?
            </h3>
            <p className="text-sm text-gris-canon-de-fusil/60">
              Cette action est irréversible. Êtes-vous sûr de vouloir supprimer
              cette catégorie ?
            </p>
          </div>

          <div className="flex justify-end gap-3 w-full">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={loading}
              className="flex-1 py-3 bg-gray-100 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-200 transition-all cursor-pointer"
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 py-3 bg-rose-600 text-white text-sm font-bold rounded-xl hover:bg-rose-700 transition-all cursor-pointer flex justify-center items-center"
            >
              {loading ? "Suppression..." : "Oui, supprimer"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
