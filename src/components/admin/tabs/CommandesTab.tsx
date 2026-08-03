// src/components/admin/tabs/CommandesTab.tsx
import React, { useEffect, useState } from "react";
import {
  Eye,
  Archive,
  ArchiveRestore,
  File,
  AlertCircle,
  Printer,
  Bell,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { Table } from "../Table";
import { Modal } from "../Modal";
import { supabase } from "../../../supabaseClient";

export const CommandesTab: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<any | null>(null);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newOrderNotification, setNewOrderNotification] = useState<
    string | null
  >(null);
  // Bascule d'affichage : commandes actives (non archivées) vs archivées.
  // Ce filtre n'existe QUE côté admin : le client, lui, voit toujours
  // toutes ses commandes quel que soit leur statut d'archivage.
  const [showArchived, setShowArchived] = useState(false);
  const [restoringId, setRestoringId] = useState(false);
  const [loading, setLoading] = useState(true);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-BJ", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatRef = (id: string) => {
    return `COM${id.split("-")[0].substring(0, 5).toUpperCase()}`;
  };

  const fetchOrders = async () => {
    setLoading(true);
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
          product:products (
            id,
            name,
            images
          )
        )
      `,
      )
      .eq("is_archived", showArchived)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur de chargement des commandes :", error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    // Écoute en temps réel des nouvelles commandes
    const channel = supabase
      .channel("admin_orders_channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          setNewOrderNotification(
            `Nouvelle commande reçue ! (Ref: COM-${payload.new.id.slice(0, 8).toUpperCase()})`,
          );
          fetchOrders();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Recharge la liste quand on bascule entre "Actives" et "Archivées"
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showArchived]);

  // Calcul du statut automatique selon le temps écoulé
  const getComputedStatus = (order: any) => {
    if (order.status === "cancelled" || order.status === "delivered") {
      return order.status;
    }
    const now = new Date().getTime();
    const created = new Date(order.created_at).getTime();
    const diffMinutes = (now - created) / (1000 * 60);

    if (diffMinutes < 10) return "pending";
    if (diffMinutes < 30) return "processing";
    return "shipped";
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      console.error("Erreur de mise à jour du statut:", error);
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
    }
  };

  const handleArchiveOrder = async () => {
    if (!deleteOrderId) return;
    setIsDeleting(true);
    try {
      // On ne supprime plus rien et on ne déplace plus la commande vers
      // une autre table : on se contente de marquer is_archived = true.
      // La commande reste donc intacte dans "orders" et le client (qui ne
      // filtre jamais sur is_archived) continue de la voir normalement.
      const { error } = await supabase
        .from("orders")
        .update({ is_archived: true })
        .eq("id", deleteOrderId);

      if (error) throw error;

      setOrders((prev) => prev.filter((o) => o.id !== deleteOrderId));
      setDeleteOrderId(null);
    } catch (err) {
      console.error("Erreur lors de l'archivage :", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestoreOrder = async (orderId: string) => {
    setRestoringId(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ is_archived: false })
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err) {
      console.error("Erreur lors de la restauration :", err);
    } finally {
      setRestoringId(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Nouvelle Commande */}
      {newOrderNotification && (
        <div className="p-4 bg-bleu-saphir/10 border border-bleu-saphir/20 rounded-2xl flex items-center justify-between text-bleu-saphir">
          <div className="flex items-center space-x-3">
            <Bell className="h-5 w-5 animate-bounce" />
            <span className="text-sm font-bold">{newOrderNotification}</span>
          </div>
          <button
            onClick={() => setNewOrderNotification(null)}
            className="p-1 hover:bg-bleu-saphir/20 rounded-lg text-xs font-bold"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Header de la page de commandes */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gris-canon-de-fusil">
          {showArchived ? "Commandes Archivées" : "Toutes les Commandes"}
        </h2>
        <div className="flex items-center space-x-3">
          <span className="text-xs text-gris-canon-de-fusil/60 bg-gris-canon-de-fusil/5 px-3 py-1.5 rounded-xl font-bold">
            {orders.length} commande{orders.length > 1 ? "s" : ""}
          </span>
          <div className="flex bg-gris-canon-de-fusil/5 rounded-xl p-1">
            <button
              onClick={() => setShowArchived(false)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                !showArchived
                  ? "bg-bleu-saphir text-white"
                  : "text-gris-canon-de-fusil/60 hover:text-gris-canon-de-fusil"
              }`}
            >
              Actives
            </button>
            <button
              onClick={() => setShowArchived(true)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                showArchived
                  ? "bg-bleu-saphir text-white"
                  : "text-gris-canon-de-fusil/60 hover:text-gris-canon-de-fusil"
              }`}
            >
              Archivées
            </button>
          </div>
        </div>
      </div>

      {/* Tableau des commandes */}
      <Table
        headers={[
          "Ref",
          "Client",
          "Total",
          "Date commande",
          "Paiement",
          "Adresse",
          "Téléphone",
          "Status",
          "Actions",
        ]}
      >
        {loading ? (
          <tr>
            <td colSpan={9} className="px-6 py-8 text-center text-sm">
              Chargement...
            </td>
          </tr>
        ) : orders.length === 0 ? (
          <tr>
            <td colSpan={9} className="px-6 py-8 text-center text-sm">
              Aucune commande trouvée.
            </td>
          </tr>
        ) : (
          orders.map((order) => {
            const currentStatus = getComputedStatus(order);
            const isShippedOrDelivered =
              currentStatus === "shipped" || currentStatus === "delivered";
            const isDeleteOrDelivered =
              currentStatus === "cancelled" || currentStatus === "delivered";

            return (
              <tr key={order.id}>
                <td className="px-6 py-4 text-sm font-bold text-bleu-saphir/70">
                  {formatRef(order.id)}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gris-canon-de-fusil">
                  {order.shipping_name}
                </td>
                <td className="px-6 py-4 text-sm font-black text-bleu-saphir">
                  {formatPrice(order.total)}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gris-canon-de-fusil">
                  {new Date(order.created_at).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-orange-rougi">
                  {order.payment_method === "mtn_momo"
                    ? "MTN"
                    : order.payment_method === "moov_money"
                      ? "MOOV"
                      : "CELTIIS"}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gris-canon-de-fusil">
                  {order.shipping_address}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gris-canon-de-fusil">
                  {order.shipping_phone}
                </td>
                <td className="px-6 py-4">
                  {currentStatus !== "delivered" ? (
                    <select
                      value={currentStatus}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 focus:outline-none cursor-pointer ${
                        currentStatus === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : currentStatus === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : currentStatus === "shipped"
                              ? "bg-indigo-100 text-indigo-800"
                              : currentStatus === "delivered"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                      }`}
                    >
                      <option value="pending">En attente (10m)</option>
                      <option value="processing">En préparation (20m)</option>
                      <option value="shipped">Expédiée</option>
                      <option value="delivered">Livrée</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                  ) : (
                    <span className="inline-flex items-center px-5 p-2 rounded-full text-xs font-extrabold bg-vert-jungle/10 text-vert-jungle">
                      Livrée
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gris-canon-de-fusil">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      title="Voir les détails"
                      className="text-bleu-saphir p-1.5 hover:bg-bleu-saphir/10 rounded-lg cursor-pointer transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {showArchived ? (
                      <button
                        onClick={() => handleRestoreOrder(order.id)}
                        disabled={restoringId}
                        title="Restaurer dans les commandes actives"
                        className="p-1.5 rounded-lg text-vert-jungle hover:bg-vert-jungle/10 cursor-pointer transition-colors"
                      >
                        <ArchiveRestore className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setDeleteOrderId(order.id)}
                        disabled={!isDeleteOrDelivered}
                        title={
                          isDeleteOrDelivered
                            ? "Archiver"
                            : "Disponible après annulation"
                        }
                        className={`p-1.5 rounded-lg transition-colors ${
                          isDeleteOrDelivered
                            ? "text-rouge-ecarlate hover:bg-rouge-ecarlate/10 cursor-pointer"
                            : "text-gray-300 cursor-not-allowed"
                        }`}
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setInvoiceOrder(order)}
                      disabled={!isShippedOrDelivered}
                      title={
                        isShippedOrDelivered
                          ? "Voir la facture"
                          : "Disponible après expédition"
                      }
                      className={`p-1.5 rounded-lg transition-colors ${
                        isShippedOrDelivered
                          ? "text-vert-jungle hover:bg-vert-jungle/10 cursor-pointer"
                          : "text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      <File className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })
        )}
      </Table>

      {/* Modal 1: Détails de la commande (Eye) */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Détails de la commande COM-${selectedOrder?.id?.slice(0, 8).toUpperCase()}`}
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 bg-gris-canon-de-fusil/5 p-4 rounded-xl text-xs">
              <div>
                <p className="font-bold text-gris-canon-de-fusil">Client :</p>
                <p className="text-gris-canon-de-fusil/70">
                  {selectedOrder.shipping_name}
                </p>
                <p className="text-gris-canon-de-fusil/70">
                  {selectedOrder.shipping_phone}
                </p>
              </div>
              <div>
                <p className="font-bold text-gris-canon-de-fusil">Adresse :</p>
                <p className="text-gris-canon-de-fusil/70">
                  {selectedOrder.shipping_address}
                </p>
              </div>
            </div>

            <h4 className="text-xs font-black text-gris-canon-de-fusil">
              Produits commandés
            </h4>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {selectedOrder.order_items?.map((item: any, idx: number) => {
                const img = item.selected_image || item.product?.images?.[0];
                return (
                  <div
                    key={idx}
                    className="flex items-center space-x-3 p-3 bg-white border border-gris-canon-de-fusil/5 rounded-xl"
                  >
                    {img ? (
                      <img
                        src={img}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs">
                        Img
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gris-canon-de-fusil truncate">
                        {item.product?.name || "Produit"}
                      </p>
                      <p className="text-[10px] text-gris-canon-de-fusil/50">
                        Quantité : {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-bleu-saphir">
                        {formatPrice(item.price_at_time)} / u
                      </p>
                      <p className="text-xs font-black text-gris-canon-de-fusil">
                        {formatPrice(item.price_at_time * item.quantity)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gris-canon-de-fusil/5">
              <span className="text-xs font-bold">Total Général :</span>
              <span className="text-lg font-black text-bleu-saphir">
                {formatPrice(selectedOrder.total)}
              </span>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal 2: Facture (File) */}
      <Modal
        isOpen={!!invoiceOrder}
        onClose={() => setInvoiceOrder(null)}
        title={
          invoiceOrder ? `Facture Client ${formatRef(invoiceOrder.id)}` : ""
        }
      >
        {invoiceOrder && (
          <div className="space-y-6 p-2" id="invoice-content">
            <div className="flex justify-between items-start border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-xl font-black text-bleu-saphir">
                  NOLCOP STORE
                </h2>
                <p className="text-xs text-gray-500">Facture Officielle</p>
              </div>
              <div className="text-right text-[11px] text-gris-canon-de-fusil/70">
                <p className="text-sm font-bold text-gray-700">
                  Réf : {formatRef(invoiceOrder.id)}
                </p>
                <p className="font-bold">
                  Date :{" "}
                  {new Date(invoiceOrder.created_at).toLocaleDateString(
                    "fr-FR",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    },
                  )}
                </p>
              </div>
            </div>
            <div className="bg-gris-canon-de-fusil/5 p-4 rounded-xl border border-gris-canon-de-fusil/10 space-y-2 text-xs">
              <p className="font-extrabold text-bleu-saphir uppercase tracking-wider text-[11px] border-b border-gris-canon-de-fusil/10 pb-1">
                Facturé à
              </p>
              <div className="space-y-1 pt-0.5 text-gris-canon-de-fusil">
                <div className="flex items-center space-x-2 text-gris-canon-de-fusil/80">
                  <User className="h-3.5 w-3.5 shrink-0 text-bleu-saphir/70" />
                  <span>Nom complet : {invoiceOrder.shipping_name}</span>
                </div>
                <div className="flex items-center space-x-2 text-gris-canon-de-fusil/80">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-bleu-saphir/70" />
                  <span>Adresse : {invoiceOrder.shipping_address}</span>
                </div>
                <div className="flex items-center space-x-2 text-gris-canon-de-fusil/80">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-bleu-saphir/70" />
                  <span>Téléphone : {invoiceOrder.shipping_phone}</span>
                </div>
              </div>
            </div>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="py-2">Article</th>
                  <th className="py-2 text-center">Qté</th>
                  <th className="py-2 text-right">Prix U.</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoiceOrder.order_items?.map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td className="py-2 font-medium">{item.product?.name}</td>
                    <td className="py-2 text-center">{item.quantity}</td>
                    <td className="py-2 text-right">
                      {formatPrice(item.price_at_time)}
                    </td>
                    <td className="py-2 text-right font-bold">
                      {formatPrice(item.price_at_time * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <div className="text-right space-y-1">
                <span className="text-xs text-gray-500 mr-4">
                  Total Réglé :
                </span>
                <span className="text-base font-black text-bleu-saphir">
                  {formatPrice(invoiceOrder.total)}
                </span>
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-bleu-saphir text-white text-xs font-bold rounded-xl flex items-center space-x-2 cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                <span>Imprimer / Télécharger (PDF)</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal 3: Confirmation de suppression / Archivage */}
      <Modal
        isOpen={!!deleteOrderId}
        onClose={() => setDeleteOrderId(null)}
        title="Archiver la commande"
      >
        <div className="space-y-4 text-center">
          <AlertCircle className="h-10 w-10 text-rose-600 mx-auto" />
          <p className="text-xs text-gris-canon-de-fusil/80 leading-relaxed">
            Cette commande sera retirée de votre liste de commandes actives et
            déplacée dans l'onglet <b>Archivées</b>. Elle n'est ni supprimée ni
            modifiée : le client continue de la voir normalement dans son
            historique, et vous pouvez la restaurer à tout moment.
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setDeleteOrderId(null)}
              className="flex-1 py-2 bg-gray-100 text-xs font-bold rounded-xl"
            >
              Annuler
            </button>
            <button
              onClick={handleArchiveOrder}
              disabled={isDeleting}
              className="flex-1 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700"
            >
              {isDeleting ? "Archivage..." : "Confirmer l'archivage"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
