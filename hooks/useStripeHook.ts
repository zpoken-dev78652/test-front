import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

export const useStripeHook = () => {
  const stripe: any = useStripe();
  const elements: any = useElements();
  return {
    stripe,
    elements,
    CardElement,
  };
};
