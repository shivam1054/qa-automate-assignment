/** Shared, site-wide selectors (data-testid values and visible labels). */
export const CookieBannerLocators = {
  acceptAllButtonText: 'ยอมรับทั้งหมด',
  settingsButtonText: 'การตั้งค่าคุกกี้',
} as const;

export const LoginRequiredModalLocators = {
  root: 'option-modal',
  cancelButton: 'option-modal-cancel-button',
  confirmButton: 'option-modal-confirm-button',
  messageText: 'กรุณาล็อกอินเพื่อเข้าใช้งาน',
  cancelText: 'ยกเลิก',
  confirmText: 'ตกลง',
} as const;
