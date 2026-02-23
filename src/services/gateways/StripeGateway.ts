import Stripe from "stripe";

export type StripePaymentMethodType = "CREDIT_CARD" | "PIX";

export class StripeGateway {
  private stripe: Stripe;

  constructor() {
    const secretKey = (process.env.STRIPE_SECRET_KEY || "").trim();
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY não está definida no ambiente");
    }
    if (secretKey.startsWith("pk_")) {
      throw new Error(
        "STRIPE_SECRET_KEY deve ser a chave SECRETA (sk_test_...), não a chave publicável (pk_test_...). " +
          "No .env use a 'Chave secreta' do Dashboard Stripe."
      );
    }
    this.stripe = new Stripe(secretKey);
  }

  async createPaymentIntent(
    amountInCents: number,
    method: StripePaymentMethodType
  ): Promise<Stripe.PaymentIntent> {
    const paymentMethodTypes: ("pix" | "card")[] =
      method === "PIX" ? ["pix"] : ["card"];

    return this.stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "brl",
      payment_method_types: paymentMethodTypes,
    });
  }

  constructWebhookEvent(
    body: Buffer | string,
    signature: string,
    webhookSecret: string
  ): Stripe.Event {
    return this.stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  }
}
