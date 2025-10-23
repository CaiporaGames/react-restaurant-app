"use client";
import "./ConfirmDialog.css";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Continue",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="cd">
      <div className="cd__overlay" onClick={onCancel} />
      <div className="cd__panel" role="dialog" aria-modal="true" aria-label={title}>
        <h3 className="cd__title">{title}</h3>
        <p className="cd__msg">{message}</p>
        <div className="cd__actions">
          <button className="btn" onClick={onCancel}>{cancelText}</button>
          <button className="btn btn--primary" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
