// app/api/create-order/route.js - MOCK VERSION
import { NextResponse } from 'next/server';

export async function POST(request) {
  // Always return mock response
  return NextResponse.json({
    success: true,
    order: {
      id: `mock_order_${Date.now()}`,
      amount: 50000,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      status: 'created'
    },
    note: 'Running in mock mode. Add Razorpay keys to enable real payments.'
  });
}