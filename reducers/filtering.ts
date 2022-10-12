export type ComponentState = {
  sort: {
    sortField: string;
    sortDirection: string;
  };
  prices: {
    fromPrice: number;
    toPrice: number;
  };
  themes: string[] | null;
  types: string[] | null;
  franchises: number[] | null;
  completeness: string[] | null;
  currency: string;
};

export const CHANGE_SORT_FIELD = "CHANGE_SORT_FIELD";
export const CHANGE_FROM_PRICE = "CHANGE_FROM_PRICE";
export const CHANGE_TO_PRICE = "CHANGE_TO_PRICE";
export const RESET_FIELDS = "RESET_FIELDS";
export const CHANGE_THEMES = "CHANGE_THEMES";
export const CHANGE_TYPES = "CHANGE_TYPES";
export const CHANGE_FRANCHISES = "CHANGE_FRANCHISES";
export const CHANGE_COMPLETENNES = "CHANGE_COMPLETENNES";
export const CHANGE_CURRENCY = "CHANGE_CURRENCY";

type ActionReducerTypes =
  | { type: typeof RESET_FIELDS }
  | { type: typeof CHANGE_SORT_FIELD; data: any }
  | { type: typeof CHANGE_FROM_PRICE; data: any }
  | { type: typeof CHANGE_TO_PRICE; data: any }
  | { type: typeof CHANGE_THEMES; data: any }
  | { type: typeof CHANGE_TYPES; data: any }
  | { type: typeof CHANGE_FRANCHISES; data: any }
  | { type: typeof CHANGE_COMPLETENNES; data: any }
  | { type: typeof CHANGE_CURRENCY; data: any };

export const initialComponentState = {
  sort: {
    sortField: "",
    sortDirection: "",
  },
  prices: {
    fromPrice: 0,
    toPrice: 0,
  },
  themes: null,
  types: null,
  franchises: null,
  completeness: null,
  currency: "",
};

export const reducer = (state: ComponentState, action: ActionReducerTypes) => {
  switch (action.type) {
    case CHANGE_SORT_FIELD:
      return { ...state, sort: action.data };
    case CHANGE_FROM_PRICE:
      return { ...state, prices: { ...state.prices, fromPrice: action.data } };
    case CHANGE_TO_PRICE:
      return { ...state, prices: { ...state.prices, toPrice: action.data } };
    case CHANGE_THEMES:
      return { ...state, themes: action.data };
    case CHANGE_TYPES:
      return { ...state, types: action.data };
    case CHANGE_CURRENCY:
      return { ...state, currency: action.data };
    case CHANGE_FRANCHISES:
      return {
        ...state,
        franchises: !state.franchises
          ? [action.data]
          : state.franchises.includes(action.data)
          ? state.franchises.filter((i) => i !== action.data)
          : [...state.franchises, action.data],
      };
    case CHANGE_COMPLETENNES:
      return {
        ...state,
        completeness: !state.completeness
          ? [action.data]
          : state.completeness.includes(action.data)
          ? state.completeness.filter((i) => i !== action.data)
          : [...state.completeness, action.data],
      };
    case RESET_FIELDS:
      return {
        prices: {
          ...state.prices,
          fromPrice: 0,
          toPrice: 0,
        },
        sort: {
          sortField: "",
          sortDirection: "",
        },
        themes: null,
        types: null,
        franchises: null,
        completeness: null,
        currency: "",
      };
    default:
      return state;
  }
};
