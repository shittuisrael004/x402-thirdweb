import { createThirdwebClient } from "thirdweb";
import { facilitator, settlePayment } from "thirdweb/x402";
import { baseSepolia } from "thirdweb/chains";

const client = createThirdwebClient({ 
    secretKey: process.env.THIRDWEB_SECRET_KEY!, 
});

const thirdwebX402Facilitator = facilitator({
  client,
  serverWalletAddress: process.env.THIRDWEB_SERVER_WALLET_ADDRESS!,
});

export async function GET(request: Request) {
    const paymentData = request.headers.get("x-payment");
 
    // Verify and process payment
  const result = await settlePayment({
    resourceUrl: "http://localhost:3000/api",
    method: "GET",
    paymentData,
    payTo: process.env.THIRDWEB_SERVER_WALLET_ADDRESS!,
    network: baseSepolia,
    price: {
        amount: "10000",
        asset: {
            address: "0x036CbD53842c5426634e7929541ec2318f3dcf7e,"
        },
    },
    facilitator: thirdwebX402Facilitator,
  });
 
  if (result.status === 200) {
    // payment verified and settled successfully
    return Response.json({ data: "premium content" });
  } else {
    // Payment required
    return Response.json(result.responseBody, {
      status: result.status,
      headers: result.responseHeaders,
    });
  }
}
