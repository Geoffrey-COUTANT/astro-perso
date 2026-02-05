import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Upload, Trash2, ArrowLeft, ImagePlus, Sparkles, Calendar, Link2, Mail, Images, RotateCcw, Save, X, Pencil, Plus, GripVertical, LogOut } from "lucide-react";
import { getStaticImageUrl } from "./data/galleryStaticImages";
import { ADMIN_TOKEN_KEY } from "./AdminLogin";

const API_BASE = process.env.REACT_APP_API_URL || "";

const ADMIN_SECTIONS = [
    { id: "reunions", label: "Réunions", icon: Calendar, path: "/reunions" },
    { id: "galerie", label: "Galerie", icon: Images, path: "/galerie" },
    { id: "liens-utiles", label: "Liens utiles", icon: Link2, path: "/liens-utiles" },
    { id: "contact", label: "Contact", icon: Mail, path: "/contact" },
];

function Admin() {
    const navigate = useNavigate();
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    const [activeSection, setActiveSection] = useState("galerie");
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [hiddenStaticIds, setHiddenStaticIds] = useState([]);
    const [unifiedOrder, setUnifiedOrder] = useState([]);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [reordering, setReordering] = useState(false);
    const [selectedForDeletion, setSelectedForDeletion] = useState(new Set());
    const [unifiedImages, setUnifiedImages] = useState([]);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [galleryStaticListFromApi, setGalleryStaticListFromApi] = useState([]);

    const [meetings, setMeetings] = useState([]);
    const [staticMeetingsFromApi, setStaticMeetingsFromApi] = useState([]);
    const [hiddenStaticMeetingIds, setHiddenStaticMeetingIds] = useState([]);
    const [meetingsLoading, setMeetingsLoading] = useState(false);
    const [editingMeetingId, setEditingMeetingId] = useState(null);
    const [meetingForm, setMeetingForm] = useState({ title: "", description: "", date: "", startTime: "20:30", endTime: "22:30" });
    const [meetingSaving, setMeetingSaving] = useState(false);
    const mainContentRef = useRef(null);
    const meetingFormSectionRef = useRef(null);

    const [linkCategories, setLinkCategories] = useState([]);
    const [linksLoading, setLinksLoading] = useState(false);
    const [editingLink, setEditingLink] = useState(null);
    const [linkForm, setLinkForm] = useState({ name: "", url: "", description: "" });
    const [savingCategoryId, setSavingCategoryId] = useState(null);
    const [linkCategoryTitles, setLinkCategoryTitles] = useState({});
    const [draggedLink, setDraggedLink] = useState(null);

    const [, setContactInfo] = useState(null);
    const [contactLoading, setContactLoading] = useState(false);
    const [contactForm, setContactForm] = useState({ email: "", phone: "", addressLine1: "", addressLine2: "" });
    const [contactSaving, setContactSaving] = useState(false);

    const headers = {
        ...(token ? { "X-Admin-Key": token } : {}),
    };

    const handleLogout = () => {
        sessionStorage.removeItem(ADMIN_TOKEN_KEY);
        navigate("/admin/connect", { replace: true });
    };

    const fetchGalleryData = () => {
        if (!API_BASE) {
            setLoading(false);
            setError("REACT_APP_API_URL non configuré.");
            return;
        }
        setLoading(true);
        Promise.all([
            fetch(`${API_BASE}/api/gallery`).then((r) => (r.ok ? r.json() : [])),
            fetch(`${API_BASE}/api/gallery/static-list`).then((r) => (r.ok ? r.json() : [])),
            fetch(`${API_BASE}/api/gallery/hidden-static`).then((r) => (r.ok ? r.json() : [])),
            fetch(`${API_BASE}/api/gallery/unified-order`).then((r) => (r.ok ? r.json() : [])),
        ])
            .then(([apiData, staticListData, hiddenData, orderData]) => {
                setImages(Array.isArray(apiData) ? apiData : []);
                setGalleryStaticListFromApi(Array.isArray(staticListData) ? staticListData : []);
                setHiddenStaticIds(Array.isArray(hiddenData) ? hiddenData : []);
                setUnifiedOrder(Array.isArray(orderData) ? orderData : []);
                setHasUnsavedChanges(false);
                setSelectedForDeletion(new Set());
            })
            .catch(() => {
                setImages([]);
                setGalleryStaticListFromApi([]);
                setHiddenStaticIds([]);
                setUnifiedOrder([]);
            })
            .finally(() => setLoading(false));
    };

    const allStaticImages = useMemo(
        () =>
            galleryStaticListFromApi
                .filter((item) => item != null && item.id != null)
                .map((item) => ({
                    id: item.id,
                    title: item.title || "",
                    url: item.url || getStaticImageUrl(item.id) || "",
                })),
        [galleryStaticListFromApi]
    );
    const visibleStaticImages = allStaticImages.filter((img) => !hiddenStaticIds.includes(img.id));
    const hiddenStaticImages = allStaticImages.filter((img) => hiddenStaticIds.includes(img.id));

    const buildUnifiedImages = () => {
        const apiItems = images.map((img) => ({ ...img, id: String(img.id), isStatic: false }));
        const staticItems = visibleStaticImages.map((img) => ({ ...img, url: (img.url && img.url.startsWith("http")) ? img.url : (img.url || ""), isStatic: true }));
        const all = [...apiItems, ...staticItems];
        const orderMap = new Map(unifiedOrder.map((id, i) => [id, i]));
        return all.sort((a, b) => {
            const ia = orderMap.has(a.id) ? orderMap.get(a.id) : 9999;
            const ib = orderMap.has(b.id) ? orderMap.get(b.id) : 9999;
            return ia - ib;
        });
    };

    const fetchMeetings = () => {
        if (!API_BASE) return;
        setMeetingsLoading(true);
        Promise.all([
            fetch(`${API_BASE}/api/meetings`).then((r) => (r.ok ? r.json() : [])).catch(() => []),
            fetch(`${API_BASE}/api/meetings/static`).then((r) => (r.ok ? r.json() : [])).catch(() => []),
            fetch(`${API_BASE}/api/meetings/hidden-static`).then((r) => (r.ok ? r.json() : [])).catch(() => []),
        ])
            .then(([data, staticList, hiddenIds]) => {
                setMeetings(Array.isArray(data) ? data : []);
                setStaticMeetingsFromApi(Array.isArray(staticList) ? staticList : []);
                setHiddenStaticMeetingIds(Array.isArray(hiddenIds) ? hiddenIds : []);
            })
            .catch(() => {
                setMeetings([]);
                setStaticMeetingsFromApi([]);
                setHiddenStaticMeetingIds([]);
            })
            .finally(() => setMeetingsLoading(false));
    };

    useEffect(() => {
        fetchGalleryData();
    }, []);

    useEffect(() => {
        if (activeSection === "reunions") fetchMeetings();
    }, [activeSection]);

    const fetchLinks = () => {
        if (!API_BASE) return;
        setLinksLoading(true);
        fetch(`${API_BASE}/api/links`)
            .then((r) => (r.ok ? r.json() : []))
            .then((data) => {
                setLinkCategories(Array.isArray(data) ? data : []);
                setLinkCategoryTitles({});
            })
            .catch(() => setLinkCategories([]))
            .finally(() => setLinksLoading(false));
    };

    useEffect(() => {
        if (activeSection === "liens-utiles") fetchLinks();
    }, [activeSection]);

    const fetchContact = () => {
        if (!API_BASE) return;
        setContactLoading(true);
        fetch(`${API_BASE}/api/contact`)
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
                if (data) {
                    setContactInfo(data);
                    setContactForm({
                        email: data.email || "",
                        phone: data.phone || "",
                        addressLine1: data.addressLine1 || "",
                        addressLine2: data.addressLine2 || "",
                    });
                }
            })
            .catch(() => setContactInfo(null))
            .finally(() => setContactLoading(false));
    };

    useEffect(() => {
        if (activeSection === "contact") fetchContact();
    }, [activeSection]);

    const saveContact = (e) => {
        e.preventDefault();
        if (!API_BASE) return;
        setContactSaving(true);
        fetch(`${API_BASE}/api/contact`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", ...headers },
            body: JSON.stringify(contactForm),
        })
            .then((r) => {
                if (r.status === 401) throw new Error("Clé admin invalide.");
                if (!r.ok) throw new Error("Erreur enregistrement.");
                return r.json();
            })
            .then((data) => {
                setContactInfo(data);
                setMessage("Coordonnées enregistrées.");
            })
            .catch((err) => setError(err.message))
            .finally(() => setContactSaving(false));
    };

    const unifiedMeetings = useMemo(() => {
        return meetings.map((m) => ({
            id: m.id,
            title: m.title,
            description: m.description ?? "",
            startDate: new Date(m.startDate),
            endDate: new Date(m.endDate),
            isStatic: String(m.id).startsWith("static-"),
        })).sort((a, b) => a.startDate - b.startDate);
    }, [meetings]);

    useEffect(() => {
        if (!loading) {
            const items = buildUnifiedImages();
            setUnifiedImages(items);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [images, hiddenStaticIds, unifiedOrder, loading]);

    useEffect(() => {
        if (message || error) {
            const t = setTimeout(() => {
                setMessage("");
                setError("");
            }, 4000);
            return () => clearTimeout(t);
        }
    }, [message, error]);

    const handleUpload = (e) => {
        e.preventDefault();
        if (!file) {
            setError("Sélectionnez un fichier.");
            return;
        }
        if (!API_BASE) {
            setError("REACT_APP_API_URL non configuré. Vérifiez le fichier .env et redémarrez le serveur React (npm start).");
            return;
        }
        setError("");
        setMessage("");
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        if (title.trim()) formData.append("title", title.trim());
        fetch(`${API_BASE}/api/gallery`, {
            method: "POST",
            headers,
            body: formData,
        })
            .then((res) => {
                if (res.status === 401) throw new Error("Clé admin invalide ou manquante.");
                if (!res.ok) throw new Error("Erreur lors de l’upload.");
                return res.json();
            })
            .then(() => {
                setMessage("Image ajoutée avec succès.");
                setFile(null);
                setTitle("");
                const input = document.getElementById("file-input");
                if (input) input.value = "";
                fetchGalleryData();
            })
            .catch((err) => setError(err.message || "Erreur upload (vérifiez que l'API tourne sur le port 5050)."))
            .finally(() => setUploading(false));
    };

    const toggleSelectedForDeletion = (id) => {
        setSelectedForDeletion((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
        setHasUnsavedChanges(true);
    };

    const handleSaveAll = async () => {
        if (!API_BASE) return;
        const orderChanged = unifiedImages.length > 0 && 
            unifiedImages.map((i) => i.id).join(",") !== unifiedOrder.join(",");
        if (selectedForDeletion.size === 0 && !orderChanged) return;
        setReordering(true);
        setError("");
        try {
            for (const id of selectedForDeletion) {
                if (id.startsWith("static-")) {
                    const r = await fetch(`${API_BASE}/api/gallery/hidden-static`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", ...headers },
                        body: JSON.stringify({ id }),
                    });
                    if (r.status === 401) throw new Error("Clé admin invalide.");
                    if (!r.ok) throw new Error("Erreur masquage.");
                } else {
                    const r = await fetch(`${API_BASE}/api/gallery/${id}`, { method: "DELETE", headers });
                    if (r.status === 401) throw new Error("Clé admin invalide.");
                    if (r.status === 404) throw new Error("Image introuvable.");
                    if (!r.ok) throw new Error("Erreur suppression.");
                }
            }
            const newOrder = unifiedImages.filter((img) => !selectedForDeletion.has(img.id)).map((img) => img.id);
            const r = await fetch(`${API_BASE}/api/gallery/unified-order`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", ...headers },
                body: JSON.stringify({ orderedIds: newOrder }),
            });
            if (r.status === 401) throw new Error("Clé admin invalide.");
            if (!r.ok) throw new Error("Erreur réordonnancement.");
            setMessage("Modifications enregistrées.");
            fetchGalleryData();
        } catch (err) {
            setError(err.message || "Erreur enregistrement");
        } finally {
            setReordering(false);
        }
    };


    const formatDateForInput = (d) => {
        if (!d) return "";
        const date = typeof d === "string" ? new Date(d) : d;
        return date.toISOString().slice(0, 10);
    };
    const formatTimeForInput = (d) => {
        if (!d) return "20:30";
        const date = typeof d === "string" ? new Date(d) : d;
        return date.toTimeString().slice(0, 5);
    };

    const handleSaveMeeting = (e) => {
        e.preventDefault();
        if (!API_BASE || !meetingForm.title.trim()) {
            setError("Titre obligatoire.");
            return;
        }
        const date = meetingForm.date || new Date().toISOString().slice(0, 10);
        const startDate = new Date(`${date}T${meetingForm.startTime}:00`);
        const endDate = new Date(`${date}T${meetingForm.endTime}:00`);
        const body = { title: meetingForm.title.trim(), description: meetingForm.description.trim(), startDate: startDate.toISOString(), endDate: endDate.toISOString() };

        setMeetingSaving(true);
        setError("");
        const isStaticEdit = typeof editingMeetingId === "string" && editingMeetingId.startsWith("static-");
        const isEdit = !!editingMeetingId && !isStaticEdit;

        const doSave = () => {
            if (isStaticEdit) {
                return fetch(`${API_BASE}/api/meetings/hidden-static`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", ...headers },
                    body: JSON.stringify({ id: editingMeetingId }),
                }).then((r) => {
                    if (r.status === 401) throw new Error("Clé admin invalide.");
                    if (!r.ok) throw new Error("Erreur masquage.");
                    return fetch(`${API_BASE}/api/meetings`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", ...headers },
                        body: JSON.stringify(body),
                    });
                });
            }
            const url = isEdit ? `${API_BASE}/api/meetings/${editingMeetingId}` : `${API_BASE}/api/meetings`;
            const method = isEdit ? "PUT" : "POST";
            return fetch(url, { method, headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
        };

        doSave()
            .then((r) => {
                if (r.status === 401) throw new Error("Clé admin invalide.");
                if (!r.ok) throw new Error(isEdit ? "Erreur modification." : "Erreur ajout.");
                setMessage(isStaticEdit ? "Réunion statique remplacée par une réunion modifiable." : isEdit ? "Réunion modifiée." : "Réunion ajoutée.");
                setMeetingForm({ title: "", description: "", date: "", startTime: "20:30", endTime: "22:30" });
                setEditingMeetingId(null);
                fetchMeetings();
            })
            .catch((err) => setError(err.message))
            .finally(() => setMeetingSaving(false));
    };

    const handleEditMeeting = (m) => {
        setEditingMeetingId(m.id);
        setMeetingForm({
            title: m.title,
            description: m.description || "",
            date: formatDateForInput(m.startDate),
            startTime: formatTimeForInput(m.startDate),
            endTime: formatTimeForInput(m.endDate),
        });
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                meetingFormSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        });
    };

    const handleDeleteMeeting = (id, isStatic) => {
        if (!API_BASE || !window.confirm("Supprimer cette réunion ?")) return;
        setError("");
        if (isStatic) {
            fetch(`${API_BASE}/api/meetings/hidden-static`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...headers },
                body: JSON.stringify({ id }),
            })
                .then((r) => {
                    if (r.status === 401) throw new Error("Clé admin invalide.");
                    if (!r.ok) throw new Error("Erreur suppression.");
                    setMessage("Réunion statique masquée.");
                    fetchMeetings();
                })
                .catch((err) => setError(err.message));
        } else {
            fetch(`${API_BASE}/api/meetings/${id}`, { method: "DELETE", headers })
                .then((r) => {
                    if (r.status === 401) throw new Error("Clé admin invalide.");
                    if (!r.ok) throw new Error("Erreur suppression.");
                    setMessage("Réunion supprimée.");
                    fetchMeetings();
                })
                .catch((err) => setError(err.message));
        }
    };

    const handleUnhideStaticMeeting = (id) => {
        if (!API_BASE) return;
        setError("");
        fetch(`${API_BASE}/api/meetings/hidden-static/${encodeURIComponent(id)}`, { method: "DELETE", headers })
            .then((r) => {
                if (r.status === 401) throw new Error("Clé admin invalide.");
                if (!r.ok) throw new Error("Erreur restauration.");
                setMessage("Réunion statique réaffichée.");
                fetchMeetings();
            })
            .catch((err) => setError(err.message));
    };

    const getCategoryById = (id) => linkCategories.find((c) => c.id === id);
    const updateCategoryLocal = (categoryId, updater) => {
        setLinkCategories((prev) =>
            prev.map((c) => (c.id === categoryId ? updater(c) : c))
        );
    };

    const startEditLink = (categoryId, link) => {
        setEditingLink({ categoryId, linkId: link.id });
        setLinkForm({ name: link.name, url: link.url, description: link.description || "" });
    };
    const startAddLink = (categoryId) => {
        setEditingLink({ categoryId, linkId: null });
        setLinkForm({ name: "", url: "", description: "" });
    };
    const cancelLinkEdit = () => {
        setEditingLink(null);
        setLinkForm({ name: "", url: "", description: "" });
    };

    const saveLinkCategory = (categoryId) => {
        let cat = getCategoryById(categoryId);
        if (!cat || !API_BASE) return;
        if (editingLink?.categoryId === categoryId && linkForm.name.trim()) {
            let links = [...(cat.links || [])];
            if (editingLink.linkId) {
                const idx = links.findIndex((l) => l.id === editingLink.linkId);
                if (idx >= 0) links[idx] = { ...links[idx], name: linkForm.name.trim(), url: linkForm.url.trim(), description: linkForm.description.trim() };
            } else {
                const newLink = { id: crypto.randomUUID?.() ?? `new-${Date.now()}`, name: linkForm.name.trim(), url: linkForm.url.trim(), description: linkForm.description.trim() };
                links = [...links, newLink];
            }
            cat = { ...cat, links };
            setLinkCategories((prev) => prev.map((c) => (c.id === categoryId ? cat : c)));
            setEditingLink(null);
            setLinkForm({ name: "", url: "", description: "" });
        }
        const title = linkCategoryTitles[categoryId] !== undefined ? linkCategoryTitles[categoryId] : cat.title;
        setSavingCategoryId(categoryId);
        const linksPayload = (cat.links || []).map((l) => ({
            id: typeof l.id === "string" && l.id.startsWith("new-") ? null : l.id,
            name: l.name,
            url: l.url,
            description: l.description || "",
        }));
        fetch(`${API_BASE}/api/links/category/${categoryId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", ...headers },
            body: JSON.stringify({ title, links: linksPayload }),
        })
            .then((r) => {
                if (r.status === 401) throw new Error("Clé admin invalide.");
                if (!r.ok) throw new Error("Erreur enregistrement.");
                setMessage("Catégorie enregistrée.");
                setEditingLink(null);
                setLinkForm({ name: "", url: "", description: "" });
                return r.json();
            })
            .then((updated) => {
                setLinkCategories((prev) => prev.map((c) => (c.id === categoryId ? updated : c)));
                setLinkCategoryTitles((t) => ({ ...t, [categoryId]: undefined }));
            })
            .catch((err) => setError(err.message))
            .finally(() => setSavingCategoryId(null));
    };

    const deleteLinkFromCategory = (categoryId, linkId) => {
        const cat = getCategoryById(categoryId);
        if (!cat) return;
        const links = (cat.links || []).filter((l) => l.id !== linkId);
        updateCategoryLocal(categoryId, (c) => ({ ...c, links }));
        if (editingLink?.categoryId === categoryId && editingLink?.linkId === linkId) cancelLinkEdit();
    };

    const reorderLinksInCategory = (categoryId, fromIndex, toIndex) => {
        const cat = getCategoryById(categoryId);
        if (!cat || fromIndex === toIndex) return;
        const links = [...(cat.links || [])];
        const [removed] = links.splice(fromIndex, 1);
        links.splice(toIndex, 0, removed);
        updateCategoryLocal(categoryId, (c) => ({ ...c, links }));
    };

    const handleUnhideStatic = (id) => {
        if (!API_BASE) return;
        setError("");
        fetch(`${API_BASE}/api/gallery/hidden-static/${encodeURIComponent(id)}`, { method: "DELETE", headers })
            .then((r) => {
                if (r.status === 401) throw new Error("Clé admin invalide.");
                if (!r.ok) throw new Error("Erreur restauration.");
                setMessage("Image restaurée.");
                fetchGalleryData();
            })
            .catch((err) => setError(err.message || "Erreur restauration"));
    };

    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (dropIndex) => {
        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            return;
        }
        const reordered = [...unifiedImages];
        const [removed] = reordered.splice(draggedIndex, 1);
        reordered.splice(dropIndex, 0, removed);
        setUnifiedImages(reordered);
        setDraggedIndex(null);
        setHasUnsavedChanges(true);
    };

    const hasPendingChanges = hasUnsavedChanges || selectedForDeletion.size > 0 || 
        (unifiedImages.length > 0 && unifiedOrder.length > 0 && 
         unifiedImages.map((i) => i.id).join(",") !== unifiedOrder.join(","));

    return (
        <div className="min-h-screen text-white relative overflow-hidden flex flex-col font-kodchasan">
            <div
                className="fixed inset-0 -z-10"
                style={{
                    background: "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 35%, #0d0d1a 70%, #16213e 100%)",
                }}
            />
            <div
                className="fixed inset-0 -z-10 opacity-30"
                style={{
                    backgroundImage: `radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)`,
                }}
            />

            <div className="flex flex-1 min-h-0">
            <aside className="fixed left-0 top-0 bottom-0 w-56 sm:w-64 z-20 border-r border-white/10 bg-black/40 backdrop-blur-md flex flex-col pt-6 pb-6 px-3">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-cyan-300/90 hover:text-cyan-200 transition mb-6 group px-2"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform flex-shrink-0" />
                    <span className="text-sm font-medium">Retour au site</span>
                </Link>
                <nav className="flex flex-col gap-1 flex-1">
                    {ADMIN_SECTIONS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setActiveSection(id)}
                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                                activeSection === id
                                    ? "bg-indigo-500/30 border border-indigo-400/40 text-white shadow-lg shadow-indigo-500/10"
                                    : "text-gray-400 hover:text-white hover:bg-white/10 border border-transparent"
                            }`}
                        >
                            <Icon size={20} className="flex-shrink-0" />
                            <span className="font-medium truncate">{label}</span>
                        </button>
                    ))}
                </nav>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-auto flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left text-red-300 hover:text-red-200 hover:bg-red-500/20 border border-transparent transition-all"
                >
                    <LogOut size={20} className="flex-shrink-0" />
                    <span className="font-medium">Déconnexion</span>
                </button>
            </aside>

            <main ref={mainContentRef} className="flex-1 min-w-0 overflow-auto ml-56 sm:ml-64 px-4 sm:px-6 py-10 sm:py-14 min-h-screen">
                <div className="w-full max-w-4xl mx-auto">
                {activeSection === "galerie" && (
                    <>
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30">
                            <Sparkles className="w-7 h-7 text-indigo-300" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Administration Galerie
                        </h1>
                    </div>
                    <p className="text-gray-400 text-sm sm:text-base">
                        Ajoutez ou supprimez des images. Elles s’affichent sur la page Galerie du site.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-400/30 backdrop-blur-sm">
                        <p className="text-red-200 text-sm">{error}</p>
                    </div>
                )}
                {message && (
                    <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 backdrop-blur-sm">
                        <p className="text-emerald-200 text-sm">{message}</p>
                    </div>
                )}

                <section className="mb-12 p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
                    <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-white">
                        <span className="p-1.5 rounded-lg bg-indigo-500/30">
                            <ImagePlus size={20} className="text-indigo-200" />
                        </span>
                        Ajouter une image
                    </h2>
                    <form onSubmit={handleUpload} className="space-y-5">
                        <div className="flex flex-col sm:flex-row gap-5 sm:items-end">
                            <div className="flex-1 min-w-0">
                                <label className="block text-sm font-medium text-gray-400 mb-2">Fichier (jpg, png, gif, webp, svg)</label>
                                <input
                                    id="file-input"
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    className="block w-full text-sm text-gray-300 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-indigo-600 file:to-purple-600 file:text-white file:font-medium file:cursor-pointer hover:file:opacity-90 transition"
                                />
                            </div>
                            <div className="w-full sm:w-56">
                                <label className="block text-sm font-medium text-gray-400 mb-2">Titre (optionnel)</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ex. Photo soirée 2025"
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 transition"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!file || uploading}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
                            >
                                <Upload size={20} />
                                {uploading ? "Envoi en cours…" : "Envoyer"}
                            </button>
                        </div>
                    </form>
                </section>

                <section className="mb-12">
                    <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-white">
                        <span className="p-1.5 rounded-lg bg-white/10">📷</span>
                        Images gérées par l’API (uploadées)
                    </h2>
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="w-10 h-10 border-2 border-indigo-400/50 border-t-indigo-300 rounded-full animate-spin" />
                        </div>
                    ) : unifiedImages.length === 0 ? (
                        <div className="py-12 px-6 rounded-2xl bg-white/5 border border-white/10 border-dashed text-center">
                            <p className="text-gray-400">Aucune image uploadée. Les images du dossier ci-dessous s’affichent sur la galerie si l’API est vide.</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                                <p className="text-gray-400 text-sm">
                                    💡 <strong>Glissez-déposez</strong> les images pour changer leur ordre, puis cliquez sur « Enregistrer » pour appliquer sur le site.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleSaveAll}
                                    disabled={!hasPendingChanges || reordering}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all shrink-0 ${
                                        hasPendingChanges
                                            ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                            : "bg-white/10 text-gray-500 cursor-not-allowed border border-white/10"
                                    } disabled:opacity-70 disabled:cursor-not-allowed`}
                                >
                                    <Save size={18} />
                                    {reordering ? "Enregistrement…" : "Enregistrer"}
                                </button>
                            </div>
                            {hasPendingChanges && (
                                <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-sm">
                                    Modifications non enregistrées — cliquez sur « Enregistrer » pour les appliquer.
                                </div>
                            )}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                                {unifiedImages.filter((img) => img != null).map((img, index) => {
                                    const isSelected = selectedForDeletion.has(img.id);
                                    const imgUrl = (img.isStatic ? img.url : (img.url?.startsWith("http") ? img.url : (img.url ? `${API_BASE}${img.url}` : `${API_BASE}/api/gallery/${img.id}/file`))) || "";
                                    return (
                                    <div
                                        key={img.id}
                                        draggable={!reordering}
                                        onDragStart={() => handleDragStart(index)}
                                        onDragOver={handleDragOver}
                                        onDrop={() => handleDrop(index)}
                                        className={`rounded-2xl overflow-hidden border backdrop-blur-sm group transition-all duration-300 ${
                                            isSelected
                                                ? "bg-red-500/20 border-red-500/60 ring-2 ring-red-500/50"
                                                : "bg-white/5 border-white/10 hover:border-white/20"
                                        } hover:shadow-xl ${draggedIndex === index ? "opacity-50 scale-95 border-indigo-400/50" : ""} ${!reordering ? "cursor-move" : ""}`}
                                    >
                                        <div className="aspect-square relative">
                                            <img src={imgUrl} alt={img.title} loading="lazy" decoding="async" className={`w-full h-full object-cover pointer-events-none ${isSelected ? "opacity-50" : ""}`} />
                                            {img.isStatic && !isSelected && (
                                                <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-cyan-500/80 text-xs font-medium text-white">Dossier</div>
                                            )}
                                            {isSelected ? (
                                                <>
                                                    <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center" />
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                                        <X size={48} className="text-red-300 drop-shadow-lg" strokeWidth={3} />
                                                        <span className="text-red-200 text-sm font-medium">Marquée</span>
                                                        <button type="button" onClick={() => toggleSelectedForDeletion(img.id)} className="mt-1 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-medium">Annuler</button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <button type="button" onClick={() => toggleSelectedForDeletion(img.id)} className="absolute top-2 right-2 p-2.5 rounded-xl bg-red-500/90 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110" title="Marquer pour suppression">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                        <p className={`p-3 text-sm truncate bg-white/5 ${isSelected ? "text-red-200" : "text-gray-300"}`}>{img.title}</p>
                                    </div>
                                );})}
                            </div>
                        </>
                    )}
                </section>

                {hiddenStaticImages.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-white">
                            <span className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-400/30">
                                <RotateCcw size={20} className="text-amber-200" />
                            </span>
                            Images masquées ({hiddenStaticImages.length})
                        </h2>
                        <p className="text-gray-400 text-sm mb-4">
                            Ces images ne s’affichent plus sur la galerie du site. Cliquez sur « Restaurer » pour les réafficher.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                            {hiddenStaticImages.filter((img) => img != null && img.url != null).map((img) => (
                                <div
                                    key={img.id}
                                    className={`rounded-2xl overflow-hidden bg-white/5 border border-amber-400/20 backdrop-blur-sm group transition-all duration-300 hover:border-amber-400/40 ${false ? "opacity-50 scale-95" : ""}`}
                                >
                                    <div className="aspect-square relative">
                                        <img
                                            src={img.url || ""}
                                            alt={img.title}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover opacity-80"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <button
                                            type="button"
                                            onClick={() => handleUnhideStatic(img.id)}
                                            disabled={false}
                                            className="absolute top-2 right-2 p-2.5 rounded-xl bg-emerald-500/90 hover:bg-emerald-500 text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110 disabled:opacity-50"
                                            title="Réafficher sur la galerie"
                                        >
                                            <RotateCcw size={18} />
                                        </button>
                                    </div>
                                    <p className="p-3 text-sm truncate text-gray-400 bg-white/5">{img.title}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                    </>
                )}

                {activeSection === "reunions" && (
                    <div className="space-y-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30">
                                <Calendar className="w-7 h-7 text-indigo-300" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                Administration Réunions
                            </h1>
                        </div>

                        <section ref={meetingFormSectionRef} className="p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                                <span className="p-1.5 rounded-lg bg-indigo-500/30">
                                    {editingMeetingId ? <Pencil size={20} /> : <Plus size={20} />}
                                </span>
                                {editingMeetingId ? "Modifier la réunion" : "Ajouter une réunion"}
                            </h2>
                            <form onSubmit={handleSaveMeeting} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Titre *</label>
                                    <input
                                        type="text"
                                        value={meetingForm.title}
                                        onChange={(e) => setMeetingForm((f) => ({ ...f, title: e.target.value }))}
                                        placeholder="Ex. Assemblée Générale"
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Date</label>
                                        <input
                                            type="date"
                                            value={meetingForm.date}
                                            onChange={(e) => setMeetingForm((f) => ({ ...f, date: e.target.value }))}
                                            className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Heure début</label>
                                        <input
                                            type="time"
                                            value={meetingForm.startTime}
                                            onChange={(e) => setMeetingForm((f) => ({ ...f, startTime: e.target.value }))}
                                            className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Heure fin</label>
                                        <input
                                            type="time"
                                            value={meetingForm.endTime}
                                            onChange={(e) => setMeetingForm((f) => ({ ...f, endTime: e.target.value }))}
                                            className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                                    <textarea
                                        value={meetingForm.description}
                                        onChange={(e) => setMeetingForm((f) => ({ ...f, description: e.target.value }))}
                                        placeholder="Compte rendu ou résumé de la réunion..."
                                        rows={4}
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 resize-none"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={meetingSaving}
                                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 transition flex items-center gap-2 font-medium"
                                    >
                                        {meetingSaving ? "Enregistrement…" : editingMeetingId ? "Modifier" : "Ajouter"}
                                    </button>
                                    {editingMeetingId && (
                                        <button
                                            type="button"
                                            onClick={() => { setEditingMeetingId(null); setMeetingForm({ title: "", description: "", date: "", startTime: "20:30", endTime: "22:30" }); }}
                                            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
                                        >
                                            Annuler
                                        </button>
                                    )}
                                </div>
                            </form>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">📅 Réunions enregistrées</h2>
                            {meetingsLoading ? (
                                <div className="flex justify-center py-16">
                                    <div className="w-10 h-10 border-2 border-indigo-400/50 border-t-indigo-300 rounded-full animate-spin" />
                                </div>
                            ) : unifiedMeetings.length === 0 ? (
                                <div className="py-12 px-6 rounded-2xl bg-white/5 border border-white/10 border-dashed text-center">
                                    <p className="text-gray-400">Aucune réunion. Ajoutez-en une avec le formulaire ci-dessus.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {unifiedMeetings.map((m) => {
                                        const start = m.startDate;
                                        const end = m.endDate;
                                        return (
                                            <div
                                                key={m.id}
                                                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition flex flex-col sm:flex-row sm:items-center gap-4"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="font-bold text-white truncate">{m.title}</h3>
                                                        {m.isStatic && (
                                                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-200 border border-amber-400/40">
                                                                En dur
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-400 mt-1">
                                                        {start.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric" })} — {start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} - {end.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                                    </p>
                                                    {m.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{m.description}</p>}
                                                </div>
                                                <div className="flex gap-2 shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditMeeting(m)}
                                                        className="p-2.5 rounded-xl bg-indigo-500/30 hover:bg-indigo-500/50 text-indigo-200 transition"
                                                        title="Modifier"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteMeeting(m.id, m.isStatic)}
                                                        className="p-2.5 rounded-xl bg-red-500/30 hover:bg-red-500/50 text-red-200 transition"
                                                        title={m.isStatic ? "Masquer (en dur)" : "Supprimer"}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            {hiddenStaticMeetingIds.length > 0 && (
                                <div className="mt-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-400/20">
                                    <h3 className="text-lg font-bold text-amber-200 mb-3">Réunions statiques masquées ({hiddenStaticMeetingIds.length})</h3>
                                    <p className="text-sm text-gray-400 mb-3">Ces réunions « en dur » ont été masquées. Vous pouvez les réafficher sur le site.</p>
                                    <div className="space-y-2">
                                        {staticMeetingsFromApi
                                            .filter((m) => hiddenStaticMeetingIds.includes(m.id))
                                            .map((m) => (
                                                <div key={m.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                                                    <span className="font-medium text-white truncate">{m.title}</span>
                                                    <span className="text-sm text-gray-400 shrink-0">
                                                        {new Date(m.startDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUnhideStaticMeeting(m.id)}
                                                        className="p-2 rounded-lg bg-emerald-500/30 hover:bg-emerald-500/50 text-emerald-200 transition shrink-0"
                                                        title="Réafficher sur le site"
                                                    >
                                                        <RotateCcw size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                            <Link to="/reunions" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-6 text-cyan-300/90 hover:text-cyan-200 transition text-sm">
                                Voir la page Réunions →
                            </Link>
                        </section>
                    </div>
                )}

                {activeSection === "liens-utiles" && (
                    <div className="space-y-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30">
                                <Link2 className="w-7 h-7 text-indigo-300" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                Administration Liens utiles
                            </h1>
                        </div>
                        {error && (
                            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-400/30">
                                <p className="text-red-200 text-sm">{error}</p>
                            </div>
                        )}
                        {message && (
                            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/30">
                                <p className="text-emerald-200 text-sm">{message}</p>
                            </div>
                        )}
                        {linksLoading ? (
                            <div className="flex justify-center py-16">
                                <div className="w-10 h-10 border-2 border-indigo-400/50 border-t-indigo-300 rounded-full animate-spin" />
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {linkCategories.map((category) => {
                                    const isEditingThis = editingLink?.categoryId === category.id;
                                    const categoryTitle = linkCategoryTitles[category.id] !== undefined ? linkCategoryTitles[category.id] : category.title;
                                    return (
                                        <div
                                            key={category.id}
                                            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
                                        >
                                            <div className="p-6 border-b border-white/10">
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="text"
                                                        value={categoryTitle}
                                                        onChange={(e) => setLinkCategoryTitles((t) => ({ ...t, [category.id]: e.target.value }))}
                                                        className="flex-1 bg-transparent text-2xl font-bold text-white placeholder-gray-500 focus:outline-none focus:ring-0 border-none"
                                                        placeholder="Titre de la catégorie"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-6 space-y-4">
                                                <div className="space-y-2">
                                                    {(category.links || []).map((link, index) => {
                                                        const isDragging = draggedLink?.categoryId === category.id && draggedLink?.index === index;
                                                        return (
                                                        <div
                                                            key={link.id}
                                                            draggable
                                                            onDragStart={() => setDraggedLink({ categoryId: category.id, index })}
                                                            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("opacity-50"); }}
                                                            onDragLeave={(e) => e.currentTarget.classList.remove("opacity-50")}
                                                            onDrop={(e) => {
                                                                e.preventDefault();
                                                                e.currentTarget.classList.remove("opacity-50");
                                                                if (draggedLink?.categoryId === category.id && draggedLink.index !== index) {
                                                                    reorderLinksInCategory(category.id, draggedLink.index, index);
                                                                    setDraggedLink(null);
                                                                }
                                                            }}
                                                            onDragEnd={() => setDraggedLink(null)}
                                                            className={`group flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition ${isDragging ? "opacity-50" : ""}`}
                                                        >
                                                            <span className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300" title="Glisser pour réordonner">
                                                                <GripVertical size={18} />
                                                            </span>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-semibold text-white truncate">{link.name}</p>
                                                                <p className="text-sm text-gray-400 truncate">{link.url}</p>
                                                                {link.description && <p className="text-sm text-gray-500 truncate mt-0.5">{link.description}</p>}
                                                            </div>
                                                            <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => startEditLink(category.id, link)}
                                                                    className="p-2 rounded-lg bg-indigo-500/30 hover:bg-indigo-500/50 text-indigo-200"
                                                                    title="Modifier"
                                                                >
                                                                    <Pencil size={16} />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => window.confirm("Supprimer ce lien ?") && deleteLinkFromCategory(category.id, link.id)}
                                                                    className="p-2 rounded-lg bg-red-500/30 hover:bg-red-500/50 text-red-200"
                                                                    title="Supprimer"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                    })}
                                                </div>
                                                {isEditingThis && (
                                                    <div className="mt-4 p-4 rounded-xl bg-indigo-500/10 border border-indigo-400/20 space-y-3">
                                                        <h3 className="text-sm font-semibold text-indigo-200">
                                                            {editingLink.linkId ? "Modifier le lien" : "Nouveau lien"}
                                                        </h3>
                                                        <input
                                                            type="text"
                                                            value={linkForm.name}
                                                            onChange={(e) => setLinkForm((f) => ({ ...f, name: e.target.value }))}
                                                            placeholder="Titre du lien"
                                                            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                                                        />
                                                        <input
                                                            type="url"
                                                            value={linkForm.url}
                                                            onChange={(e) => setLinkForm((f) => ({ ...f, url: e.target.value }))}
                                                            placeholder="https://..."
                                                            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={linkForm.description}
                                                            onChange={(e) => setLinkForm((f) => ({ ...f, description: e.target.value }))}
                                                            placeholder="Description (optionnel)"
                                                            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                                                        />
                                                    </div>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => startAddLink(category.id)}
                                                    className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-gray-300 text-sm transition"
                                                >
                                                    <Plus size={18} />
                                                    Ajouter un lien
                                                </button>
                                            </div>
                                            <div className="p-4 bg-white/5 border-t border-white/10 flex gap-3 justify-end">
                                                {isEditingThis && (
                                                    <button
                                                        type="button"
                                                        onClick={cancelLinkEdit}
                                                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
                                                    >
                                                        Annuler
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => saveLinkCategory(category.id)}
                                                    disabled={savingCategoryId === category.id}
                                                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition flex items-center gap-2"
                                                >
                                                    {savingCategoryId === category.id ? (
                                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    ) : (
                                                        <Save size={18} />
                                                    )}
                                                    Enregistrer
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                                {linkCategories.length === 0 && (
                                    <div className="py-12 rounded-2xl bg-white/5 border border-white/10 border-dashed text-center text-gray-400">
                                        Aucune catégorie. Redémarrez l’API pour charger les liens par défaut.
                                    </div>
                                )}
                            </div>
                        )}
                        <Link to="/liens-utiles" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-cyan-300/90 hover:text-cyan-200 transition text-sm">
                            Voir la page Liens utiles →
                        </Link>
                    </div>
                )}

                {activeSection === "contact" && (
                    <div className="space-y-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30">
                                <Mail className="w-7 h-7 text-indigo-300" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                Administration Contact
                            </h1>
                        </div>
                        {error && (
                            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-400/30">
                                <p className="text-red-200 text-sm">{error}</p>
                            </div>
                        )}
                        {message && (
                            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/30">
                                <p className="text-emerald-200 text-sm">{message}</p>
                            </div>
                        )}
                        {contactLoading ? (
                            <div className="flex justify-center py-16">
                                <div className="w-10 h-10 border-2 border-indigo-400/50 border-t-indigo-300 rounded-full animate-spin" />
                            </div>
                        ) : (
                            <form onSubmit={saveContact} className="p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Email (affiché sur la page et destinataire du formulaire)</label>
                                    <input
                                        type="email"
                                        value={contactForm.email}
                                        onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                                        placeholder="contact@exemple.fr"
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Téléphone</label>
                                    <input
                                        type="text"
                                        value={contactForm.phone}
                                        onChange={(e) => setContactForm((f) => ({ ...f, phone: e.target.value }))}
                                        placeholder="06 00 00 00 00"
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Adresse (ligne 1)</label>
                                    <input
                                        type="text"
                                        value={contactForm.addressLine1}
                                        onChange={(e) => setContactForm((f) => ({ ...f, addressLine1: e.target.value }))}
                                        placeholder="Club Astro Véga de la Lyre"
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Adresse (ligne 2)</label>
                                    <input
                                        type="text"
                                        value={contactForm.addressLine2}
                                        onChange={(e) => setContactForm((f) => ({ ...f, addressLine2: e.target.value }))}
                                        placeholder="17150 BOISREDON, France"
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={contactSaving}
                                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition flex items-center gap-2 font-medium"
                                >
                                    {contactSaving ? "Enregistrement…" : "Enregistrer"}
                                </button>
                                <Link to="/contact" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-6 text-cyan-300/90 hover:text-cyan-200 transition text-sm block">
                                    Voir la page Contact →
                                </Link>
                            </form>
                        )}
                    </div>
                )}

                {activeSection !== "galerie" && activeSection !== "reunions" && activeSection !== "liens-utiles" && activeSection !== "contact" && (() => {
                    const section = ADMIN_SECTIONS.find((s) => s.id === activeSection);
                    if (!section) return null;
                    const Icon = section.icon;
                    return (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 rounded-xl bg-white/10 border border-white/20">
                                    <Icon className="w-7 h-7 text-gray-300" />
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                    Administration — {section.label}
                                </h1>
                            </div>
                            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 border-dashed text-center">
                                <p className="text-gray-400 mb-6">
                                    La gestion de cette section est à venir. En attendant, vous pouvez consulter la page sur le site.
                                </p>
                                <Link
                                    to={section.path}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500/30 hover:bg-indigo-500/50 border border-indigo-400/40 text-white transition"
                                >
                                    Voir la page {section.label}
                                </Link>
                            </div>
                        </div>
                    );
                })()}
                </div>
            </main>
            </div>
        </div>
    );
}

export default Admin;
