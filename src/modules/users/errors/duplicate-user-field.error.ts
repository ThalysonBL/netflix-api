export type DuplicateUserField = 'cpf' | 'email';

export class DuplicateUserFieldError extends Error {
  constructor(public readonly field: DuplicateUserField) {
    super(DuplicateUserFieldError.getMessageText(field));
    this.name = 'DuplicateUserFieldError';
  }

  private static getMessageText(field: DuplicateUserField): string {
    return field === 'cpf' ? 'CPF já cadastrado.' : 'E-mail já cadastrado.';
  }
}
