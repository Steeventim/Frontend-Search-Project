import React, { useState, ReactNode, useEffect } from "react";
import { connectSocket, getSocket } from "../../services/socket";
import { dashboardService } from "../../services/dashboardService";
import type { DashboardData } from "../../types/dashboard";
import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>{children}</div>
  );
};

const AdminDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState("week");

  // State for real dashboard data. dashboardService returns `DashboardData` in some setups,
  // keep a union so we can accept either the older BackendResponse/BackendBody shape or
  // the typed DashboardData returned by the service.
  const [data, setData] = useState<DashboardData | BackendResponse | BackendBody | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
  const load = async () => {
      try {
      const res = await dashboardService.getDashboardData();
      if (mounted) setData(res as DashboardData);
      } catch (e: unknown) {
        console.error("Erreur lors du chargement du dashboard:", e);
        if (mounted) setError("Impossible de charger les données du dashboard");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    // connect socket and listen for document_transferred events
    const s = connectSocket();
  const onDocumentTransferred = (payload: unknown) => {
      // payload expected to contain { document: {...} } or the document itself
      try {
        const obj = (payload && typeof payload === 'object') ? (payload as Record<string, unknown>) : null;
        const doc = obj && 'document' in obj ? (obj.document as Record<string, unknown>) : obj;
        if (!mounted || !doc) return;
        setData((prevData) => {
          const prevObj = (prevData as BackendResponse | BackendBody | null) ?? {};
          const prevBody = ((prevObj as BackendResponse).data ?? (prevObj as BackendBody)) as BackendBody;
          const recentArray = Array.isArray(prevBody.documents?.recent) ? [...(prevBody.documents!.recent as DocumentItem[])] : [];
          recentArray.unshift(doc as DocumentItem);
          prevBody.documents = prevBody.documents ?? {};
          prevBody.documents.recent = recentArray.slice(0, 20);
          if (!prevBody.overview) prevBody.overview = {};
          prevBody.overview.documents = (prevBody.overview.documents ?? {}) as DocumentsOverview;
          prevBody.overview.documents.total = (Number(prevBody.overview.documents.total || 0) + 1);
          return ({ ...(prevObj as object ?? {}), data: prevBody } as unknown) as BackendResponse;
        });
      } catch (err) {
        console.debug('Error processing document_transferred socket payload', err);
      }
    };
    s.on('document_transferred', onDocumentTransferred);
    return () => {
      mounted = false;
      try {
        const sk = getSocket();
        if (sk) {
          sk.off('document_transferred', onDocumentTransferred as (...args: unknown[]) => void);
        }
      } catch (err) {
        console.debug('Error removing socket listener', err);
      }
      // optional: keep socket connected globally for other pages; only disconnect if you want
      // disconnectSocket();
    };
  }, []);

  // Helper to read nested values with fallback
  const safe = (fn: () => unknown, fallback: unknown = "-") => {
    try {
      const v = fn();
      return v === undefined || v === null ? fallback : v;
    } catch {
      return fallback;
    }
  };

  // Backend response types (minimal subset we use)
  type UsersOverview = { total?: number; active?: number };
  type DocumentsOverview = { total?: number; pending?: number; processed?: number };
  type UserRecent = { idUser?: string; Email?: string; NomUser?: string; PrenomUser?: string; LastLogin?: string | null; IsActive?: boolean };
  type DocumentItem = { idDocument?: string; Title?: string; title?: string; status?: string; transferStatus?: string; transferTimestamp?: string; createdAt?: string; etape?: { LibelleEtape?: string } };
  type WorkflowEtape = { idEtape?: string; LibelleEtape?: string; sequenceNumber?: number; totalDocuments?: number; documentCount?: number };

  type BackendBody = {
    overview?: { users?: UsersOverview; documents?: DocumentsOverview; system?: Record<string, unknown>; notifications?: Record<string, unknown> };
    users?: { recentActivity?: UserRecent[]; byRole?: unknown[] };
    documents?: { recent?: DocumentItem[]; dailyCreation?: { day: string; count: number }[]; byStatus?: unknown[]; byEtape?: WorkflowEtape[] };
    workflow?: { etapeEfficiency?: WorkflowEtape[]; flowDistribution?: unknown[] };
    metrics?: unknown;
  };

  type BackendResponse = { success?: boolean; timestamp?: string; data?: BackendBody };

  // Normalize runtime shape: if `data` looks like DashboardData (has `tasks`), treat
  // it separately; otherwise fall back to the BackendBody/BackendResponse shape.
  const isDashboardData = data && typeof data === 'object' && 'tasks' in (data as Record<string, unknown>);
  const dashboardBody = isDashboardData ? (data as DashboardData) : undefined;
  const body = dashboardBody ? ({} as BackendBody) : (((data as BackendResponse)?.data ?? (data as BackendBody)) ?? ({} as BackendBody));
  const overview = dashboardBody ? (dashboardBody.stats ? ({ users: { total: dashboardBody.stats.processesCount?.total ?? 0 }, documents: { total: dashboardBody.stats.processesCount?.total ?? 0 } } as BackendBody['overview']) : {}) : ((body.overview ?? {}) as BackendBody['overview']);
  const usersOverview = dashboardBody ? ({ total: dashboardBody.stats?.processesCount?.total ?? 0, active: 0 } as UsersOverview) : ((overview?.users ?? {}) as UsersOverview);
  const documentsOverview = dashboardBody ? ({ total: dashboardBody.stats?.processesCount?.total ?? 0, pending: dashboardBody.stats?.processesCount?.pending ?? 0, processed: dashboardBody.stats?.processesCount?.completed ?? 0 } as DocumentsOverview) : ((overview?.documents ?? {}) as DocumentsOverview);

  // Primary UI values
  const totalUsers = String(safe(() => usersOverview.total, "-"));
  const activeUsers = String(safe(() => usersOverview.active, "-"));
  const totalDocuments = Number(safe(() => documentsOverview.total, 0));
  const pendingDocuments = Number(safe(() => documentsOverview.pending, 0));
  const completedDocuments = Number(safe(() => documentsOverview.processed ?? 0, 0));
  // Helper to safely read nested values from unknown objects without 'any'
  const getNested = <T,>(obj: unknown, path: string[]): T | undefined => {
    let cur: unknown = obj;
    for (const p of path) {
      if (!cur || typeof cur !== "object") return undefined;
      const record = cur as Record<string, unknown>;
      if (!(p in record)) return undefined;
      cur = record[p];
    }
    return cur as T | undefined;
  };

  const averageCompletionTime = dashboardBody ? String("-") : String(safe(() => getNested<number>(body.metrics, ["trends", "documents", "trend"]) ?? "-", "-"));

  // Documents lists and distributions
  const recentDocs: DocumentItem[] = dashboardBody && Array.isArray(dashboardBody.tasks) ? dashboardBody.tasks.slice(0,20).map(t => ({ idDocument: t.processId, Title: t.processName, status: t.status })) : (Array.isArray(body.documents?.recent) ? (body.documents!.recent as DocumentItem[]) : []);
  const dailyCreation: { day: string; count: number }[] = dashboardBody && Array.isArray(dashboardBody.stats?.deadlines ? [] : []) ? [] : (Array.isArray(body.documents?.dailyCreation) ? (body.documents!.dailyCreation as { day: string; count: number }[]) : []);
  const byStatus: { status?: string; transferStatus?: string; count?: number }[] = dashboardBody ? (dashboardBody.stats ? [{ status: undefined, transferStatus: undefined, count: dashboardBody.stats.processesCount?.total ?? 0 }] : []) : (Array.isArray(body.documents?.byStatus) ? (body.documents!.byStatus as { status?: string; transferStatus?: string; count?: number }[]) : (Array.isArray(body.workflow?.flowDistribution) ? (body.workflow!.flowDistribution as { status?: string; transferStatus?: string; count?: number }[]) : []));
  const etapeEfficiency: WorkflowEtape[] = dashboardBody && Array.isArray(dashboardBody.processes) ? dashboardBody.processes.map(p => ({ idEtape: String(p.id), LibelleEtape: p.title, totalDocuments: p.totalSteps })) : (Array.isArray(body.workflow?.etapeEfficiency) ? (body.workflow!.etapeEfficiency as WorkflowEtape[]) : (Array.isArray(body.documents?.byEtape) ? (body.documents!.byEtape as WorkflowEtape[]) : []));

  // Build a recentActivity list combining user recentActivity and recent documents
  const recentActivity: Record<string, unknown>[] = [];
  if (Array.isArray(body.users?.recentActivity)) {
    for (const u of body.users!.recentActivity as UserRecent[]) {
      recentActivity.push({
        id: String(u.idUser ?? ""),
        type: "user",
        user: `${String(u.PrenomUser ?? "")} ${String(u.NomUser ?? "")}`.trim() || String(u.Email ?? ""),
        timestamp: u.LastLogin ?? null,
        status: u.IsActive ? "Actif" : "Inactif",
      });
    }
  }
  if (recentDocs.length) {
    for (const doc of recentDocs) {
      const uploader = getNested<string>(doc, ["uploader"]) ?? getNested<string>(doc, ["uploaderName"]) ?? "";
      const idVal = String(doc.idDocument ?? getNested<string>(doc, ["id"]) ?? getNested<string>(doc, ["_id"]) ?? "");
      recentActivity.push({
        id: idVal,
        type: "document",
        user: uploader,
        process: doc.Title ?? doc.title ?? "",
        timestamp: doc.transferTimestamp ?? doc.createdAt ?? null,
        status: doc.status ?? doc.transferStatus ?? "",
        etape: doc.etape?.LibelleEtape ?? "",
      });
    }
  }

  // Use etapeEfficiency to build a simple list for display
  const steps = etapeEfficiency.map((s) => ({
    id: String(s.idEtape ?? ""),
    label: String(s.LibelleEtape ?? ""),
    count: Number(s.totalDocuments ?? s.documentCount ?? 0),
  }));

    // Chart helpers: compute scale basing on largest relevant value
    const maxForBars = Math.max(
      1,
      totalDocuments,
      completedDocuments,
      pendingDocuments,
      ...dailyCreation.map((d) => d.count)
    );

    const statusColorHex = (status?: string) => {
      if (!status) return "#9CA3AF"; // gray
      switch (status.toLowerCase()) {
        case "terminé":
        case "termine":
        case "completed":
          return "#10B981"; // green
        case "en cours":
        case "in progress":
          return "#3B82F6"; // blue
        case "en attente":
        case "pending":
          return "#F59E0B"; // amber
        case "rejeté":
        case "rejete":
        case "rejected":
          return "#EF4444"; // red
        default:
          return "#6B7280"; // neutral
      }
    };


  const getActivityIcon = (type: string) => {
    switch (type) {
      case "process_created":
  return <FileText className="h-5 w-5 text-green-500" />;
      case "process_completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "process_rejected":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "user_added":
        return <Users className="h-5 w-5 text-purple-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-200";

    switch (status.toLowerCase()) {
      case "en cours":
  return "bg-green-100 text-green-800";
      case "terminé":
        return "bg-green-100 text-green-800";
      case "en attente":
        return "bg-yellow-100 text-yellow-800";
      case "rejeté":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Show loading / error states so variables are used and UX is clear
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-gray-500">Chargement du tableau de bord...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-50">
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tableau de bord administrateur
              </h1>
              <p className="text-gray-500">
                Vue d'ensemble de l'activité de la plateforme
              </p>
            </div>
            <div className="flex items-center mt-4 sm:mt-0">
              <div className="relative">
                <select
                  className="w-full sm:w-40 border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="day">Aujourd'hui</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                  <option value="quarter">Ce trimestre</option>
                  <option value="year">Cette année</option>
                </select>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* User Statistics */}
            <Card className="p-4">
              <div className="pb-2">
                <p className="text-sm font-medium text-gray-500">Utilisateurs</p>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold">{totalUsers}</div>
                  <p className="text-xs text-gray-500">{activeUsers} actifs</p>
                </div>
                <div className="flex items-center text-green-500">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">-</span>
                </div>
              </div>
            </Card>

            {/* Process Statistics */}
            <Card className="p-4">
              <div className="pb-2">
                  <p className="text-sm font-medium text-gray-500">Documents</p>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-2xl font-bold">{totalDocuments}</div>
                    <p className="text-xs text-gray-500">{pendingDocuments} en attente</p>
                  </div>
                  <div className="flex items-center text-green-500">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">
                      {totalDocuments > 0 ? `${Math.round((completedDocuments / Math.max(1, totalDocuments)) * 100)}%` : "0%"}
                    </span>
                  </div>
                </div>
            </Card>

            {/* Completion Rate */}
            <Card className="p-4">
              <div className="pb-2">
                <p className="text-sm font-medium text-gray-500">
                  Taux de complétion
                </p>
              </div>
              <div className="flex flex-col">
                <div className="text-2xl font-bold">
                  {totalDocuments > 0 ? Math.round((completedDocuments / Math.max(1, totalDocuments)) * 100) : 0}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${totalDocuments > 0 ? (completedDocuments / Math.max(1, totalDocuments)) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {completedDocuments} terminés sur {totalDocuments}
                </p>
              </div>
            </Card>

            {/* Average Time */}
            <Card className="p-4">
              <div className="pb-2">
                <p className="text-sm font-medium text-gray-500">Temps moyen</p>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold">{averageCompletionTime} jours</div>
                  <p className="text-xs text-gray-500">
                    Durée moyenne de traitement
                  </p>
                </div>
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Documents Evolution Chart (simple) */}
            <Card className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium">Évolution des documents</h3>
                <p className="text-sm text-gray-500">Nombre total et terminés</p>
              </div>
              <div className="h-64 bg-gray-100 rounded-lg p-4">
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">Total de documents</div>
                      <div className="text-xs text-gray-500">Vue rapide</div>
                    </div>
                    <div className="text-sm text-gray-600">{new Date().toLocaleDateString()}</div>
                  </div>

                  <div className="flex items-end gap-6 mt-4 h-40">
                    {/* Modern vertical metric cards (animated heights) */}
                    {[
                      { label: 'Total', value: totalDocuments, color: '#60A5FA' },
                      { label: 'Terminés', value: completedDocuments, color: '#10B981' },
                      { label: 'En attente', value: pendingDocuments, color: '#F59E0B' },
                    ].map((m) => {
                      const pct = Math.round((m.value / maxForBars) * 100);
                      return (
                        <div key={m.label} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-12 rounded-t transition-all duration-700 ease-out"
                            style={{
                              height: `${pct}%`,
                              background: `linear-gradient(180deg, ${m.color} 0%, ${m.color}cc 100%)`,
                              boxShadow: '0 6px 18px rgba(0,0,0,0.08)'
                            }}
                          />
                          <div className="text-xs font-semibold mt-2">{m.label}</div>
                          <div className="text-sm text-gray-700">{m.value}</div>
                        </div>
                      );
                    })}

                    {/* sparkline: dailyCreation */}
                    <div className="w-40 ml-4">
                      <div className="text-xs text-gray-600">Par jour</div>
                      <div className="flex items-end gap-1 mt-2 h-24">
                        {dailyCreation.length > 0 ? dailyCreation.map((d, i) => {
                          const h = Math.round((d.count / Math.max(1, ...dailyCreation.map(dc => dc.count))) * 100);
                          return (
                            <div key={i} title={`${d.day}: ${d.count}`} className="flex-1" style={{ padding: '0 2px' }}>
                              <div style={{ height: `${h}%`, background: '#3B82F6', borderRadius: 4, transition: 'height .6s' }} />
                            </div>
                          );
                        }) : (
                          <div className="text-xs text-gray-400">Aucune donnée</div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">Derniers jours</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Documents Distribution Chart */}
            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium">Répartition des documents</h3>
                  <p className="text-sm text-gray-500">Distribution par statut</p>
                </div>
                <div className="inline-flex rounded-md shadow-sm">
                  <button className="px-2 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-l-md">Par statut</button>
                  <button className="px-2 py-1 text-xs font-medium text-gray-700 bg-white rounded-r-md border-l">Par département</button>
                </div>
              </div>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="flex items-center gap-6">
                  {/* Donut chart using conic-gradient with center label */}
                  <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
                    <div
                      aria-hidden
                      style={{
                        width: 140,
                        height: 140,
                        borderRadius: '50%',
                        background: (() => {
                          const total = totalDocuments || 0;
                          const completedPct = total > 0 ? Math.round((completedDocuments / total) * 100) : 0;
                          const pendingPct = total > 0 ? Math.round((pendingDocuments / total) * 100) : 0;
                          const doneColor = statusColorHex('terminé');
                          const pendColor = statusColorHex('en attente');
                          return `conic-gradient(${doneColor} ${completedPct}%, ${pendColor} ${completedPct + pendingPct}%, #E5E7EB 0%)`;
                        })(),
                        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.06)'
                      }}
                    />
                    {/* inner circle */}
                    <div style={{ position: 'absolute', width: 86, height: 86, borderRadius: '50%', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.06)' }}>
                      <div className="text-sm text-gray-500">Complété</div>
                      <div className="text-xl font-bold">{totalDocuments > 0 ? `${Math.round((completedDocuments / totalDocuments) * 100)}%` : '0%'}</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="text-sm font-medium">Légende</div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <span style={{ width: 12, height: 12, borderRadius: 3, background: statusColorHex('terminé'), display: 'inline-block' }} />
                        <span>Terminés</span>
                        <span className="ml-2 text-gray-500">{completedDocuments}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <span style={{ width: 12, height: 12, borderRadius: 3, background: statusColorHex('en attente'), display: 'inline-block' }} />
                        <span>En attente</span>
                        <span className="ml-2 text-gray-500">{pendingDocuments}</span>
                      </div>
                      {byStatus.slice(0,5).map((bs, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                          <span style={{ width: 10, height: 10, borderRadius: 3, background: statusColorHex(String(bs.status ?? bs.transferStatus)), display: 'inline-block' }} />
                          <span>{bs.status ?? bs.transferStatus}</span>
                          <span className="ml-2 text-gray-500">{bs.count ?? 0}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Documents & Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-2">Documents récents</h3>
              {recentDocs.length === 0 ? (
                <p className="text-gray-500">Aucun document récent</p>
              ) : (
                <ul className="space-y-3">
                  {recentDocs.map((d) => {
                    const idVal = String(d.idDocument ?? getNested<string>(d, ["id"]) ?? getNested<string>(d, ["_id"]) ?? "");
                    const uploader = getNested<string>(d, ["uploader"]) ?? getNested<string>(d, ["uploaderName"]) ?? "";
                    return (
                      <li key={idVal} className="border p-2 rounded">
                        <div className="font-medium">{d.Title ?? d.title}</div>
                        <div className="text-sm text-gray-500">Statut: {d.status ?? d.transferStatus}</div>
                        <div className="text-xs text-gray-400">Étape: {d.etape?.LibelleEtape ?? "-"}</div>
                        {uploader && <div className="text-xs text-gray-500 mt-1">Par: {uploader}</div>}
                      </li>
                    );
                  })}
                </ul>
              )}
              {dailyCreation.length > 0 && (
                <div className="mt-4 text-sm text-gray-600">
                  Créations récentes: {dailyCreation.map(dc => `${new Date(dc.day).toLocaleDateString()} (${dc.count})`).join(', ')}
                </div>
              )}
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-medium mb-2">Étapes du workflow</h3>
              {steps.length === 0 ? (
                <p className="text-gray-500">Aucune étape disponible</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600">
                      <th>Étape</th>
                      <th>Documents</th>
                    </tr>
                  </thead>
                  <tbody>
                    {steps.map((s) => (
                      <tr key={s.id} className="border-t">
                        <td className="py-2">{s.label}</td>
                        <td className="py-2">{s.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {byStatus.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium">Par statut</h4>
                  <ul className="text-sm text-gray-600">
                    {byStatus.map((bs, idx) => (
                      <li key={idx}>{bs.status ?? bs.transferStatus}: {bs.count ?? 0}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </div>

          {/* Recent Activity Feed */}
          <Card className="p-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Activité récente</h3>
              <p className="text-sm text-gray-500">
                Dernières actions sur la plateforme
              </p>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity: Record<string, unknown>) => {
                const id = String(safe(() => activity.id, ""));
                const type = String(safe(() => activity.type, ""));
                const user = String(safe(() => activity.user, ""));
                const processName = String(safe(() => activity.process, ""));
                const status = String(safe(() => activity.status, ""));
                const timestamp = String(safe(() => activity.timestamp, ""));

                return (
                  <div key={id} className="flex items-start">
                    <div className="flex-shrink-0 mr-3">{getActivityIcon(type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {user}
                        {type === "process_created" && " a créé un nouveau document"}
                        {type === "process_completed" && " a terminé un document"}
                        {type === "process_rejected" && " a rejeté un document"}
                        {type === "user_added" && " a ajouté un nouvel utilisateur"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {processName !== "N/A" && `Document: ${processName}`}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(timestamp)}</p>
                    </div>
                    {status && (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="border-t mt-4 pt-4">
              <a
                href="#"
                className="text-sm text-green-600 hover:text-green-800 flex items-center"
              >
                Voir toute l'activité
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
