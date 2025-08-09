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
