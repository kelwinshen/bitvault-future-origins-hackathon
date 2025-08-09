
# BitVault Proof of Transaction Powered by Hedera Consensus Service (HCS) 

This project demonstrates how BitVault integrates Hedera Consensus Service (HCS) to provide transparent and tamper-proof proof of user transactions on Hedera’s public ledger.

---

## Overview

BitVault leverages Hedera Consensus Service to log critical transaction events immutably. This enhances transparency, trust, and auditability by timestamping and sequencing transaction proofs on Hedera’s decentralized network.

---

## Components

### 1. Create Hedera Consensus Topic

Use the `createHcsTopic.ts` script to create a new Hedera topic where BitVault will submit transaction proofs.

```ts
import dotenv from "dotenv";
import { Client, TopicCreateTransaction } from "@hashgraph/sdk";

dotenv.config();

const myAccountId = process.env.ACCOUNT_ID;
const myPrivateKey = process.env.HEDERA_PRIVATE_KEY;

if (!myAccountId || !myPrivateKey) {
  throw new Error("Missing ACCOUNT_ID or HEDERA_PRIVATE_KEY in .env");
}

async function createTopic() {
  const client = Client.forTestnet().setOperator(myAccountId!, myPrivateKey!);

  const tx = await new TopicCreateTransaction()
    .setTopicMemo("BitVault Transaction Proof")
    .execute(client);

  const receipt = await tx.getReceipt(client);
  console.log(`Topic Created: ${receipt!.topicId!.toString()}`);
}

createTopic();
```

Run this script once to generate a new topic ID. Save the topic ID in your `.env` as `HEDERA_TOPIC_ID`.

---

### 2. Submit Messages to Hedera Topic

The function `submitMessageToTopic` serializes and submits transaction proof messages to Hedera.

```ts
import { Client, TopicMessageSubmitTransaction } from "@hashgraph/sdk";
import dotenv from "dotenv";

dotenv.config();

const client = Client.forTestnet()
  .setOperator(process.env.ACCOUNT_ID!, process.env.HEDERA_PRIVATE_KEY!);

export async function submitMessageToTopic(payload: object) {
  const topicId = process.env.HEDERA_TOPIC_ID;
  const message = JSON.stringify(payload);

  const txResponse = await new TopicMessageSubmitTransaction({
    topicId,
    message,
  }).execute(client);

  const receipt = await txResponse.getReceipt(client);

  if (!receipt.topicSequenceNumber) {
    throw new Error("Failed to submit message to topic");
  }

  const consensusTimestamp = (await txResponse.getRecord(client)).consensusTimestamp;
  const messageId = `${topicId}@${consensusTimestamp.seconds.toString()}.${consensusTimestamp.nanos.toString()}`;

  return messageId;
}
```

This can be called anytime BitVault needs to log or update transaction status on Hedera.

---

### 3. Simulated Flow Example

This simulation demonstrates how BitVault submits “open” and “close” proofs for a deposit transaction.

```ts
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
```

---

## Important Notes

- This project uses Hedera Testnet for demonstration.
- The full production BitVault repository using HCS is not publicly shared due to security concerns.
- Judges can request access as collaborators if needed.
- Alternatively, performing actual transactions on BitVault will showcase this integration live.

---

## Additional Information

Currently, Hedera Consensus Service integration is implemented for a subset of BitVault’s transaction types, primarily deposits using real Indonesian Rupiah payments. Future plans include expanding HCS integration to more transaction types within BitVault to further enhance transparency and auditability.

To see how this works in practice, you can watch the demo video of the live BitVault platform showcasing HCS proofs in action.

[Demo Video](https://bitvault.fun/en)
---

## Setup

Create a `.env` file with the following variables:

```
ACCOUNT_ID=your-hedera-account-id
HEDERA_PRIVATE_KEY=your-hedera-private-key
HEDERA_TOPIC_ID=your-created-topic-id
```

---


## Visit BitVault

To see BitVault in action and experience the Hedera Consensus Service integration live, please visit:

[https://bitvault.fun/en](https://bitvault.fun/en)



---

## Conclusion

Using Hedera Consensus Service, BitVault gains a transparent, decentralized, and immutable way to prove and audit transactions, enhancing user trust and platform security.

---

*Thank you for reviewing this integration. We welcome any questions or feedback.*
