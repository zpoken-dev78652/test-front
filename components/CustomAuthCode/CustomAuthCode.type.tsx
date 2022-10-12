export type ReactCodeInputType = {
  type?: "text" | "number";
  onChange?: (val: string) => void;
  onComplete?: (val?: string) => void;
  fields?: number;
  loading?: boolean;
  title?: string;
  fieldWidth?: number;
  fieldHeight?: number;
  autoFocus?: boolean;
  className?: string;
  values?: string[];
  disabled?: boolean;
  required?: boolean;
  placeholder?: string[];
};

export type CustomAuthCodeProps = {
  className?: string;
  label?: string;
  isInvadil?: boolean;
  disabledSubmit?: boolean;
  hideReset?: boolean;
  list?: string[];
  onSubmit?: () => void;
  resetFunc?: () => void;
  ref?: any;
  fields?: number;
  btnValue?: string;
  disableBtn?: boolean;
};
