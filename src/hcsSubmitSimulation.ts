import dotenv from "dotenv";
import { submitMessageToTopic } from "./hcsFunction";

dotenv.config();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function simulateSubmitSimulation() {
  try {
    console.log("Deposit transaction created by user.");
    await sleep(1500);

    console.log("Deposit transaction paid by user.");
    await sleep(1000);

    console.log("User opened proof of transaction.");
    const openProofPayload = {
      transactionId: "transactionId_Dummy",
      event: "DEPOSIT",
      btcAddress: "bc1_btcAddress_Dummy",
      status: "PAID",
      xenditTxId: "xenditTxId_Dummy",
      idrAmount: 199000,
      confirmedAt: new Date().toISOString(),
    };
    const openMessageId = await submitMessageToTopic(openProofPayload);
    console.log("Message for OPEN proof submitted successfully with ID:", openMessageId);
    await sleep(3000);

    console.log("Token is being transferred on-chain to the user.");
    await sleep(1000);

    console.log("Waiting for transaction confirmation...");
    await sleep(2000);

    console.log("Transaction confirmed on-chain.");
    await sleep(1000);

    console.log("BitVault is closing proof of transaction.");
    const closeProofPayload = {
      transactionId: "transactionId_Dummy",
      event: "DEPOSIT",
      status: "COMPLETED",
      btcTxHash: "0abcdef_Dummy",
      btcTxAmount: 0.1,
      btcAddress: "bc1_btcAddress_Dummy",
      confirmedAt: new Date().toISOString(),
      hcsProof: openMessageId,
    };
    const closeMessageId = await submitMessageToTopic(closeProofPayload);
    console.log("Message for CLOSE proof submitted successfully with ID:", closeMessageId);
  } catch (error) {
    console.error("Error submitting message:", error);
  }
}

simulateSubmitSimulation();
