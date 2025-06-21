export interface FormState {
  message: string | null;
  errors?: {
    email?: string[];
    password?: string[];
  };
}
