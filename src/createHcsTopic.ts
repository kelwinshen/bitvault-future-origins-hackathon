// create-topic.ts
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
