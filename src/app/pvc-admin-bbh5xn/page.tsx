"use client";

import { useState, useEffect, useRef } from "react";

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number | null;
  offer?: string | number;
  category: string;
  image: string;
  inStock?: boolean;
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  // Services & Filter
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [seeding, setSeeding] = useState(false);

  // Form state
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [offer, setOffer] = useState("");
  const [category, setCategory] = useState("Couple Showpiece");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [inStock, setInStock] = useState(true);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Messages
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      if (res.ok) {
        const data = await res.json();
        setServices(Array.isArray(data) ? data : data.services || []);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchServices();
    }
  }, [loggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);
    try {
      const res = await fetch("/pvc-admin-bbh5xn/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setLoggedIn(true);
      } else {
        setLoginError(data.error || "ভুল পাসওয়ার্ড");
      }
    } catch {
      setLoginError("সংযোগ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/pvc-admin-bbh5xn/api/logout", { method: "POST" });
    setLoggedIn(false);
    setPassword("");
    setServices([]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    setSubmitting(true);

    try {
      let imageUrl = imagePreview || "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) throw new Error("ছবি আপলোড ব্যর্থ হয়েছে");
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url || uploadData.imageUrl || "";
      }

      if (!imageUrl) {
        throw new Error("অনুগ্রহ করে একটি ছবি নির্বাচন করুন");
      }

      const serviceData = {
        name: serviceName,
        description,
        price: price ? Number(price) : null,
        offer: offer || null,
        category,
        image: imageUrl,
        inStock,
      };

      if (editingId) {
        const res = await fetch(`/api/services?id=${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(serviceData),
        });
        if (!res.ok) throw new Error("প্রোডাক্ট আপডেট করতে সমস্যা হয়েছে");
        setSuccessMsg("প্রোডাক্ট সফলভাবে আপডেট হয়েছে! ✨");
        setEditingId(null);
      } else {
        const res = await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(serviceData),
        });
        if (!res.ok) throw new Error("প্রোডাক্ট যোগ করতে সমস্যা হয়েছে");
        setSuccessMsg("নতুন প্রোডাক্ট সফলভাবে যুক্ত হয়েছে! 🎉");
      }

      resetForm();
      fetchServices();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "কিছু ভুল হয়েছে";
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setServiceName("");
    setDescription("");
    setPrice("");
    setOffer("");
    setCategory("Couple Showpiece");
    setInStock(true);
    setImageFile(null);
    setImagePreview("");
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEdit = (service: Service) => {
    setEditingId(service._id);
    setServiceName(service.name);
    setDescription(service.description);
    setPrice(service.price != null ? String(service.price) : "");
    setOffer(service.offer ? String(service.offer) : "");
    setCategory(service.category);
    setInStock(service.inStock !== false);
    setImageFile(null);
    setImagePreview(service.image || "");
    if (fileInputRef.current) fileInputRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSeed = async () => {
    if (!confirm("আপনি কি ডিফল্ট ডেমো প্রোডাক্টগুলো ডেটাবেজে যুক্ত করতে চান?")) return;
    setSeeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      if (!res.ok) throw new Error("Seed failed");
      setSuccessMsg("ডিফল্ট ডেটা সফলভাবে যোগ হয়েছে!");
      fetchServices();
    } catch {
      setErrorMsg("ডিফল্ট ডেটা যোগ করা ব্যর্থ হয়েছে।");
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত এই প্রোডাক্টটি স্থায়ীভাবে মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch(`/api/services?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setSuccessMsg("প্রোডাক্ট সফলভাবে মুছে ফেলা হয়েছে। 🗑️");
      fetchServices();
    } catch {
      setErrorMsg("প্রোডাক্ট মুছে ফেলা সম্ভব হয়নি।");
    }
  };

  const toggleStockStatus = async (service: Service) => {
    try {
      const newStatus = !service.inStock;
      const res = await fetch(`/api/services?id=${service._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inStock: newStatus }),
      });
      if (res.ok) {
        setServices((prev) =>
          prev.map((s) => (s._id === service._id ? { ...s, inStock: newStatus } : s))
        );
        setSuccessMsg(`স্টক স্ট্যাটাস আপডেট হয়েছে: ${newStatus ? "স্টকে আছে" : "স্টক আউট"}`);
      }
    } catch {
      setErrorMsg("স্ট্যাটাস আপডেট করা যায়নি।");
    }
  };

  useEffect(() => {
    if (successMsg || errorMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg("");
        setErrorMsg("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, errorMsg]);

  // Login Gate
  if (!loggedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at top center, #1b3d2b 0%, #0e1f16 100%)",
          padding: 20,
          fontFamily: "'Hind Siliguri', 'Outfit', sans-serif",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(16px)",
            padding: "44px 36px",
            borderRadius: 20,
            boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
            width: "100%",
            maxWidth: 420,
            textAlign: "center",
            border: "1px solid rgba(212,175,55,0.3)",
          }}
        >
          <img
            src="/logo.png"
            alt="Logo"
            style={{ width: 64, height: 64, borderRadius: "50%", border: "2px solid #d4af37", marginBottom: 16, boxShadow: "0 4px 15px rgba(212,175,55,0.3)" }}
          />
          <h1 style={{ color: "#0e1f16", fontSize: 22, fontWeight: 800, marginBottom: 4, fontFamily: "'Outfit', sans-serif" }}>
            PVC Showpiece <span style={{ color: "#aa8214" }}>Admin</span>
          </h1>
          <p style={{ color: "#64748b", fontSize: 13, marginBottom: 28, fontWeight: 600 }}>
            পণ্য ব্যবস্থাপনা কন্ট্রোল প্যানেল
          </p>

          {loginError && (
            <div
              style={{
                background: "#fef2f2",
                color: "#dc2626",
                padding: "12px",
                borderRadius: 10,
                marginBottom: 20,
                fontSize: 13,
                fontWeight: 600,
                border: "1px solid #fecaca",
              }}
            >
              ⚠️ {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input
              type="password"
              placeholder="অ্যাডমিন সিক্রেট পাসওয়ার্ড দিন"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "1.5px solid #d1d5db",
                borderRadius: 12,
                fontSize: 15,
                outline: "none",
                background: "#f9fafb",
              }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                background: "linear-gradient(135deg, #1b3d2b 0%, #0e1f16 100%)",
                color: "#f5d77f",
                padding: "14px",
                border: "1px solid #d4af37",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(14,31,22,0.3)",
              }}
            >
              {loading ? "যাচাই করা হচ্ছে..." : "লগইন করুন →"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalProducts = services.length;
  const inStockCount = services.filter((s) => s.inStock !== false).length;
  const outOfStockCount = totalProducts - inStockCount;
  const categoriesList = Array.from(new Set(services.map((s) => s.category).filter(Boolean)));

  const filteredList = services.filter((s) => {
    const matchesCategory = filterCategory === "All" || s.category === filterCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", fontFamily: "'Hind Siliguri', 'Outfit', sans-serif" }}>
      {/* Admin Navbar */}
      <header style={{ background: "#0e1f16", borderBottom: "1px solid rgba(212,175,55,0.25)", position: "sticky", top: 0, zIndex: 90 }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img src="/logo.png" alt="Logo" style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid #d4af37" }} />
            <div>
              <span style={{ color: "white", fontSize: 18, fontWeight: 800 }}>
                PVC Showpiece <span style={{ color: "#d4af37" }}>Control Hub</span>
              </span>
              <p style={{ color: "#a7f3d0", fontSize: 11, fontWeight: 600 }}>পণ্য নিয়ন্ত্রণ ও অ্যাডমিন প্যানেল</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "#e2e8f0",
                padding: "8px 16px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              🌐 লাইভ শপ দেখুন
            </a>

            <button
              onClick={handleLogout}
              style={{
                background: "#dc2626",
                color: "white",
                padding: "8px 16px",
                border: "none",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              লগআউট
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: 1300, margin: "0 auto", padding: "30px 24px 80px" }}>
        {/* Toast Alerts */}
        {successMsg && (
          <div
            style={{
              background: "#ecfdf5",
              color: "#065f46",
              padding: "14px 20px",
              borderRadius: 12,
              marginBottom: 24,
              border: "1px solid #a7f3d0",
              fontWeight: 700,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 4px 15px rgba(6,95,70,0.1)",
            }}
          >
            <span>✅</span> {successMsg}
          </div>
        )}
        {errorMsg && (
          <div
            style={{
              background: "#fef2f2",
              color: "#991b1b",
              padding: "14px 20px",
              borderRadius: 12,
              marginBottom: 24,
              border: "1px solid #fecaca",
              fontWeight: 700,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>⚠️</span> {errorMsg}
          </div>
        )}

        {/* Top Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18, marginBottom: 30 }}>
          <div style={{ background: "white", padding: "20px", borderRadius: 16, border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>মোট প্রোডাক্ট</span>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#0e1f16", marginTop: 4 }}>{totalProducts} টি</div>
          </div>
          <div style={{ background: "white", padding: "20px", borderRadius: 16, border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <span style={{ fontSize: 13, color: "#16a34a", fontWeight: 600 }}>স্টকে বিদ্যমান</span>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#16a34a", marginTop: 4 }}>{inStockCount} টি</div>
          </div>
          <div style={{ background: "white", padding: "20px", borderRadius: 16, border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <span style={{ fontSize: 13, color: "#dc2626", fontWeight: 600 }}>স্টক আউট</span>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#dc2626", marginTop: 4 }}>{outOfStockCount} টি</div>
          </div>
          <div style={{ background: "white", padding: "20px", borderRadius: 16, border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <span style={{ fontSize: 13, color: "#aa8214", fontWeight: 600 }}>ক্যাটাগরি সংখ্যা</span>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#aa8214", marginTop: 4 }}>{categoriesList.length} টি</div>
          </div>
        </div>

        {/* Two Column Layout: Product Form (Left) & Product List (Right) */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.9fr", gap: 30, alignItems: "start" }} className="admin-grid">
          {/* Left Form: Add / Edit Product */}
          <div style={{ background: "white", borderRadius: 20, padding: "28px 24px", border: "1px solid #e5e7eb", boxShadow: "0 6px 20px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #f1f5f9" }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0e1f16" }}>
                {editingId ? "✏️ প্রোডাক্ট সম্পাদনা করুন" : "➕ নতুন প্রোডাক্ট যোগ করুন"}
              </h2>
              {editingId && (
                <button
                  onClick={resetForm}
                  style={{ background: "#f1f5f9", border: "none", color: "#64748b", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                >
                  বাতিল করুন
                </button>
              )}
            </div>

            <form onSubmit={handleAddService} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                  প্রোডাক্টের নাম *
                </label>
                <input
                  type="text"
                  placeholder="যেমন: কাস্টম কাপল শোপিস"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  required
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 14, outline: "none" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                    ক্যাটাগরি
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 14, outline: "none", background: "white" }}
                  >
                    <option value="Couple Showpiece">Couple Showpiece</option>
                    <option value="Name Showpiece">Name Showpiece</option>
                    <option value="Family Showpiece">Family Showpiece</option>
                    <option value="Calligraphy">Calligraphy</option>
                    <option value="Wall Decor">Wall Decor</option>
                    <option value="Home Decor">Home Decor</option>
                    <option value="Gift Showpiece">Gift Showpiece</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                    মূল্য (টাকা ৳)
                  </label>
                  <input
                    type="number"
                    placeholder="যেমন: 1200"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 14, outline: "none" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                  ছাড়/অফার % (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: 15 (১৫% ছাড়)"
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 14, outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                  প্রোডাক্ট ছবি *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  style={{ width: "100%", fontSize: 13, color: "#64748b" }}
                />
                {imagePreview && (
                  <div style={{ marginTop: 10, position: "relative", width: 120, height: 120, borderRadius: 10, overflow: "hidden", border: "2px solid #d4af37" }}>
                    <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                  বিস্তারিত বিবরণ
                </label>
                <textarea
                  rows={3}
                  placeholder="প্রোডাক্টের সাইজ, ম্যাটেরিয়াল ও বিবরণ লিখুন..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 14, outline: "none", resize: "vertical" }}
                />
              </div>

              {/* In Stock toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0" }}>
                <input
                  type="checkbox"
                  id="stockToggle"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  style={{ width: 18, height: 18, cursor: "pointer", accentColor: "#16a34a" }}
                />
                <label htmlFor="stockToggle" style={{ fontSize: 14, fontWeight: 700, color: inStock ? "#16a34a" : "#dc2626", cursor: "pointer" }}>
                  {inStock ? "✓ প্রোডাক্টটি স্টকে আছে" : "✗ প্রোডাক্টটি স্টক আউট"}
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: "linear-gradient(135deg, #1b3d2b 0%, #0e1f16 100%)",
                  color: "#f5d77f",
                  padding: "14px",
                  border: "1px solid #d4af37",
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  marginTop: 6,
                }}
              >
                {submitting ? "সংরক্ষণ করা হচ্ছে..." : editingId ? "প্রোডাক্ট আপডেট করুন" : "প্রোডাক্ট যোগ করুন 🚀"}
              </button>
            </form>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "center" }}>
              <button
                onClick={handleSeed}
                disabled={seeding}
                style={{ background: "#f8fafc", border: "1px solid #cbd5e1", color: "#475569", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
              >
                {seeding ? "ডেটা যোগ হচ্ছে..." : "📦 ডিফল্ট ডেমো ডেটা লোড করুন"}
              </button>
            </div>
          </div>

          {/* Right Area: Product Catalog List */}
          <div style={{ background: "white", borderRadius: 20, padding: "28px 24px", border: "1px solid #e5e7eb", boxShadow: "0 6px 20px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0e1f16" }}>
                📋 প্রোডাক্ট তালিকা ({filteredList.length})
              </h2>

              {/* Search input */}
              <input
                type="text"
                placeholder="🔍 প্রোডাক্ট খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, outline: "none", width: 200 }}
              />
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {["All", ...categoriesList].map((c) => (
                <button
                  key={c}
                  onClick={() => setFilterCategory(c)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 20,
                    border: filterCategory === c ? "1px solid #0e1f16" : "1px solid #e2e8f0",
                    background: filterCategory === c ? "#0e1f16" : "#f8fafc",
                    color: filterCategory === c ? "#f5d77f" : "#64748b",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {c === "All" ? "সবগুলো" : c}
                </button>
              ))}
            </div>

            {filteredList.length === 0 ? (
              <div style={{ textAlign: "center", padding: "50px 20px", color: "#94a3b8" }}>
                কোনো প্রোডাক্ট পাওয়া যায়নি।
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {filteredList.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 16px",
                      borderRadius: 14,
                      border: "1px solid #f1f5f9",
                      background: "#fcfcfd",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover", background: "#f1f5f9", border: "1px solid #e2e8f0" }}
                      />
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <h4 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: 0 }}>{item.name}</h4>
                          <span style={{ fontSize: 11, background: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>
                            {item.category}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
                          <span style={{ fontSize: 14, fontWeight: 800, color: "#b91c1c" }}>
                            ৳{item.price || "—"}
                          </span>
                          <button
                            onClick={() => toggleStockStatus(item)}
                            style={{
                              background: "none",
                              border: "none",
                              color: item.inStock !== false ? "#16a34a" : "#dc2626",
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: "pointer",
                              padding: 0,
                            }}
                          >
                            {item.inStock !== false ? "● স্টকে আছে" : "○ স্টক আউট"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <a
                        href={`/products/${item._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569", padding: "6px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}
                      >
                        👁️ দেখুন
                      </a>

                      <button
                        onClick={() => handleEdit(item)}
                        style={{ background: "#d4af37", border: "none", color: "#0e1f16", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                      >
                        ✏️ এডিট
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        style={{ background: "#fee2e2", border: "none", color: "#dc2626", padding: "6px 10px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                      >
                        🗑️ মুছুন
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx global>{`
        @media (max-width: 900px) {
          .admin-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
