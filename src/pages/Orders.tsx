import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Lock,
  X,
  MapPin,
  Calendar,
  Trash2,
  Edit,
  Plus,
  Minus,
  FileText,
  Printer,
  Bell,
  Archive,
  ArchiveRestore,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNotification } from "../hooks/useNotification";
import type { Order } from "../types";
import { supabase } from "../supabaseClient";

const Orders: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrderForTracking, setSelectedOrderForTracking] =
    useState<Order | null>(null);

  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [clientNotif, setClientNotif] = useState<string | null>(null);

  // Archivage côté client : totalement indépendant de l'archivage admin.
  // Ce filtre porte sur "archived_by_client", jamais sur "is_archived"
  // (qui reste réservé à l'admin), donc chaque interface garde sa propre vue.
  const [showArchived, setShowArchived] = useState(false);
  const [archivingId, setArchivingId] = useState<string | null>(null);

  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editForm, setEditForm] = useState({
    shippingName: "",
    shippingAddress: "",
    shippingPhone: "",
    items: [] as Array<{
      id?: string;
      productId: string;
      productName: string;
      price: number;
      quantity: number;
      selectedImage?: string;
    }>,
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-BJ", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Fenêtre de modification / annulation de 10 minutes max
  const isModifiable = (createdAtStr: string, currentStatus: string) => {
    if (
      currentStatus === "cancelled" ||
      currentStatus === "delivered" ||
      currentStatus === "shipped"
    ) {
      return false;
    }
    const createdTime = new Date(createdAtStr).getTime();
    const now = new Date().getTime();
    const diffMinutes = (now - createdTime) / (1000 * 60);
    return diffMinutes < 10;
  };

  const getComputedStatus = (order: any) => {
    if (order.status === "cancelled" || order.status === "delivered") {
      return order.status;
    }
    const now = new Date().getTime();
    const created = new Date(order.createdAt || order.created_at).getTime();
    const diffMinutes = (now - created) / (1000 * 60);

    if (diffMinutes < 10) return "pending";
    if (diffMinutes < 30) return "processing";
    return "shipped";
  };

  const fetchOrders = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items (
            id,
            quantity,
            price_at_time,
            selected_image,
            product_id,
            created_at,
            product:products (
              id,
              name,
              description,
              category:categories(name),
              images,
              price,
              stock,
              rating,
              reviews,
              created_at,
              updated_at
            )
          )
        `,
        )
        .eq("user_id", user.id)
        .eq("archived_by_client", showArchived)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedOrders: Order[] = data.map((order: any) => ({
          id: order.id,
          userId: order.user_id,
          status: order.status,
          total: Number(order.total),
          paymentMethod: order.payment_method,
          shippingName: order.shipping_name || "",
          shippingPhone: order.shipping_phone || "",
          shippingAddress: {
            id: order.id,
            street: order.shipping_address || "",
            city: order.shipping_city || "",
            country: order.shipping_country || "",
            isDefault: false,
          },
          createdAt: order.created_at,
          updatedAt: order.updated_at,
          items: (order.order_items || []).map((item: any) => {
            const productData = item.product || {};
            const images = Array.isArray(productData.images)
              ? productData.images
              : [];
            const fallbackImage = images[0] || "";

            return {
              product: {
                id: productData.id || item.product_id,
                name: productData.name || "Produit sans nom",
                description: productData.description || "",
                category: productData.category?.name || "Général",
                images: images,
                price: Number(item.price_at_time || productData.price || 0),
                stock: productData.stock || 0,
                rating: productData.rating || 0,
                reviews: productData.reviews || 0,
                createdAt: productData.created_at || item.created_at,
                updatedAt: productData.updated_at || item.created_at,
              },
              quantity: item.quantity || 1,
              selectedImage:
                item.selected_image || item.selectedImage || fallbackImage,
            };
          }),
        }));

        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    if (!user?.id) return;

    // Supabase Realtime - notifications de changement de statut
    const channel = supabase
      .channel("client_orders_channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newStatus = payload.new.status;
          let message = `Commande COM-${payload.new.id.slice(0, 8).toUpperCase()} mise à jour : ${newStatus}`;
          if (newStatus === "processing") {
            message = "Votre commande est désormais en cours de préparation !";
          } else if (newStatus === "shipped") {
            message =
              "Votre commande a été expédiée ! Votre facture est disponible.";
          } else if (newStatus === "delivered") {
            message =
              "Votre commande a été livrée ! Merci pour votre confiance.";
          } else if (newStatus === "cancelled") {
            message = "Votre commande a été annulée.";
          }

          setClientNotif(message);
          fetchOrders();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Recharge la liste quand le client bascule entre "Mes commandes" et
  // "Archivées". Complètement indépendant de la vue admin.
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showArchived]);

  const handleCancelOrder = async () => {
    if (!deletingOrderId) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", deletingOrderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((o) =>
          o.id === deletingOrderId ? { ...o, status: "cancelled" } : o,
        ),
      );

      showNotification("Commande annulée avec succès.", "success");
      setDeletingOrderId(null);
    } catch (err) {
      console.error("Erreur lors de l'annulation :", err);
      showNotification("Erreur lors de l'annulation de la commande.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleArchiveOrder = async (orderId: string) => {
    setArchivingId(orderId);
    try {
      // On ne touche qu'à "archived_by_client" : la commande reste visible
      // et inchangée côté admin (qui filtre uniquement sur "is_archived").
      const { error } = await supabase
        .from("orders")
        .update({ archived_by_client: true })
        .eq("id", orderId)
        .eq("user_id", user!.id);

      if (error) throw error;

      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      showNotification(
        "Commande archivée. Retrouvez-la dans l'onglet Archivées.",
        "success",
      );
    } catch (err) {
      console.error("Erreur lors de l'archivage :", err);
      showNotification("Erreur lors de l'archivage de la commande.", "error");
    } finally {
      setArchivingId(null);
    }
  };

  const handleRestoreOrder = async (orderId: string) => {
    setArchivingId(orderId);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ archived_by_client: false })
        .eq("id", orderId)
        .eq("user_id", user!.id);

      if (error) throw error;

      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      showNotification("Commande restaurée.", "success");
    } catch (err) {
      console.error("Erreur lors de la restauration :", err);
      showNotification(
        "Erreur lors de la restauration de la commande.",
        "error",
      );
    } finally {
      setArchivingId(null);
    }
  };

  const handleOpenEditModal = (order: Order) => {
    setEditingOrder(order);
    setEditForm({
      shippingName: (order as any).shippingName || "",
      shippingAddress: order.shippingAddress.street || "",
      shippingPhone: (order as any).shippingPhone || "",
      items: order.items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        selectedImage: item.selectedImage,
      })),
    });
  };

  const handleQuantityChange = (index: number, delta: number) => {
    setEditForm((prev) => {
      const updatedItems = prev.items.map((item, i) => {
        if (i === index) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty > 0 ? newQty : 1 };
        }
        return item;
      });
      return { ...prev, items: updatedItems };
    });
  };

  const handleRemoveItem = (index: number) => {
    setEditForm((prev) => {
      if (prev.items.length <= 1) {
        showNotification(
          "Une commande doit contenir au moins un produit.",
          "error",
        );
        return prev;
      }
      return { ...prev, items: prev.items.filter((_, i) => i !== index) };
    });
  };

  const calculatedNewTotal = editForm.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    setIsSavingEdit(true);
    try {
      const { error: orderError } = await supabase
        .from("orders")
        .update({
          shipping_name: editForm.shippingName,
          shipping_address: editForm.shippingAddress,
          shipping_phone: editForm.shippingPhone,
          total: calculatedNewTotal,
        })
        .eq("id", editingOrder.id);

      if (orderError) throw orderError;

      const { error: deleteItemsError } = await supabase
        .from("order_items")
        .delete()
        .eq("order_id", editingOrder.id);

      if (deleteItemsError) throw deleteItemsError;

      const newOrderItems = editForm.items.map((item) => ({
        order_id: editingOrder.id,
        product_id: item.productId,
        quantity: item.quantity,
        price_at_time: item.price,
        selected_image: item.selectedImage || "",
      }));

      const { error: insertItemsError } = await supabase
        .from("order_items")
        .insert(newOrderItems);

      if (insertItemsError) throw insertItemsError;

      fetchOrders();
      showNotification(
        "Commande et articles mis à jour avec succès",
        "success",
      );
      setEditingOrder(null);
    } catch (error: any) {
      console.error("Erreur mise à jour commande :", error);
      showNotification(
        "Erreur lors de la mise à jour de la commande.",
        "error",
      );
    } finally {
      setIsSavingEdit(false);
    }
  };

  const getStatusInfo = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return {
          label: "En attente",
          color: "text-amber-600 bg-amber-100",
          icon: Clock,
          step: 1,
        };
      case "processing":
        return {
          label: "En préparation",
          color: "text-blue-600 bg-blue-100",
          icon: Package,
          step: 2,
        };
      case "shipped":
        return {
          label: "Expédié",
          color: "text-indigo-600 bg-indigo-100",
          icon: Truck,
          step: 3,
        };
      case "delivered":
        return {
          label: "Livré",
          color: "text-green-600 bg-green-100",
          icon: CheckCircle,
          step: 4,
        };
      case "cancelled":
        return {
          label: "Annulé",
          color: "text-red-600 bg-red-100",
          icon: AlertCircle,
          step: 0,
        };
      default:
        return {
          label: status,
          color: "text-gray-600 bg-gray-100",
          icon: Package,
          step: 1,
        };
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blanc px-4">
        <div className="text-center max-w-md w-full bg-blanc border border-gris-canon-de-fusil/5 p-8 rounded-2xl shadow-xs">
          <div className="h-16 w-16 bg-bleu-saphir/5 text-bleu-saphir rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-black text-gris-canon-de-fusil mb-3 tracking-tight">
            Espace sécurisé
          </h2>
          <p className="text-sm text-gris-canon-de-fusil/60 leading-relaxed mb-8">
            Vous devez être connecté à votre compte pour accéder à l'historique
            et au suivi en temps réel de vos commandes.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center w-full px-6 py-3.5 bg-bleu-saphir hover:bg-bleu-saphir/90 text-blanc text-sm font-bold rounded-xl transition-all duration-200 shadow-xs cursor-pointer"
          >
            Se connecter à mon compte
          </Link>
          <p className="text-xs text-gris-canon-de-fusil/40 mt-4">
            Pas encore de compte ?{" "}
            <Link
              to="/register"
              className="text-bleu-saphir hover:underline font-semibold"
            >
              Créez-en un ici
            </Link>
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blanc gap-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-12 w-12 rounded-full border-4 border-gris-canon-de-fusil/5"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-bleu-saphir"></div>
        </div>
        <div className="text-center animate-pulse">
          <h5 className="text-sm font-bold text-gris-canon-de-fusil">
            Chargement de vos commandes...
          </h5>
          <p className="text-xs text-gris-canon-de-fusil/50 mt-1">
            Récupération de votre historique sécurisé
          </p>
        </div>
      </div>
    );
  }

  const trackingSteps = [
    { label: "Validée", desc: "Commande reçue" },
    { label: "Préparation", desc: "Emballage en cours" },
    { label: "Expédiée", desc: "En route vers chez vous" },
    { label: "Livrée", desc: "Remise en main propre" },
  ];

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-blanc">
      {/* Alerte Realtime pour le Client */}
      {clientNotif && (
        <div className="mb-6 p-4 bg-vert-jungle/10 border border-vert-jungle/20 rounded-2xl flex items-center justify-between text-vert-jungle">
          <div className="flex items-center space-x-3">
            <Bell className="h-5 w-5 animate-pulse" />
            <span className="text-xs font-bold">{clientNotif}</span>
          </div>
          <button
            onClick={() => setClientNotif(null)}
            className="p-1 hover:bg-vert-jungle/20 rounded-lg text-xs font-bold cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-5 gap-4">
        <div className="flex items-center">
          <div className="h-12 w-12 bg-bleu-saphir/5 text-bleu-saphir rounded-xl flex items-center justify-center mr-4 shrink-0">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gris-canon-de-fusil tracking-tight">
              {showArchived ? "Commandes Archivées" : "Mes Commandes"}
            </h1>
            <p className="text-xs text-gris-canon-de-fusil/50 mt-0.5">
              {showArchived
                ? "Commandes que vous avez masquées de votre liste principale"
                : "Suivi en temps réel de vos achats sécurisés"}
            </p>
          </div>
        </div>
        <div className="bg-gris-canon-de-fusil/5 px-4 py-2 rounded-xl text-sm font-bold text-gris-canon-de-fusil/70 self-start sm:self-center ">
          {orders.length} {orders.length === 1 ? "commande" : "commandes"}
        </div>
      </div>

      {/* Bascule Actives / Archivées (indépendante de l'archivage admin) */}
      <div className="flex bg-gris-canon-de-fusil/5 rounded-xl p-1 w-fit mb-6">
        <button
          onClick={() => setShowArchived(false)}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            !showArchived
              ? "bg-bleu-saphir text-blanc"
              : "text-gris-canon-de-fusil/60 hover:text-gris-canon-de-fusil"
          }`}
        >
          Mes commandes
        </button>
        <button
          onClick={() => setShowArchived(true)}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            showArchived
              ? "bg-bleu-saphir text-blanc"
              : "text-gris-canon-de-fusil/60 hover:text-gris-canon-de-fusil"
          }`}
        >
          Archivées
        </button>
      </div>

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-blanc rounded-2xl shadow-xs max-w-md mx-auto">
          <div className="h-16 w-16 bg-gris-canon-de-fusil/5 text-gris-canon-de-fusil/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8" />
          </div>
          {showArchived ? (
            <>
              <h2 className="text-lg font-bold text-gris-canon-de-fusil mb-1">
                Aucune commande archivée
              </h2>
              <p className="text-sm text-gris-canon-de-fusil/50 max-w-xs mx-auto mb-6 leading-relaxed">
                Les commandes que vous archivez apparaîtront ici. Elles restent
                consultables et vous pouvez les restaurer à tout moment.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold text-gris-canon-de-fusil mb-1">
                Vous n'avez pas encore de commandes
              </h2>
              <p className="text-sm text-gris-canon-de-fusil/50 max-w-xs mx-auto mb-6 leading-relaxed">
                Découvrez nos produits exclusifs et passez votre première
                commande dès aujourd'hui.
              </p>
            </>
          )}
          <Link
            to="/products"
            className="inline-flex items-center justify-center px-6 py-3 bg-bleu-saphir hover:bg-bleu-saphir/90 text-blanc text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer shadow-xs gap-2"
          >
            <span>Découvrir nos produits</span>
          </Link>
        </div>
      ) : (
        /* List */
        <div className="space-y-6">
          {orders.map((order) => {
            const computedStatus = getComputedStatus(order);
            const statusInfo = getStatusInfo(computedStatus);
            const StatusIcon = statusInfo.icon;
            const canEdit = isModifiable(order.createdAt, computedStatus);
            const isShippedOrDelivered =
              computedStatus === "shipped" || computedStatus === "delivered";
            const isFinished =
              computedStatus === "delivered" || computedStatus === "cancelled";

            return (
              <div
                key={order.id}
                className="bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div className="p-5 sm:p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gris-canon-de-fusil/5 gap-3">
                    <div>
                      <h3 className="text-base font-extrabold text-gris-canon-de-fusil">
                        Référence COM-{order.id.slice(0, 8).toUpperCase()}
                      </h3>
                      <p className="text-xs text-gris-canon-de-fusil/40 mt-0.5">
                        Commande effectuée le{" "}
                        {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-3 w-full sm:w-auto">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${statusInfo.color}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                        {statusInfo.label}
                      </span>
                      <div className="flex items-center space-x-1">
                        {canEdit && (
                          <button
                            onClick={() => handleOpenEditModal(order)}
                            className="p-2 text-bleu-saphir hover:bg-bleu-saphir/5 rounded-xl transition-colors cursor-pointer"
                            title="Modifier la commande (moins de 10 min)"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedOrderForTracking(order)}
                          className="p-2 text-bleu-saphir rounded-xl transition-colors cursor-pointer hover:bg-bleu-saphir/5"
                          title="Suivi de commande"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        {canEdit && (
                          <button
                            onClick={() => setDeletingOrderId(order.id)}
                            className="p-2 text-rouge-ecarlate rounded-xl transition-colors cursor-pointer hover:bg-rouge-ecarlate/5"
                            title="Annuler la commande"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                        {isShippedOrDelivered && (
                          <button
                            onClick={() => setInvoiceOrder(order)}
                            className="p-2 text-vert-jungle hover:bg-vert-jungle/10 rounded-xl transition-colors cursor-pointer"
                            title="Télécharger la facture"
                          >
                            <FileText className="h-5 w-5" />
                          </button>
                        )}

                        {/* ARCHIVAGE / RESTAURATION */}
                        {showArchived ? (
                          <button
                            onClick={() => handleRestoreOrder(order.id)}
                            disabled={archivingId === order.id}
                            className="p-2 text-vert-jungle rounded-xl transition-colors cursor-pointer hover:bg-vert-jungle/10"
                            title="Restaurer dans mes commandes"
                          >
                            <ArchiveRestore className="h-5 w-5" />
                          </button>
                        ) : (
                          /* Affiché uniquement si la commande est terminée (livrée ou annulée) */
                          isFinished && (
                            <button
                              onClick={() => handleArchiveOrder(order.id)}
                              disabled={archivingId === order.id}
                              className="p-2 text-orange-rougi hover:bg-gris-canon-de-fusil/5 rounded-xl transition-colors cursor-pointer"
                              title="Archiver cette commande"
                            >
                              <Archive className="h-5 w-5" />
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="py-4 my-2 space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={`${item.product.id}-${index}`}
                        className="flex items-center space-x-4"
                      >
                        {item.selectedImage ? (
                          <img
                            src={item.selectedImage}
                            alt={item.product.name}
                            className="w-14 h-14 object-cover rounded-xl border border-gris-canon-de-fusil/5 shrink-0 bg-gris-canon-de-fusil/5"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl border border-gris-canon-de-fusil/5 bg-gris-canon-de-fusil/5 flex items-center justify-center shrink-0">
                            <Package className="h-6 w-6 text-gris-canon-de-fusil/30" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gris-canon-de-fusil truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-gris-canon-de-fusil/50 mt-0.5">
                            Quantité: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-extrabold text-gris-canon-de-fusil">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gris-canon-de-fusil/5 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-right order-1 sm:order-2">
                      <span className="text-xs text-gris-canon-de-fusil/40 mr-2">
                        Montant total :
                      </span>
                      <span className="text-xl font-black text-bleu-saphir">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Buttons Actifs */}
                  <div className="mt-5 grid grid-cols-2 gap-3 pt-1">
                    <button
                      onClick={() => setSelectedOrderForTracking(order)}
                      className="w-full px-4 py-2.5 border border-gris-canon-de-fusil/10 text-gris-canon-de-fusil/70 hover:bg-gris-canon-de-fusil/5 font-bold text-sm rounded-xl transition-colors cursor-pointer text-center"
                    >
                      Détails du suivi
                    </button>
                    <Link
                      to="/contact"
                      className="w-full px-4 py-2.5 bg-bleu-saphir text-blanc hover:bg-bleu-saphir/90 font-bold text-sm rounded-xl transition-colors cursor-pointer text-center shadow-xs block"
                    >
                      Besoin d'aide ?
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE MODIFICATION DE COMMANDE (PRODUITS + QUANTITES) */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-300">
          <div className="bg-blanc max-w-lg w-full rounded-2xl shadow-xl border border-gris-canon-de-fusil/5 overflow-hidden p-6 space-y-5 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gris-canon-de-fusil/5 shrink-0">
              <h3 className="text-base font-black text-gris-canon-de-fusil">
                Modifier la commande COM-
                {editingOrder.id.slice(0, 8).toUpperCase()}
              </h3>
              <button
                type="button"
                onClick={() => setEditingOrder(null)}
                className="p-1 rounded-lg hover:bg-gris-canon-de-fusil/5 text-gris-canon-de-fusil/60 hover:text-gris-canon-de-fusil transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleUpdateOrder}
              className="space-y-4 overflow-y-auto pr-1 flex-1"
            >
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gris-canon-de-fusil mb-1">
                    Nom du destinataire
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.shippingName}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        shippingName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-blanc border border-gris-canon-de-fusil/20 rounded-xl text-xs focus:outline-none focus:border-bleu-saphir"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gris-canon-de-fusil mb-1">
                    Adresse de livraison
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.shippingAddress}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        shippingAddress: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-blanc border border-gris-canon-de-fusil/20 rounded-xl text-xs focus:outline-none focus:border-bleu-saphir"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gris-canon-de-fusil mb-1">
                    Téléphone de contact
                  </label>
                  <input
                    type="tel"
                    required
                    value={editForm.shippingPhone}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        shippingPhone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-blanc border border-gris-canon-de-fusil/20 rounded-xl text-xs focus:outline-none focus:border-bleu-saphir"
                  />
                </div>
              </div>

              {/* LISTE ET MODIFICATION DES ARTICLES */}
              <div className="pt-2 border-t border-gris-canon-de-fusil/5">
                <h4 className="text-xs font-black text-gris-canon-de-fusil mb-3">
                  Articles de la commande
                </h4>
                <div className="space-y-3">
                  {editForm.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gris-canon-de-fusil/2 rounded-xl border border-gris-canon-de-fusil/5 gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gris-canon-de-fusil truncate">
                          {item.productName}
                        </p>
                        <p className="text-[10px] text-gris-canon-de-fusil/50">
                          {formatPrice(item.price)} / unité
                        </p>
                      </div>

                      {/* Sélecteur de Quantité */}
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(idx, -1);
                          }}
                          className="p-1 rounded-lg bg-gris-canon-de-fusil/10 hover:bg-gris-canon-de-fusil/20 text-gris-canon-de-fusil cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-extrabold text-gris-canon-de-fusil min-w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(idx, 1);
                          }}
                          className="p-1 rounded-lg bg-gris-canon-de-fusil/10 hover:bg-gris-canon-de-fusil/20 text-gris-canon-de-fusil cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Suppression d'un article */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveItem(idx);
                        }}
                        className="p-1.5 text-rouge-ecarlate hover:bg-rouge-ecarlate/10 rounded-lg transition-colors cursor-pointer"
                        title="Supprimer ce produit"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nouveau total calculé */}
              <div className="flex items-center justify-between pt-3 border-t border-gris-canon-de-fusil/5 shrink-0">
                <span className="text-xs font-bold text-gris-canon-de-fusil/60">
                  Nouveau Total à payer :
                </span>
                <span className="text-lg font-black text-bleu-saphir">
                  {formatPrice(calculatedNewTotal)}
                </span>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-gris-canon-de-fusil/5 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 bg-gris-canon-de-fusil/5 hover:bg-gris-canon-de-fusil/10 text-xs font-bold rounded-xl text-gris-canon-de-fusil/70"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-4 py-2 bg-bleu-saphir text-blanc text-xs font-bold rounded-xl hover:bg-bleu-saphir/90 transition-all flex items-center cursor-pointer"
                >
                  {isSavingEdit ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE SUIVI DE COMMANDE */}
      {selectedOrderForTracking &&
        (() => {
          const computed = getComputedStatus(selectedOrderForTracking);
          const currentStep = getStatusInfo(computed).step;

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-300">
              <div className="bg-blanc max-w-lg w-full rounded-2xl shadow-xl border border-gris-canon-de-fusil/5 overflow-hidden transform transition-all duration-300">
                {/* Header Modal */}
                <div className="p-6 border-b border-gris-canon-de-fusil/5 flex items-center justify-between bg-gris-canon-de-fusil/2">
                  <div>
                    <h3 className="text-lg font-black text-gris-canon-de-fusil tracking-tight">
                      Suivi de Commande
                    </h3>
                    <p className="text-xs text-gris-canon-de-fusil/50 mt-0.5">
                      Référence : COM-
                      {selectedOrderForTracking.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOrderForTracking(null)}
                    className="p-2 hover:bg-gris-canon-de-fusil/10 text-gris-canon-de-fusil/50 hover:text-gris-canon-de-fusil rounded-xl transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Contenu Modal */}
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4 bg-gris-canon-de-fusil/5 p-4 rounded-xl text-xs">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-bleu-saphir shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-gris-canon-de-fusil">
                          Destination
                        </p>
                        <p className="text-gris-canon-de-fusil/60 mt-0.5">
                          {selectedOrderForTracking.shippingAddress.street}{" "}
                          {selectedOrderForTracking.shippingAddress.city}{" "}
                          {selectedOrderForTracking.shippingAddress.country}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-bleu-saphir shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-gris-canon-de-fusil">
                          Date d'achat
                        </p>
                        <p className="text-gris-canon-de-fusil/60 mt-0.5">
                          {new Date(
                            selectedOrderForTracking.createdAt,
                          ).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedOrderForTracking.status === "cancelled" ? (
                    <div className="flex items-center gap-3 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <div className="text-xs font-bold">
                        Cette commande a été annulée. Veuillez contacter notre
                        service client si nécessaire.
                      </div>
                    </div>
                  ) : (
                    <div className="relative pl-6 space-y-6 before:absolute before:bottom-2 before:top-2 before:left-2.75 before:w-0.5 before:bg-gris-canon-de-fusil/50">
                      {trackingSteps.map((step, idx) => {
                        const stepNum = idx + 1;
                        const isCompleted = currentStep >= stepNum;
                        const isCurrent = currentStep === stepNum;

                        return (
                          <div
                            key={idx}
                            className="relative flex items-start gap-4 text-xs"
                          >
                            <div
                              className={`absolute -left-5.25 h-4 w-4 rounded-full flex items-center justify-center transition-all duration-300 bg-bleu-saphir z-10 ${
                                isCompleted
                                  ? "bg-vert-jungle text-blanc"
                                  : "border-gris-canon-de-fusil/20"
                              }`}
                            >
                              {isCompleted && (
                                <div className="h-1.5 w-1.5 bg-blanc rounded-full" />
                              )}
                            </div>

                            <div className="flex-1">
                              <h4
                                className={`font-bold ${
                                  isCurrent
                                    ? step.label !== "Livrée"
                                      ? "text-bleu-saphir text-sm"
                                      : "text-vert-jungle"
                                    : isCompleted && "text-vert-jungle"
                                }`}
                              >
                                {step.label}
                              </h4>
                              <p className="text-gris-canon-de-fusil/50 mt-0.5">
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-gris-canon-de-fusil/5 bg-gris-canon-de-fusil/2 flex justify-end">
                  <button
                    onClick={() => setSelectedOrderForTracking(null)}
                    className="px-5 py-2 bg-gris-canon-de-fusil text-blanc text-xs font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {/* MODAL DE FACTURE CLIENT */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-300">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl border border-gris-canon-de-fusil/5 overflow-hidden p-6 space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <h3 className="text-base font-black text-gris-canon-de-fusil">
                Facture Client - COM-
                {invoiceOrder.id.slice(0, 8).toUpperCase()}
              </h3>
              <button
                onClick={() => setInvoiceOrder(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs" id="invoice-printable">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-black text-bleu-saphir">
                    NOLCOP STORE
                  </h2>
                  <p className="text-[10px] text-gray-500">
                    Facture Officielle d'Achat
                  </p>
                </div>
                <div className="text-right text-[11px]">
                  <p className="font-bold">
                    Date :{" "}
                    {new Date(invoiceOrder.createdAt).toLocaleDateString(
                      "fr-FR",
                    )}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl space-y-1">
                <p className="font-bold text-gray-700">
                  Adresse de livraison :
                </p>
                <p>{(invoiceOrder as any).shippingName || user?.email}</p>
                <p>{invoiceOrder.shippingAddress.street}</p>
                <p>{(invoiceOrder as any).shippingPhone}</p>
              </div>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 text-[11px]">
                    <th className="py-2">Produit</th>
                    <th className="py-2 text-center">Qté</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoiceOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2 font-medium">{item.product.name}</td>
                      <td className="py-2 text-center">{item.quantity}</td>
                      <td className="py-2 text-right font-bold">
                        {formatPrice(item.product.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="font-bold text-gray-600">Total payé :</span>
                <span className="text-base font-black text-bleu-saphir">
                  {formatPrice(invoiceOrder.total)}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-bleu-saphir text-white text-xs font-bold rounded-xl flex items-center space-x-2 cursor-pointer hover:bg-bleu-saphir/90"
              >
                <Printer className="h-4 w-4" />
                <span>Imprimer / Télécharger (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMATION D'ANNULATION */}
      {deletingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-300">
          <div className="bg-blanc max-w-sm w-full rounded-2xl shadow-xl border border-gris-canon-de-fusil/5 overflow-hidden p-6 space-y-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gris-canon-de-fusil mb-2">
                Annuler cette commande ?
              </h3>
              <p className="text-xs text-gris-canon-de-fusil/60 leading-relaxed">
                Le statut de la commande passera à "Annulé". Cette action ne
                supprime pas la commande de votre historique.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeletingOrderId(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Retour
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition-colors cursor-pointer flex justify-center items-center"
              >
                {isDeleting ? "Annulation..." : "Confirmer l'annulation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
