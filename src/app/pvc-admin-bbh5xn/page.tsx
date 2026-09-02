"use client";

import { useState, useEffect, useRef } from "react";

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  offer?: string;
  category: string;
  image: string;
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  // Services state
  const [services, setServices] = useState<Service[]>([]);
  const [seeding, setSeeding] = useState(false);

  // Form state
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [offer, setOffer] = useState("");
  const [category, setCategory] = useState("Showpiece");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

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
        setServices(data.services || data || []);
      }
    } catch {
      // silently fail
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

      const serviceData = {
        name: serviceName,
        description,
        price: Number(price),
        offer: offer || null,
        category,
        image: imageUrl,
      };

      if (editingId) {
        // Edit mode - PUT request
        const res = await fetch(`/api/services?id=${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(serviceData),
        });
        if (!res.ok) throw new Error("সেবা আপডেট করা ব্যর্থ হয়েছে");
        setSuccessMsg("সেবা সফলভাবে আপডেট হয়েছে!");
        setEditingId(null);
      } else {
        // Add mode - POST request
        const res = await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(serviceData),
        });
        if (!res.ok) throw new Error("সেবা যোগ করা ব্যর্থ হয়েছে");
        setSuccessMsg("সেবা সফলভাবে যোগ হয়েছে!");
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
    setCategory("Showpiece");
    setImageFile(null);
    setImagePreview("");
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEdit = (service: Service) => {
    setEditingId(service._id);
    setServiceName(service.name);
    setDescription(service.description);
    setPrice(String(service.price));
    setOffer(service.offer || "");
    setCategory(service.category);
    setImageFile(null);
    setImagePreview(service.image || "");
    if (fileInputRef.current) fileInputRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSeed = async () => {
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
    if (!confirm("আপনি কি নিশ্চিত এই সেবাটি মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch(`/api/services?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setSuccessMsg("সেবা মুছে ফেলা হয়েছে।");
      fetchServices();
    } catch {
      setErrorMsg("সেবা মুছে ফেলা ব্যর্থ হয়েছে।");
    }
  };

  // Clear messages after 4 seconds
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
          background: "#1c3528",
          fontFamily: "'Segoe UI', Tahoma, sans-serif",
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{
            background: "white",
            padding: "40px 32px",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            width: "100%",
            maxWidth: "380px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              color: "#1c3528",
              fontSize: "1.5rem",
              marginBottom: "8px",
            }}
          >
            PVC Showpiece Bazar
          </h1>
          <p
            style={{
              color: "#f0ebe0",
              fontSize: "0.95rem",
              marginBottom: "28px",
            }}
          >
            অ্যাডমিন প্যানেল
          </p>

          {loginError && (
            <div
              style={{
                background: "#fee",
                color: "#c00",
                padding: "10px 12px",
                borderRadius: "6px",
                marginBottom: "16px",
                fontSize: "0.9rem",
              }}
            >
              {loginError}
            </div>
          )}

          <input
            type="password"
            placeholder="পাসওয়ার্ড দিন"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 14px",
              border: "2px solid #ddd",
              borderRadius: "8px",
              fontSize: "1rem",
              outline: "none",
              boxSizing: "border-box",
              marginBottom: "16px",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#f0ebe0")}
            onBlur={(e) => (e.target.style.borderColor = "#ddd")}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: "#f0ebe0",
              color: "#1c3528",
              border: "none",
              borderRadius: "8px",
              fontSize: "1.05rem",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {loading ? "যাচাই হচ্ছে..." : "লগইন করুন"}
          </button>
        </form>
      </div>
    );
  }

  // Admin Dashboard
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
          background: "#1c3528",
          color: "white",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.3rem" }}>
          <span style={{ color: "#f0ebe0" }}>Admin Panel</span> - PVC Showpiece
          Bazar
        </h1>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 20px",
            background: "transparent",
            color: "#f0ebe0",
            border: "2px solid #f0ebe0",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: 600,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f0ebe0";
            e.currentTarget.style.color = "#1c3528";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#f0ebe0";
          }}
        >
          লগআউট
        </button>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        {/* Messages */}
        {successMsg && (
          <div
            style={{
              background: "#d4edda",
              color: "#155724",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "16px",
              fontWeight: 600,
            }}
          >
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div
            style={{
              background: "#f8d7da",
              color: "#721c24",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "16px",
              fontWeight: 600,
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Two Column Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "24px",
          }}
        >
          {/* Mobile: stacked, desktop: side by side via media query via inline style workaround */}
          <style>{`
            @media (min-width: 768px) {
              .admin-grid { grid-template-columns: 1fr 1fr !important; }
            }
          `}</style>
          <div
            className="admin-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "24px",
            }}
          >
            {/* Left Column - Add Service Form */}
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <h2
                style={{
                  margin: "0 0 20px 0",
                  color: "#1c3528",
                  fontSize: "1.2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>{editingId ? "সেবা এডিট করুন" : "নতুন সেবা যোগ করুন"}</span>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    style={{
                      padding: "6px 14px",
                      background: "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    বাতিল করুন
                  </button>
                )}
              </h2>

              <form onSubmit={handleAddService}>
                <div style={{ marginBottom: "14px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontWeight: 600,
                      color: "#333",
                      fontSize: "0.9rem",
                    }}
                  >
                    সেবার নাম *
                  </label>
                  <input
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    required
                    placeholder="সেবার নাম লিখুন"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1.5px solid #ddd",
                      borderRadius: "6px",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontWeight: 600,
                      color: "#333",
                      fontSize: "0.9rem",
                    }}
                  >
                    বিবরণ *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="সেবার বিবরণ লিখুন"
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1.5px solid #ddd",
                      borderRadius: "6px",
                      fontSize: "0.95rem",
                      resize: "vertical",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    marginBottom: "14px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "4px",
                        fontWeight: 600,
                        color: "#333",
                        fontSize: "0.9rem",
                      }}
                    >
                      মূল্য (৳) *
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      min="0"
                      placeholder="৳"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1.5px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "0.95rem",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "4px",
                        fontWeight: 600,
                        color: "#333",
                        fontSize: "0.9rem",
                      }}
                    >
                      অফার/ছাড়
                    </label>
                    <input
                      type="text"
                      value={offer}
                      onChange={(e) => setOffer(e.target.value)}
                      placeholder="যেমন: ১০% ছাড়"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1.5px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "0.95rem",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontWeight: 600,
                      color: "#333",
                      fontSize: "0.9rem",
                    }}
                  >
                    ক্যাটাগরি
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1.5px solid #ddd",
                      borderRadius: "6px",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                      background: "white",
                    }}
                  >
                    <option value="Showpiece">Showpiece</option>
                    <option value="Decor">Decor</option>
                    <option value="Art">Art</option>
                    <option value="Gift">Gift</option>
                  </select>
                </div>

                <div style={{ marginBottom: "18px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontWeight: 600,
                      color: "#333",
                      fontSize: "0.9rem",
                    }}
                  >
                    ছবি
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    style={{
                      width: "100%",
                      padding: "8px 0",
                      fontSize: "0.9rem",
                    }}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        marginTop: "10px",
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "2px solid #eee",
                      }}
                    />
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: editingId ? "#2563eb" : "#1c3528",
                    color: "#f0ebe0",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: 700,
                    cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.7 : 1,
                    transition: "opacity 0.2s",
                  }}
                >
                  {submitting
                    ? editingId ? "আপডেট হচ্ছে..." : "যোগ হচ্ছে..."
                    : editingId ? "পরিবর্তন সেভ করুন" : "সেবা যোগ করুন"}
                </button>
              </form>
            </div>

            {/* Right Column - Services List */}
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginBottom: "16px",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    color: "#1c3528",
                    fontSize: "1.2rem",
                  }}
                >
                  সেবাসমূহ ({services.length})
                </h2>
                <button
                  onClick={handleSeed}
                  disabled={seeding}
                  style={{
                    padding: "8px 16px",
                    background: "#f0ebe0",
                    color: "#1c3528",
                    border: "none",
                    borderRadius: "6px",
                    cursor: seeding ? "not-allowed" : "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    opacity: seeding ? 0.7 : 1,
                  }}
                >
                  {seeding ? "যোগ হচ্ছে..." : "ডিফল্ট ডেটা যোগ করুন"}
                </button>
              </div>

              <div
                style={{
                  maxHeight: "600px",
                  overflowY: "auto",
                }}
              >
                {services.length === 0 ? (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#999",
                      padding: "40px 0",
                    }}
                  >
                    কোনো সেবা পাওয়া যায়নি।
                  </p>
                ) : (
                  services.map((service) => (
                    <div
                      key={service._id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px",
                        borderBottom: "1px solid #eee",
                        transition: "background 0.15s",
                      }}
                    >
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.name}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            flexShrink: 0,
                            border: "1px solid #eee",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "60px",
                            height: "60px",
                            background: "#eee",
                            borderRadius: "8px",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.7rem",
                            color: "#999",
                          }}
                        >
                          ছবি নেই
                        </div>
                      )}

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            color: "#333",
                            fontSize: "0.95rem",
                            marginBottom: "2px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {service.name}
                        </div>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                          <span
                            style={{
                              fontWeight: 700,
                              color: "#1c3528",
                              fontSize: "0.9rem",
                            }}
                          >
                            ৳{service.price}
                          </span>
                          {service.offer && (
                            <span
                              style={{
                                background: "#fff3cd",
                                color: "#856404",
                                padding: "2px 8px",
                                borderRadius: "10px",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                              }}
                            >
                              {service.offer}
                            </span>
                          )}
                          <span
                            style={{
                              background: "#1c352820",
                              color: "#1c3528",
                              padding: "2px 8px",
                              borderRadius: "10px",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}
                          >
                            {service.category}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                      <button
                        onClick={() => handleEdit(service)}
                        style={{
                          padding: "6px 14px",
                          background: "#2563eb",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#1d4ed8")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "#2563eb")
                        }
                      >
                        এডিট
                      </button>
                      <button
                        onClick={() => handleDelete(service._id)}
                        style={{
                          padding: "6px 14px",
                          background: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#a71d2a")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "#dc3545")
                        }
                      >
                        মুছুন
                      </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
