/** Shared, site-wide selectors (data-testid values and visible labels). */
export const CookieBannerLocators = {
  acceptAllButtonText: 'ยอมรับทั้งหมด',
  settingsButtonText: 'การตั้งค่าคุกกี้',
} as const;

/** API the site calls to build the LINE Login URL after the guest confirms the login modal. */
export const AUTH_URL_API_PATH = '/api/auth/get-url';

export const LoginRequiredModalLocators = {
  /** Shared backdrop – the inner container's testid differs per page (global-modal / option-modal). */
  backdrop: 'modal-backdrop',
  cancelButton: 'option-modal-cancel-button',
  confirmButton: 'option-modal-confirm-button',
  messageText: 'กรุณาล็อกอินเพื่อเข้าใช้งาน',
  cancelText: 'ยกเลิก',
  confirmText: 'ตกลง',
} as const;
