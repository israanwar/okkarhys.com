import { useEffect, useReducer, useRef, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import {
  Check, Copy, Upload, Clock, X, Download, ShoppingBag, FileImage, ChevronRight,
} from "lucide-react";
import { Seo } from "../../components/seo/Seo";
import { SiteChrome } from "../../components/layout/SiteChrome";
import { ORDER_STATUS } from "../../lib/localStore";
import { ordersData, productsData } from "../../lib/supabaseData";
import { useLiveSettings } from "../../hooks/usePageData";
import { useI18n } from "../../lib/i18n";

const ACCEPT_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const MAX_SIZE = 2 * 1024 * 1024;

export function PaymentPage() {
  const { orderNumber } = useParams();
  const settings = useLiveSettings();
  const [refreshToken, forceRender] = useReducer((x) => x + 1, 0);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Live-refresh order status (so admin approve/reject updates instantly)
  useEffect(() => {
    const onVis = () => { if (!document.hidden) forceRender(); };
    window.addEventListener("focus", forceRender);
    window.addEventListener("storage", forceRender);
    window.addEventListener("okr:local-store-change", forceRender);
    window.addEventListener("okr:remote-store-change", forceRender);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("focus", forceRender);
      window.removeEventListener("storage", forceRender);
      window.removeEventListener("okr:local-store-change", forceRender);
      window.removeEventListener("okr:remote-store-change", forceRender);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    ordersData.getByNumber(orderNumber).then((next) => {
      if (!alive) return;
      setOrder(next);
      setLoading(false);
    });
    return () => { alive = false; };
  }, [orderNumber, refreshToken]);

  if (loading) return null;
  if (!order) return <Navigate to="/" replace />;

  return (
    <>
      <Seo title={`Payment · ${order.order_number}`} description="Payment" noindex />
      <SiteChrome>
        <section className="okr__section" style={{ paddingTop: 100, paddingBottom: 80 }}>
          <div className="okr__wrap" style={{ maxWidth: 640 }}>
            <PaymentBody order={order} settings={settings} onChanged={forceRender} />
          </div>
        </section>
      </SiteChrome>
    </>
  );
}

function PaymentBody({ order, settings, onChanged }) {
  const { lang } = useI18n();
  const status = order.status ?? ORDER_STATUS.PENDING_PAYMENT;
  const isPending = status === ORDER_STATUS.PENDING_PAYMENT;
  const isWaiting = status === ORDER_STATUS.WAITING_VERIFICATION;
  const isPaid = status === ORDER_STATUS.PAID;
  const isRejected = status === ORDER_STATUS.REJECTED;

  const L = lang === "id" ? LANG_ID : LANG_EN;

  return (
    <>
      {/* Progress stepper */}
      <ProgressStepper status={status} L={L} />

      {/* Order number header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          fontSize: 11, color: "var(--okr-muted)", letterSpacing: ".14em",
          textTransform: "uppercase", marginBottom: 8,
        }}>{L.order_num}</div>
        <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 20, fontWeight: 700 }}>
          {order.order_number}
        </div>
      </div>

      {/* Main content: switches by status */}
      {isPending && <PendingView order={order} settings={settings} L={L} onChanged={onChanged} />}
      {isWaiting && <WaitingView order={order} L={L} />}
      {isPaid && <PaidView order={order} L={L} />}
      {isRejected && <RejectedView order={order} L={L} onChanged={onChanged} />}

      {/* Order summary — always shown */}
      <OrderSummary order={order} L={L} />
    </>
  );
}

/* ============================================================
 * PENDING: QRIS + upload proof + submit
 * ============================================================ */
function PendingView({ order, settings, L, onChanged }) {
  const [copied, setCopied] = useState(false);
  const [imgBroken, setImgBroken] = useState(false);
  const [proofFile, setProofFile] = useState(null); // { dataUrl, name, size }
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);

  const amount = order.total.toLocaleString("id-ID");
  const hasQris = Boolean(settings.qris_image)
    && settings.qris_image !== "/assets/qris/okkarhys-qris.png"
    && !imgBroken;

  // Countdown
  const [remaining, setRemaining] = useState(() => msRemaining(order));
  useEffect(() => {
    const iv = setInterval(() => setRemaining(msRemaining(order)), 1000);
    return () => clearInterval(iv);
  }, [order.payment_deadline]);

  async function copyAmount() {
    await navigator.clipboard.writeText(String(order.total));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    if (!ACCEPT_TYPES.includes(file.type)) {
      setError(L.err_type); e.target.value = ""; return;
    }
    if (file.size > MAX_SIZE) {
      setError(L.err_size); e.target.value = ""; return;
    }
    try {
      const dataUrl = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result); r.onerror = rej;
        r.readAsDataURL(file);
      });
      setProofFile({ dataUrl, name: file.name, size: file.size });
    } catch {
      setError(L.err_read);
    } finally {
      e.target.value = "";
    }
  }

  function removeProof() { setProofFile(null); }

  async function submit() {
    if (!proofFile) { setError(L.err_no_proof); return; }
    setSubmitting(true);
    try {
      await ordersData.uploadProof(order.id ?? order.order_number, proofFile.dataUrl);
      onChanged();
    } catch (e) {
      setError(e.message ?? "Failed to submit.");
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Awaiting banner */}
      <div className="okr__pay-alert okr__pay-alert--pending">
        <Clock size={16} />
        <span>{L.pending_body}</span>
        {remaining > 0 && (
          <span style={{ marginLeft: "auto", fontWeight: 700, color: remaining < 5 * 60 * 1000 ? "#fbbf24" : "inherit" }}>
            {formatMs(remaining)}
          </span>
        )}
      </div>

      {/* QRIS card — contained, centered, max 320px */}
      <div className="okr__panel okr__pay-qris-card">
        <div className="okr__pay-qris-frame">
          {hasQris ? (
            <img
              src={settings.qris_image}
              alt="QRIS"
              onError={() => setImgBroken(true)}
              className="okr__pay-qris-img"
            />
          ) : (
            <div className="okr__pay-qris-empty">
              <FileImage size={28} style={{ opacity: 0.5 }} />
              <p>{L.qris_missing}</p>
            </div>
          )}
        </div>

        <div className="okr__pay-total">
          <div className="okr__pay-total-label">{L.total_pay}</div>
          <div className="okr__pay-total-amount">Rp {amount}</div>
          <button onClick={copyAmount} className="okr__pay-copy-btn">
            {copied ? <><Check size={14} /> {L.copied}</> : <><Copy size={14} /> {L.copy}</>}
          </button>
        </div>
      </div>

      {/* Upload proof card */}
      <div className="okr__panel" style={{ marginBottom: 16 }}>
        <h3 className="okr__pay-section-title">{L.upload_title}</h3>
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/jpg" onChange={onFile} style={{ display: "none" }} />

        {!proofFile ? (
          <button
            onClick={() => fileRef.current?.click()}
            className="okr__pay-upload-dropzone"
            type="button"
          >
            <Upload size={22} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{L.upload_click}</div>
              <div style={{ fontSize: 12, color: "var(--okr-dim)", marginTop: 4 }}>{L.upload_hint}</div>
            </div>
          </button>
        ) : (
          <div className="okr__pay-proof-preview">
            <img src={proofFile.dataUrl} alt="Preview" />
            <div className="okr__pay-proof-meta">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <FileImage size={14} style={{ color: "var(--okr-primary-2)" }} />
                <span style={{ fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{proofFile.name}</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--okr-muted)" }}>{formatSize(proofFile.size)}</div>
              <button onClick={removeProof} className="okr__pay-proof-remove" type="button">
                <X size={12} /> {L.remove}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div style={{ color: "#fca5a5", fontSize: 13, marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <X size={14} /> {error}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        onClick={submit}
        disabled={!proofFile || submitting}
        className="okr__btn okr__btn--primary"
        style={{ width: "100%", justifyContent: "center", padding: "16px", fontSize: 15, marginBottom: 20, opacity: proofFile ? 1 : 0.5 }}
      >
        <Check size={17} /> {submitting ? L.submitting : L.submit}
      </button>
    </>
  );
}

/* ============================================================
 * WAITING VERIFICATION
 * ============================================================ */
function WaitingView({ order, L }) {
  return (
    <div className="okr__panel" style={{ textAlign: "center", padding: "40px 32px", marginBottom: 20 }}>
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        background: "rgba(224,68,168,0.15)",
        display: "grid", placeItems: "center",
        margin: "0 auto 20px", color: "var(--okr-primary-2)",
      }}>
        <Clock size={34} />
      </div>
      <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700 }}>{L.waiting_title}</h2>
      <p style={{ color: "var(--okr-muted)", margin: "0 0 20px", fontSize: 15, lineHeight: 1.6 }}>
        {L.waiting_body}
      </p>
      <div style={{
        display: "inline-block", padding: "8px 16px",
        background: "rgba(224,68,168,0.08)",
        border: "1px solid rgba(224,68,168,0.25)",
        borderRadius: 999, fontSize: 13, color: "var(--okr-primary-2)",
      }}>
        ⏱ {L.waiting_estimate}
      </div>
      {order.payment_proof && (
        <div style={{ marginTop: 24, textAlign: "left" }}>
          <div style={{ fontSize: 12, color: "var(--okr-muted)", marginBottom: 8, textAlign: "center" }}>{L.your_proof}</div>
          <img src={order.payment_proof} alt="Proof"
            style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 10, border: "1px solid var(--okr-line)", display: "block", margin: "0 auto" }} />
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * PAID — download products
 * ============================================================ */
function PaidView({ order, L }) {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    Promise.all(order.items.map((it) => productsData.get(it.product_id))).then((list) => {
      setProducts(list.filter(Boolean));
    });
  }, [order.id]);

  const downloadItems = order.items.map((it) => {
    const p = products.find((x) => x.id === it.product_id);
    return { ...it, download_url: p?.download_url };
  });
  const hasAnyDownload = downloadItems.some((it) => it.download_url);

  return (
    <div className="okr__panel" style={{ textAlign: "center", padding: "40px 32px", marginBottom: 20 }}>
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        background: "rgba(34,197,94,0.15)",
        display: "grid", placeItems: "center",
        margin: "0 auto 20px", color: "#86efac",
      }}>
        <Check size={34} />
      </div>
      <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700 }}>{L.paid_title}</h2>
      <p style={{ color: "var(--okr-muted)", margin: "0 0 24px", fontSize: 15, lineHeight: 1.6 }}>
        {L.paid_body}
      </p>

      {hasAnyDownload ? (
        <div style={{ display: "grid", gap: 10 }}>
          {downloadItems.map((it) => (
            it.download_url ? (
              <a key={it.product_id} href={it.download_url} target="_blank" rel="noreferrer"
                className="okr__btn okr__btn--primary"
                style={{ width: "100%", justifyContent: "space-between", padding: "14px 20px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                  <Download size={16} /> {L.download} {it.name}
                </span>
                <ChevronRight size={16} />
              </a>
            ) : (
              <div key={it.product_id} className="okr__panel" style={{ padding: 14, background: "rgba(255,255,255,0.02)" }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{it.name}</div>
                <div style={{ fontSize: 12, color: "var(--okr-muted)", marginTop: 4 }}>{L.download_via_email}</div>
              </div>
            )
          ))}
        </div>
      ) : (
        <div style={{
          padding: 16, background: "rgba(224,68,168,0.06)",
          border: "1px solid rgba(224,68,168,0.25)", borderRadius: 10,
          fontSize: 14, color: "var(--okr-muted)",
        }}>
          {L.download_via_email}
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * REJECTED — retry upload
 * ============================================================ */
function RejectedView({ order, L, onChanged }) {
  async function retry() {
    if (!confirm(L.retry_confirm)) return;
    await ordersData.updateStatus(order.id ?? order.order_number, ORDER_STATUS.PENDING_PAYMENT, {
      payment_proof: null,
      payment_proof_uploaded_at: null,
    });
    onChanged();
  }
  return (
    <div className="okr__panel" style={{ textAlign: "center", padding: "40px 32px", marginBottom: 20 }}>
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        background: "rgba(239,68,68,0.15)",
        display: "grid", placeItems: "center",
        margin: "0 auto 20px", color: "#fca5a5",
      }}>
        <X size={34} />
      </div>
      <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700 }}>{L.rejected_title}</h2>
      <p style={{ color: "var(--okr-muted)", margin: "0 0 16px", fontSize: 15, lineHeight: 1.6 }}>
        {L.rejected_body}
      </p>
      {order.admin_note && (
        <div style={{
          padding: 14, background: "rgba(239,68,68,0.05)",
          border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10,
          fontSize: 13, color: "#fca5a5", marginBottom: 20, textAlign: "left",
        }}>
          <strong>{L.admin_note}:</strong> {order.admin_note}
        </div>
      )}
      <button onClick={retry} className="okr__btn okr__btn--primary" style={{ padding: "12px 24px" }}>
        <Upload size={15} /> {L.retry}
      </button>
    </div>
  );
}

/* ============================================================
 * Progress Stepper
 * ============================================================ */
function ProgressStepper({ status, L }) {
  const steps = [
    { key: "created",  label: L.step_created },
    { key: "submitted", label: L.step_submitted },
    { key: "verified", label: L.step_verified },
    { key: "download", label: L.step_download },
  ];
  const activeIdx =
    status === ORDER_STATUS.PENDING_PAYMENT ? 0 :
    status === ORDER_STATUS.WAITING_VERIFICATION ? 1 :
    status === ORDER_STATUS.PAID ? 3 :
    0;

  return (
    <div className="okr__pay-steps">
      {steps.map((s, i) => {
        const done = i < activeIdx;
        const active = i === activeIdx;
        return (
          <div key={s.key} className={`okr__pay-step${done ? " is-done" : ""}${active ? " is-active" : ""}`}>
            <div className="okr__pay-step-dot">
              {done ? <Check size={12} /> : <span>{i + 1}</span>}
            </div>
            <div className="okr__pay-step-label">{s.label}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
 * Order summary
 * ============================================================ */
function OrderSummary({ order, L }) {
  return (
    <div className="okr__panel" style={{ padding: 20 }}>
      <h3 className="okr__pay-section-title" style={{ marginBottom: 12 }}>{L.summary}</h3>
      {order.items.map((it, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 14 }}>
          <span style={{ color: "var(--okr-muted)" }}>{it.name} × {it.qty}</span>
          <span>Rp {it.subtotal.toLocaleString("id-ID")}</span>
        </div>
      ))}
      <div style={{
        display: "flex", justifyContent: "space-between",
        padding: "16px 0 0", marginTop: 12,
        borderTop: "1px solid var(--okr-line)", fontSize: 17, fontWeight: 700,
      }}>
        <span>Total</span>
        <span style={{ color: "var(--okr-primary-2)" }}>Rp {order.total.toLocaleString("id-ID")}</span>
      </div>
    </div>
  );
}

/* ============================================================
 * Utils
 * ============================================================ */
function msRemaining(order) {
  if (!order.payment_deadline) return 0;
  return Math.max(0, new Date(order.payment_deadline).getTime() - Date.now());
}
function formatMs(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const rs = s % 60;
  return `${String(m).padStart(2, "0")}:${String(rs).padStart(2, "0")}`;
}
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/* ============================================================
 * i18n strings
 * ============================================================ */
const LANG_EN = {
  order_num: "Order number",
  step_created: "Order Created",
  step_submitted: "Payment Submitted",
  step_verified: "Verification",
  step_download: "Download Ready",
  pending_body: "Please scan the QRIS below and complete payment.",
  total_pay: "Total to pay",
  copy: "Copy amount", copied: "Copied",
  qris_missing: "QRIS not available yet. Contact admin.",
  upload_title: "Upload payment proof",
  upload_click: "Click to upload",
  upload_hint: "PNG · JPG · JPEG · max 2 MB",
  remove: "Remove",
  submit: "Submit payment",
  submitting: "Submitting…",
  err_type: "Only PNG / JPG / JPEG allowed.",
  err_size: "File too large. Max 2 MB.",
  err_read: "Failed to read file.",
  err_no_proof: "Please upload payment proof first.",
  waiting_title: "Payment Submitted",
  waiting_body: "Waiting for admin verification. Admin will verify your payment shortly.",
  waiting_estimate: "Estimated: 5–30 minutes",
  your_proof: "Your uploaded proof",
  paid_title: "Payment Verified",
  paid_body: "Thank you. Your digital product is now available.",
  download: "Download",
  download_via_email: "Download link will be sent to your email shortly.",
  rejected_title: "Payment Rejected",
  rejected_body: "There was an issue with your payment. Please try again or contact admin.",
  admin_note: "Note from admin",
  retry: "Retry upload",
  retry_confirm: "Reset order to pending and re-upload payment proof?",
  summary: "Order summary",
};
const LANG_ID = {
  order_num: "Nomor pesanan",
  step_created: "Order Dibuat",
  step_submitted: "Bukti Dikirim",
  step_verified: "Verifikasi",
  step_download: "Siap Diunduh",
  pending_body: "Silakan scan QRIS di bawah dan selesaikan pembayaran.",
  total_pay: "Total pembayaran",
  copy: "Copy nominal", copied: "Tersalin",
  qris_missing: "QRIS belum tersedia. Hubungi admin.",
  upload_title: "Upload bukti pembayaran",
  upload_click: "Klik untuk upload",
  upload_hint: "PNG · JPG · JPEG · maks 2 MB",
  remove: "Hapus",
  submit: "Kirim bukti pembayaran",
  submitting: "Mengirim…",
  err_type: "Hanya PNG / JPG / JPEG.",
  err_size: "File terlalu besar. Maks 2 MB.",
  err_read: "Gagal membaca file.",
  err_no_proof: "Upload bukti pembayaran terlebih dahulu.",
  waiting_title: "Bukti Terkirim",
  waiting_body: "Menunggu verifikasi admin. Admin akan memverifikasi pembayaran Anda segera.",
  waiting_estimate: "Estimasi: 5–30 menit",
  your_proof: "Bukti yang Anda upload",
  paid_title: "Pembayaran Terverifikasi",
  paid_body: "Terima kasih. Produk digital Anda sekarang tersedia.",
  download: "Download",
  download_via_email: "Link download akan dikirim ke email Anda.",
  rejected_title: "Pembayaran Ditolak",
  rejected_body: "Ada masalah dengan pembayaran. Silakan coba lagi atau hubungi admin.",
  admin_note: "Catatan dari admin",
  retry: "Upload ulang",
  retry_confirm: "Reset order ke pending dan upload bukti baru?",
  summary: "Ringkasan pesanan",
};
