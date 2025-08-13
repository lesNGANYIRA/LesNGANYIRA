/**
 * Firebase Functions (Stripe) — create checkout session + webhook
 * Requires: firebase-admin, firebase-functions v2, stripe
 * Secrets: STRIPE_SECRET, STRIPE_WEBHOOK_SECRET
 */

const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const Stripe = require('stripe');

admin.initializeApp();
const db = admin.firestore();

const STRIPE_SECRET = defineSecret('STRIPE_SECRET');
const STRIPE_WH_SECRET = defineSecret('STRIPE_WEBHOOK_SECRET');

function allowCORS(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'content-type');
  res.set('Access-Control-Allow-Methods', 'POST,OPTIONS');
  if (req.method === 'OPTIONS') { res.status(204).send(''); return true; }
  return false;
}
const ts = admin.firestore.FieldValue.serverTimestamp;

// Test endpoint
exports.ping = onRequest((req, res) => {
  if (allowCORS(req, res)) return;
  res.status(200).send('OK from Firebase Functions');
});

// Create Stripe Checkout session
exports.createCheckout = onRequest({ secrets: [STRIPE_SECRET] }, async (req, res) => {
  try {
    if (allowCORS(req, res)) return;
    if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

    const { docId, amount, currency, successUrl, cancelUrl } = req.body || {};
    const amt = Number(amount);
    if (!amt || amt <= 0) return res.status(400).json({ error: 'Invalid amount' });

    const stripe = Stripe(STRIPE_SECRET.value());
    const SUCCESS = successUrl || 'https://lesnganyira.github.io/LesNGANYIRA/app.html?paid=1';
    const CANCEL  = cancelUrl  || 'https://lesnganyira.github.io/LesNGANYIRA/app.html?cancel=1';
    const curr = (currency || 'cad').toLowerCase();

    // create/find pending doc
    let id = docId;
    if (!id) {
      const ref = await db.collection('contributions').add({
        status: 'pending', provider: 'stripe',
        amount: amt, currency: curr, createdAt: ts()
      });
      id = ref.id;
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      currency: curr,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: curr,
          unit_amount: Math.round(amt * 100),
          product_data: { name: 'Contribution' }
        }
      }],
      success_url: SUCCESS,
      cancel_url: CANCEL,
      metadata: { docId: id }
    });

    await db.collection('contributions').doc(id).set({
      sessionId: session.id,
      amount: amt, currency: curr,
      provider: 'stripe', status: 'pending',
      updatedAt: ts()
    }, { merge: true });

    res.json({ url: session.url, docId: id });
  } catch (e) {
    console.error('createCheckout error:', e);
    res.status(400).json({ error: e.message || 'Failed to create checkout' });
  }
});

// Stripe webhook (mark paid/failed)
exports.stripeWebhook = onRequest({ secrets: [STRIPE_SECRET, STRIPE_WH_SECRET] }, async (req, res) => {
  try {
    const stripe = Stripe(STRIPE_SECRET.value());
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, STRIPE_WH_SECRET.value());
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const docId = session?.metadata?.docId;
      if (docId) {
        await db.collection('contributions').doc(docId).set({
          status: 'paid',
          paymentIntentId: session.payment_intent || null,
          paidAt: ts(), updatedAt: ts()
        }, { merge: true });
      }
    } else if (event.type === 'checkout.session.expired') {
      const session = event.data.object;
      const docId = session?.metadata?.docId;
      if (docId) {
        await db.collection('contributions').doc(docId).set({
          status: 'failed', reason: 'expired', updatedAt: ts()
        }, { merge: true });
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      const pi = event.data.object;
      const q = await db.collection('contributions')
        .where('paymentIntentId','==',pi.id).limit(1).get();
      if (!q.empty) {
        await q.docs[0].ref.set({ status: 'failed', updatedAt: ts() }, { merge: true });
      }
    }

    res.json({ received: true });
  } catch (e) {
    console.error('webhook error:', e);
    res.status(500).send('Server error');
  }
});
