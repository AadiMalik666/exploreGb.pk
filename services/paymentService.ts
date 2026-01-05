
// This service simulates a backend interaction with a payment provider like Stripe.

interface PaymentIntentResponse {
    clientSecret: string;
    id: string;
    amount: number;
    currency: string;
}

interface PaymentConfirmationResponse {
    status: 'succeeded' | 'requires_action' | 'requires_payment_method';
    transactionId: string;
}

// Simulate latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const PaymentService = {
    /**
     * 1. Create Payment Intent
     * Call this when the checkout page loads or when the cart total changes.
     * In a real app, this calls your backend: POST /api/create-payment-intent
     */
    createPaymentIntent: async (amount: number, currency: string = 'usd'): Promise<PaymentIntentResponse> => {
        await delay(1000); // Simulate network request
        
        // Generate a fake client secret like Stripe's
        const uniqueId = Math.random().toString(36).substring(7);
        return {
            clientSecret: `pi_${uniqueId}_secret_${Math.random().toString(36).substring(7)}`,
            id: `pi_${uniqueId}`,
            amount: amount,
            currency: currency
        };
    },

    /**
     * 2. Confirm Payment
     * Call this when the user submits the payment form.
     * In a real app, you would use: stripe.confirmPayment(...)
     */
    confirmPayment: async (clientSecret: string, paymentDetails: any): Promise<PaymentConfirmationResponse> => {
        await delay(2000); // Simulate processing time with the bank
        
        // Basic validation simulation
        if (!paymentDetails.cardNumber || paymentDetails.cardNumber.length < 16) {
            throw new Error("Invalid card number.");
        }

        // Simulate a random decline (rarely) for realism, or always succeed for demo
        const isSuccess = true; 

        if (isSuccess) {
            return {
                status: 'succeeded',
                transactionId: `tx_${Math.random().toString(36).substring(7)}`
            };
        } else {
            throw new Error("Card declined.");
        }
    }
};
