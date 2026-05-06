declare module "razorpay" {
  interface RazorpayConfig {
    key_id: string;
    key_secret: string;
  }

  interface SubscriptionCreateOptions {
    plan_id: string;
    customer_notify?: 0 | 1;
    quantity?: number;
    total_count?: number;
    notes?: Record<string, string>;
    [key: string]: unknown;
  }

  interface Subscription {
    id: string;
    short_url: string;
    status: string;
    notes?: Record<string, string>;
    [key: string]: unknown;
  }

  class Razorpay {
    constructor(config: RazorpayConfig);
    subscriptions: {
      create(options: SubscriptionCreateOptions): Promise<Subscription>;
      cancel(id: string): Promise<Subscription>;
      fetch(id: string): Promise<Subscription>;
    };
    payments: {
      fetch(id: string): Promise<Record<string, unknown>>;
    };
  }

  export = Razorpay;
}
