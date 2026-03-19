export interface CreatePaymentDTO {
  orderId: number;
  method: "CREDIT_CARD" | "PIX";
}

export interface PaymentResponseDTO {
  clientSecret: string | null;
}