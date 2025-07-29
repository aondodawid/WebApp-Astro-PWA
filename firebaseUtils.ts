
import { messaging } from "./firebaseConfig";

async function sendMessageToDevice(message: any) {
  try {
    const response = await messaging.sendEachForMulticast(message);
    const responseMessage = `Successfully sent message: ${response.successCount} successful, ${response.failureCount} failed.`;
    console.log(responseMessage);
    return { message: responseMessage, ok: true, response };
  } catch (error) {
    console.log("Error sending message:", error);
    return error;
  }
}
export { sendMessageToDevice };
