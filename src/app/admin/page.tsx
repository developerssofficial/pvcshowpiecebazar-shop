"use client";

import { useState, useEffect, useRef } from "react";

interface Service {
  _id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  createdAt: string;
}

export default function AdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Showpiece",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data);
    } catch {
      setMessage("সেবা লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description) {
      setMessage("নাম এবং বিবরণ দিন");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      let imageUrl = "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.error) throw new Error(uploadData.error);
        imageUrl = uploadData.url;
      } else {
        setMessage("ছবি নির্বাচন করুন");
        setUploading(false);
        return;
      }

      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          image: imageUrl,
          category: form.category,
        }),
      });

      if (!res.ok) throw new Error("সেবা যোগ করতে সমস্যা");

      setMessage("সেবা সফলভাবে যোগ হয়েছে!");
      setForm({ name: "", description: "", category: "Showpiece" });
      setImagePreview("");
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchServices();
    } catch (err) {
      setMessage(`সমস্যা: ${err instanceof Error ? err.message : "অজ্ঞাত ত্রুটি"}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত এই সেবা মুছে ফেলতে চান?")) return;

    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("মুছতে সমস্যা");
      setMessage("সেবা মুছে ফেলা হয়েছে");
      fetchServices();
    } catch {
      setMessage("মুছতে সমস্যা হয়েছে");
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      setMessage(data.message);
      fetchServices();
    } catch {
      setMessage("সিড করতে সমস্যা হয়েছে");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        fontFamily: "'Segoe UI', Tahoma, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "linear-gradient(135deg, #1c3528, #2d5a3d)",
          color: "white",
          padding: "20px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Admin Panel</h1>
          <p style={{ fontSize: 13, opacity: 0.8 }}>PVC Showpiece Bazar</p>
        </div>
        <a
          href="/"
          style={{
            background: "rgba(255,255,255,0.15)",
            color: "white",
            padding: "10px 20px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          সাইট দেখুন
        </a>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "30px 20px" }}>
        {message && (
          <div
            style={{
              background: message.includes("সমস্যা") || message.includes("ত্রুটি") ? "#fef2f2" : "#f0fdf4",
              color: message.includes("সমস্যা") || message.includes("ত্রুটি") ? "#b91c1c" : "#15803d",
              padding: "12px 20px",
              borderRadius: 10,
              marginBottom: 20,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 30,
          }}
        >
          {/* Add Service Form */}
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: 30,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1c3528", marginBottom: 20 }}>
              নতুন সেবা যোগ করুন
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  সেবার নাম *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="যেমন: Custom PVC Showpiece"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "2px solid #e5e7eb",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  বিবরণ *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="সেবা সম্পর্কে লিখুন..."
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "2px solid #e5e7eb",
                    fontSize: 14,
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  ক্যাটাগরি
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "2px solid #e5e7eb",
                    fontSize: 14,
                    outline: "none",
                    background: "white",
                    boxSizing: "border-box",
                  }}
                >
                  <option>Showpiece</option>
                  <option>Decor</option>
                  <option>Art</option>
                  <option>Gift</option>
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  ছবি *
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "2px solid #e5e7eb",
                    fontSize: 14,
                    boxSizing: "border-box",
                  }}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 8,
                      marginTop: 10,
                      border: "2px solid #e5e7eb",
                    }}
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={uploading}
                style={{
                  width: "100%",
                  background: uploading ? "#94a3b8" : "#1c3528",
                  color: "white",
                  border: "none",
                  padding: "12px",
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: uploading ? "not-allowed" : "pointer",
                }}
              >
                {uploading ? "আপলোড হচ্ছে..." : "সেবা যোগ করুন"}
              </button>
            </form>
          </div>

          {/* Services List */}
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: 30,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              maxHeight: "70vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1c3528" }}>
                সেবাসমূহ ({services.length})
              </h2>
              <button
                onClick={handleSeed}
                disabled={seeding}
                style={{
                  background: "#c9a96e",
                  color: "#1c3528",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: seeding ? "not-allowed" : "pointer",
                }}
              >
                {seeding ? "লোড হচ্ছে..." : "ডিফল্ট ডেটা যোগ করুন"}
              </button>
            </div>

            {loading ? (
              <p style={{ color: "#64748b", textAlign: "center", padding: 40 }}>
                লোড হচ্ছে...
              </p>
            ) : services.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <p style={{ color: "#64748b", marginBottom: 15 }}>কোনো সেবা নেই</p>
                <p style={{ fontSize: 13, color: "#94a3b8" }}>
                  উপরের ফর্ম দিয়ে নতুন সেবা যোগ করুন অথবা
                  <br />
                  &quot;ডিফল্ট ডেটা যোগ করুন&quot; বাটনে ক্লিক করুন
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {services.map((service) => (
                  <div
                    key={service._id}
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: 12,
                      borderRadius: 10,
                      border: "1px solid #f0f0f0",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={service.image}
                      alt={service.name}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 8,
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1c3528" }}>
                        {service.name}
                      </h3>
                      <p style={{ fontSize: 12, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {service.description}
                      </p>
                      <span
                        style={{
                          fontSize: 11,
                          background: "#f0ebe0",
                          color: "#1c3528",
                          padding: "2px 8px",
                          borderRadius: 8,
                          fontWeight: 600,
                        }}
                      >
                        {service.category}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(service._id)}
                      style={{
                        background: "#fef2f2",
                        color: "#b91c1c",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      মুছুন
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
