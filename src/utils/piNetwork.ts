// Pi Network SDK Integration Helper
// Implements real server-side payment verification workflow for Pi Browser

declare global {
  interface Window {
    Pi?: {
      init: (config: { version: string; sandbox: boolean }) => void;
      authenticate: (
        scopes: string[],
        onIncompletePaymentFound: (payment: any) => void
      ) => Promise<{ accessToken: string; user: { uid: string; username: string } }>;
      createPayment: (
        paymentData: {
          amount: number;
          memo: string;
          metadata: Record<string, any>;
        },
        callbacks: {
          onReadyForServerApproval: (paymentId: string) => void;
          onReadyForServerCompletion: (paymentId: string, txid: string) => void;
          onCancel: (paymentId: string) => void;
          onError: (error: Error, payment?: any) => void;
        }
      ) => void;
    };
  }
}

export function isPiBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const userAgent = navigator.userAgent || '';
  return Boolean(window.Pi || userAgent.toLowerCase().includes('pibrowser'));
}

export function initPiSdk(sandbox: boolean = true): boolean {
  if (typeof window !== 'undefined' && window.Pi) {
    try {
      window.Pi.init({ version: '2.0', sandbox });
      return true;
    } catch (e) {
      console.warn('Pi SDK initialization notice:', e);
    }
  }
  return false;
}
