# Stripe Payment Integration Setup

This document outlines how to set up and configure Stripe payments for the HopeLink donation system.

## Prerequisites

1. Create a Stripe account at [https://stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard

## Environment Variables

Update your `.env.local` file with your Stripe credentials:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Your app's URL for redirects
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Getting Your Stripe Keys

### 1. API Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers > API keys**
3. Copy your **Publishable key** (starts with `pk_test_`) to `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`
4. Copy your **Secret key** (starts with `sk_test_`) to `STRIPE_SECRET_KEY`

### 2. Webhook Secret
1. Go to **Developers > Webhooks** in your Stripe Dashboard
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://yourdomain.com/api/stripe/webhook`
   - For local development: `https://your-ngrok-url.ngrok.io/api/stripe/webhook`
4. Select these events to listen for:
   - `checkout.session.completed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`) to `STRIPE_WEBHOOK_SECRET`

## Local Development with Webhooks

For local development, you'll need to use ngrok or similar to expose your local server:

1. Install ngrok: `npm install -g ngrok`
2. Start your Next.js app: `npm run dev`
3. In another terminal, run: `ngrok http 3000`
4. Use the ngrok URL for your webhook endpoint in Stripe Dashboard

## Testing

Use Stripe's test card numbers:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

## Features Implemented

- ✅ Stripe Checkout Sessions
- ✅ Secure webhook handling
- ✅ Payment success page
- ✅ Payment cancellation handling
- ✅ Database integration with donation tracking
- ✅ Project funding updates
- ✅ Email receipts (via Stripe)

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── donations/route.ts          # Main donation API
│   │   └── stripe/webhook/route.ts     # Webhook handler
│   └── donations/
│       ├── page.tsx                    # Donation form
│       └── success/page.tsx            # Success page
```

## Security Notes

- Never expose your secret key in client-side code
- Always verify webhook signatures
- Use environment variables for all sensitive data
- Test thoroughly in both test and live modes

## Going Live

1. Switch to live API keys in production
2. Update webhook URLs to production endpoints
3. Test thoroughly with real payment methods
4. Monitor Stripe Dashboard for any issues
