import { getContext, setContext } from 'svelte';

export interface FormFieldContext {
  id: string;
  name: string;
  value: any;
  setValue: (value: any) => void;
  error: string;
  touched: boolean;
  dirty: boolean;
  required: boolean;
  disabled: boolean;
  helperId: string;
  errorId: string;
  describedBy: string;
}

const FORM_FIELD_CONTEXT_KEY = Symbol('form-field');

export function setFormFieldContext(context: FormFieldContext): void {
  setContext(FORM_FIELD_CONTEXT_KEY, context);
}

export function getFormFieldContext(): FormFieldContext | null {
  const context = getContext<FormFieldContext>(FORM_FIELD_CONTEXT_KEY);
  return context || null;
}
