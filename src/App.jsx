import { useEffect } from 'react';
export default function App() {
  useEffect(() => {
    const loadGooglePayScript = () => {
       if (!document.querySelector('script[src="https://pay.google.com/gp/p/js/pay.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://pay.google.com/gp/p/js/pay.js';
        script.async = true;
        script.onload = initializeGooglePayButton;
        document.body.appendChild(script);
      } else {
        initializeGooglePayButton(); 
      }
    };

    const initializeGooglePayButton = () => {
      if (window.google) {
        const paymentsClient = new google.payments.api.PaymentsClient({ environment: 'TEST' });
        const paymentRequest = {
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [
            {
              type: 'CARD',
              parameters: {
                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                allowedCardNetworks: ['MASTERCARD', 'VISA'],
              },
              tokenizationSpecification: {
                type: 'PAYMENT_GATEWAY',
                parameters: {
                  gateway: 'example',
                  gatewayMerchantId: 'exampleGatewayMerchantId',
                },
              },
            },
          ],
          merchantInfo: {
            merchantId: '12345678901234567890',
            merchantName: 'Demo Merchant',
          },
          transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPriceLabel: 'Total',
            totalPrice: '100.00',
            currencyCode: 'USD',
            countryCode: 'US',
          },
        };

        paymentsClient.isReadyToPay(paymentRequest).then((response) => {
          if (response.result) {
            const button = paymentsClient.createButton({
              onClick: () => {
                paymentsClient.loadPaymentData(paymentRequest).then((paymentData) => {
                  console.log('Payment Data:', paymentData);
                }).catch((error) => {
                  console.error('Payment failed', error);
                });
              },
            });
            document.getElementById('google-pay-button').appendChild(button);
          }
        }).catch((err) => {
          console.error('Error checking Google Pay readiness:', err);
        });
      } else {
        console.error('Google Pay script is not loaded.');
      }
    };

    loadGooglePayScript();
  }, []);

  return (
    <div>
      <header>
        <h1>Payment Options</h1>
        <p>Choose your preferred payment method below.</p>
      </header>
      <main>
        <section className='google-pay-section'>
          <h2>Google Pay</h2>
          <div id="google-pay-button"></div>
        </section>
      </main>
      <footer>
        <p>&copy; 2024 Demo Merchant. All rights reserved.</p>
      </footer>
    </div>
  );
}
