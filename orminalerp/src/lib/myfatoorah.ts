/**
 * Minimal server-side MyFatoorah client.
 *
 * Falls back to the public MyFatoorah test/sandbox credentials so the checkout
 * works out of the box. To go live, set MYFATOORAH_API_TOKEN (and optionally
 * MYFATOORAH_BASE_URL / MYFATOORAH_CURRENCY) in the project environment.
 * Docs: https://docs.myfatoorah.com/
 */

const TEST_TOKEN =
  'SK_KWT_vVZlnnAqu8jRByOWaRPNId4ShzEDNt256dvnjebuyzo52dXjAfRx2ixW5umjWSUx';
const TEST_BASE_URL = 'https://apitest.myfatoorah.com';

const token = process.env.MYFATOORAH_API_TOKEN?.trim() || TEST_TOKEN;

export const myfatoorahConfig = {
  baseUrl: (process.env.MYFATOORAH_BASE_URL?.trim() || TEST_BASE_URL).replace(/\/+$/, ''),
  currency: process.env.MYFATOORAH_CURRENCY?.trim() || 'USD',
  /** true when running against the shared sandbox credentials. */
  isTest: !process.env.MYFATOORAH_API_TOKEN,
};

type MFEnvelope<T> = {
  IsSuccess: boolean;
  Message: string;
  ValidationErrors: { Name: string; Error: string }[] | null;
  Data: T;
};

async function mfPost<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${myfatoorahConfig.baseUrl}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const json = (await res.json()) as MFEnvelope<T>;
  if (!res.ok || !json.IsSuccess) {
    const detail =
      json.ValidationErrors?.map((e) => `${e.Name}: ${e.Error}`).join(', ') || json.Message || `HTTP ${res.status}`;
    throw new Error(`MyFatoorah: ${detail}`);
  }
  return json.Data;
}

export type MFPaymentMethod = {
  PaymentMethodId: number;
  PaymentMethodAr: string;
  PaymentMethodEn: string;
  PaymentMethodCode: string;
  IsDirectPayment: boolean;
  ServiceCharge: number;
  TotalAmount: number;
  CurrencyIso: string;
  ImageUrl: string;
};

/** Retrieve the enabled payment methods for a given amount. */
export async function initiatePayment(amount: number): Promise<MFPaymentMethod[]> {
  const data = await mfPost<{ PaymentMethods: MFPaymentMethod[] }>('/v2/InitiatePayment', {
    InvoiceAmount: amount,
    CurrencyIso: myfatoorahConfig.currency,
  });
  return data.PaymentMethods ?? [];
}

export type ExecutePaymentInput = {
  PaymentMethodId: number;
  InvoiceValue: number;
  CallBackUrl: string;
  ErrorUrl: string;
  DisplayCurrencyIso?: string;
  CustomerName?: string;
  CustomerEmail?: string;
  Language?: 'AR' | 'EN';
  CustomerReference?: string;
  UserDefinedField?: string;
};

export type ExecutePaymentResult = {
  InvoiceId: number;
  IsDirectPayment: boolean;
  PaymentURL: string;
  CustomerReference: string | null;
  UserDefinedField: string | null;
};

/** Create an invoice and get the hosted payment URL to redirect the customer to. */
export async function executePayment(input: ExecutePaymentInput): Promise<ExecutePaymentResult> {
  return mfPost<ExecutePaymentResult>('/v2/ExecutePayment', input);
}

export type MFPaymentStatus = {
  InvoiceId: number;
  InvoiceStatus: 'Pending' | 'Paid' | 'Canceled' | string;
  InvoiceReference: string;
  CustomerReference: string | null;
  UserDefinedField: string | null;
  InvoiceValue: number;
  CustomerName: string | null;
  CustomerEmail: string | null;
};

/** Verify a payment using the paymentId returned on the callback URL. */
export async function getPaymentStatus(paymentId: string): Promise<MFPaymentStatus> {
  return mfPost<MFPaymentStatus>('/v2/GetPaymentStatus', {
    Key: paymentId,
    KeyType: 'PaymentId',
  });
}
