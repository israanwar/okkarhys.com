export const DEFAULT_QRIS_SETTINGS = {
  qris_image: "/assets/qris/okka-rhys-qris.jpeg",
  qris_merchant_name: "OKKA RHYS, DIGITAL & KREATIF",
  qris_nmid: "ID1025456495932",
  qris_terminal_label: "A01",
  gopay_auto_enabled: false,
  gopay_auto_label: "GoPay Merchant QRIS otomatis",
};

const BROKEN_QRIS_IMAGES = new Set([
  "/assets/qris/okkarhys-qris.png",
]);

export function normalizePaymentSettings(settings = {}) {
  const next = { ...settings };

  if (!next.qris_image || BROKEN_QRIS_IMAGES.has(next.qris_image)) {
    next.qris_image = DEFAULT_QRIS_SETTINGS.qris_image;
  }
  if (!String(next.qris_merchant_name ?? "").trim()) {
    next.qris_merchant_name = DEFAULT_QRIS_SETTINGS.qris_merchant_name;
  }
  if (!String(next.qris_nmid ?? "").trim()) {
    next.qris_nmid = DEFAULT_QRIS_SETTINGS.qris_nmid;
  }
  if (!String(next.qris_terminal_label ?? "").trim()) {
    next.qris_terminal_label = DEFAULT_QRIS_SETTINGS.qris_terminal_label;
  }
  if (typeof next.gopay_auto_enabled === "undefined") {
    next.gopay_auto_enabled = DEFAULT_QRIS_SETTINGS.gopay_auto_enabled;
  }
  if (!String(next.gopay_auto_label ?? "").trim()) {
    next.gopay_auto_label = DEFAULT_QRIS_SETTINGS.gopay_auto_label;
  }

  return next;
}
