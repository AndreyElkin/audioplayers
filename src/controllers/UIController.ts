export class UIController {
  private static modals: Map<string, boolean> = new Map();

  static openModal(modalId: string): void {
    this.modals.set(modalId, true);
  }

  static closeModal(modalId: string): void {
    this.modals.set(modalId, false);
  }

  static isModalOpen(modalId: string): boolean {
    return this.modals.get(modalId) || false;
  }

  static toggleModal(modalId: string): void {
    const isOpen = this.isModalOpen(modalId);
    this.modals.set(modalId, !isOpen);
  }
}

export const uiController = new UIController();

