import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, AlertTriangle, Package } from "lucide-react";
import { supabase } from "../../../supabaseClient";
import { Table } from "../Table";
import { Modal } from "../Modal";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  images: string[];
  stock: number;
  featured: boolean;
  discount: number;
  specifications: { name: string; description: string }[];
  created_at: string;
  categories?: { name: string };
}

export const ProduitsTab: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // Modales
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // États de gestion
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);

  // Formulaire principal
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    featured: false,
    discount: 0,
  });

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("fr-BJ", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const [specifications, setSpecifications] = useState<
    { name: string; description: string }[]
  >([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .order("created_at", { ascending: false });

    if (data && !error) setProducts(data);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name");
    if (data && !error) setCategories(data);
  };

  // --- Formatages & Helpers ---

  const formatRef = (id: string) => {
    return `PROD${id.split("-")[0].substring(0, 5).toUpperCase()}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-BJ", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const addSpec = () => {
    setSpecifications([...specifications, { name: "", description: "" }]);
  };

  const removeSpec = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleSpecChange = (
    index: number,
    field: "name" | "description",
    value: string,
  ) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  // --- Traitement Upload Stockage ---

  const handleUploadImages = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of imageFiles) {
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `products/${Date.now()}-${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("products")
          .getPublicUrl(filePath);
        if (data?.publicUrl) urls.push(data.publicUrl);
      } catch (err) {
        console.error("Erreur lors de l'upload d'un fichier:", err);
      }
    }
    return urls;
  };

  // --- Gestion du Formulaire (Ajout / Modification) ---

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentProductId(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category_id: "",
      featured: false,
      discount: 0,
    });
    setSpecifications([{ name: "", description: "" }]);
    setImageFiles([]);
    setExistingImages([]);
    setIsFormModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setIsEditing(true);
    setCurrentProductId(product.id);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
      category_id: product.category_id || "",
      featured: product.featured || false,
      discount: product.discount || 0,
    });
    setSpecifications(
      Array.isArray(product.specifications) && product.specifications.length > 0
        ? product.specifications
        : [{ name: "", description: "" }],
    );
    setImageFiles([]);
    setExistingImages(product.images || []);
    setIsFormModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedUrls = await handleUploadImages();
      const finalImages = [...existingImages, ...uploadedUrls];

      const cleanSpecs = specifications.filter(
        (s) => s.name.trim() !== "" || s.description.trim() !== "",
      );

      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        category_id: formData.category_id || null,
        featured: formData.featured,
        discount: formData.discount,
        specifications: cleanSpecs,
        images: finalImages,
      };

      if (isEditing && currentProductId) {
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", currentProductId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert([payload]);
        if (error) throw error;
      }

      setIsFormModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Erreur d'enregistrement:", error);
      alert("Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  // --- Gestion de la Suppression ---

  const openDeleteModal = (id: string) => {
    setCurrentProductId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!currentProductId) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", currentProductId);
      if (error) throw error;

      setIsDeleteModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Erreur de suppression:", error);
      alert(
        "Impossible de supprimer ce produit. Vérifiez s'il est associé à des commandes.",
      );
    } finally {
      setLoading(false);
      setCurrentProductId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gris-canon-de-fusil">
          Gestion des produits
        </h2>
        <button
          onClick={openAddModal}
          className="flex items-center px-4 py-2.5 bg-bleu-saphir text-blanc rounded-xl hover:bg-bleu-saphir/90 transition-all font-semibold text-sm cursor-pointer shadow-xs"
        >
          <Plus className="h-4 w-4 mr-2" /> Ajouter un produit
        </button>
      </div>

      <Table
        headers={[
          "Ref",
          "Image",
          "Produit",
          "Catégorie",
          "En vedette",
          "Promotion",
          "Prix",
          "Stock",
          "Date création",
          "Actions",
        ]}
      >
        {products.map((p) => (
          <tr
            key={p.id}
            className="hover:bg-gris-canon-de-fusil/2 transition-colors"
          >
            {/* Référence */}
            <td className="px-6 py-4 text-xs font-black text-bleu-saphir/70">
              {formatRef(p.id)}
            </td>
            {/* Image */}
            <td className="px-6 py-4">
              {p.images && p.images.length > 0 ? (
                <img
                  src={p.images[0]}
                  alt={p.name}
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
                style={{
                  display: p.images && p.images.length > 0 ? "none" : "flex",
                }}
              >
                <Package className="h-5 w-5" />
              </div>
            </td>
            {/* Produit */}
            <td className="px-6 py-4 text-sm font-bold text-gris-canon-de-fusil">
              {p.name}
            </td>
            {/* Catégorie */}
            <td className="px-6 py-4 text-sm font-medium text-gris-canon-de-fusil/60">
              {p.categories?.name || "Sans catégorie"}
            </td>
            {/* En vedette (booléen) */}
            <td className="px-6 py-4 text-sm font-medium text-gris-canon-de-fusil/60">
              {p.featured ? "Oui" : "Non"}
            </td>
            {/* Promotion / Réduction */}
            <td className="px-6 py-4 text-sm font-medium text-gris-canon-de-fusil/60">
              {p.discount ? `-${p.discount}%` : "Aucune"}
            </td>
            {/* Prix */}
            <td className="px-6 py-4 text-sm font-bold text-gris-canon-de-fusil">
              {formatCurrency(p.price)}
            </td>
            {/* Stock */}
            <td className="px-6 py-4 text-sm text-gris-canon-de-fusil/80">
              {p.stock > 0 ? p.stock : "Rupture"}
            </td>
            {/* Date de creation */}
            <td className="px-6 py-4 text-sm text-gris-canon-de-fusil/80">
              {formatDate(p.created_at)}
            </td>
            {/* Actions */}
            <td className="px-6 py-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(p)}
                  className="text-bleu-saphir p-1.5 hover:bg-bleu-saphir/5 rounded-lg cursor-pointer transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => openDeleteModal(p.id)}
                  className="text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
        {products.length === 0 && (
          <tr>
            <td
              colSpan={10}
              className="px-6 py-8 text-center text-sm text-gris-canon-de-fusil/60"
            >
              Aucun produit trouvé.
            </td>
          </tr>
        )}
      </Table>

      {/* Modale d'ajout / modification */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => !loading && setIsFormModalOpen(false)}
        title={isEditing ? "Modifier le produit" : "Ajouter un produit"}
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[80vh] overflow-y-auto px-1"
        >
          <div>
            <label className="block text-xs font-bold text-gris-canon-de-fusil/60 uppercase mb-1">
              Nom du produit
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:border-bleu-saphir text-sm font-semibold"
              placeholder="Ex: PC Portable Asus"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gris-canon-de-fusil/60 uppercase mb-1">
              Catégorie
            </label>
            <select
              value={formData.category_id}
              onChange={(e) =>
                setFormData({ ...formData, category_id: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:border-bleu-saphir text-sm font-semibold bg-white"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gris-canon-de-fusil/60 uppercase mb-1">
                Prix (XOF)
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:border-bleu-saphir text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gris-canon-de-fusil/60 uppercase mb-1">
                Stock
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:border-bleu-saphir text-sm font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gris-canon-de-fusil/60 uppercase mb-1">
                Remise (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.discount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discount: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="w-full px-4 py-2.5 border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:border-bleu-saphir text-sm font-semibold"
              />
            </div>
            <div className="flex items-center h-full pt-6">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="w-4 h-4 text-bleu-saphir border-gris-canon-de-fusil/20 rounded-sm focus:ring-bleu-saphir"
                />
                <span className="text-sm font-bold text-gris-canon-de-fusil/80">
                  Produit Vedette
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gris-canon-de-fusil/60 uppercase mb-1">
              Description
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:border-bleu-saphir text-sm font-semibold resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gris-canon-de-fusil/60 uppercase mb-1">
              Images du produit
            </label>
            {existingImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {existingImages.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={img}
                      alt="Existing"
                      className="h-14 w-14 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setExistingImages(
                          existingImages.filter((_, idx) => idx !== i),
                        )
                      }
                      className="absolute -top-1 -right-1 bg-rose-600 text-white rounded-full p-0.5 hover:bg-rose-700 shadow-xs"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                e.target.files && setImageFiles(Array.from(e.target.files))
              }
              className="w-full text-xs font-semibold text-gris-canon-de-fusil/60 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-bleu-saphir file:text-blanc hover:file:bg-bleu-saphir/90"
            />
          </div>

          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-gris-canon-de-fusil/60 uppercase">
                Spécifications
              </label>
              <button
                type="button"
                onClick={addSpec}
                className="text-xs text-bleu-saphir font-bold hover:underline"
              >
                + Ajouter une ligne
              </button>
            </div>
            {specifications.map((spec, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  placeholder="Ex: Marque"
                  value={spec.name}
                  onChange={(e) => handleSpecChange(i, "name", e.target.value)}
                  className="w-1/2 px-3 py-2 border border-gris-canon-de-fusil/10 rounded-xl text-sm font-semibold focus:outline-none focus:border-bleu-saphir"
                />
                <input
                  placeholder="Ex: Apple"
                  value={spec.description}
                  onChange={(e) =>
                    handleSpecChange(i, "description", e.target.value)
                  }
                  className="w-1/2 px-3 py-2 border border-gris-canon-de-fusil/10 rounded-xl text-sm font-semibold focus:outline-none focus:border-bleu-saphir"
                />
                {specifications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSpec(i)}
                    className="text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
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

      {/* Modale de suppression */}
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
              ce produit ?
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
