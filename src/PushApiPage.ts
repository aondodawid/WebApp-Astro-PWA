import { v4 as uuidv4 } from "uuid";
import { auth } from "./firebaseConfig";
import { sendMessageToDevice } from "./firebaseUtils";
// import { AUTH_PASS, AUTH_USER } from "../pwa.config.json";
import pwaOptions from "../pwa.config.json";

type PWAOptions = {
  AUTH_PASS: string;
  AUTH_USER: string;
};
const { AUTH_USER, AUTH_PASS } = pwaOptions as PWAOptions;

export default async function getData(context: APIContext) {
  const { url } = context;
  const checkUuid = url.searchParams.get("checkUuid") || "";
  const uuidParams = url.searchParams.get("uuid") || "";
  const isTokenList = url.searchParams.get("isTokenList") || "";
  const password = url.searchParams.get("password") || "";
  const remove = url.searchParams.get("remove") || "";
  const user = url.searchParams.get("user") || "";

  const title = url.searchParams.get("title") || "Push Notification";
  const bodyParams = url.searchParams.get("body") || "";
  const icon = url.searchParams.get("icon") || "";
  const tokenParams = url.searchParams.get("token");
  const tokensArray = tokenParams ? JSON.parse(tokenParams) : [];

  const message = {
    notification: {
      title: title,
      body: bodyParams,
      image: icon,
    },
    tokens: tokensArray,
  };

  let res;

  async function setToken(uuid: string) {
    try {
      const token = await auth.createCustomToken(uuid);
      await context.session?.set("wepAppToken", token);
      return token;
    } catch (error) {
      console.log("Error creating custom token:", error);
      return new Response("Unauthorized", { status: 401 });
    }
  }

  if (remove && remove === "true") {
    await context.session?.set("wepAppUuid", uuidv4());

    return new Response(`{"ok": true, "removed": true }`, { status: 200 });
  }
  if (password !== "" && user !== "") {
    if (password !== AUTH_PASS || user !== AUTH_USER)
      return new Response("Unauthorized", { status: 401 });

    const uuid = uuidv4();
    await context.session?.set("wepAppUuid", uuid);

    setToken(uuid);

    return new Response(`{"uuid":"${uuid}","ok": true }`, { status: 200 });
  }
  if (!uuidParams) return new Response("Unauthorized", { status: 401 });
  const uuid = await context.session?.get("wepAppUuid");

  if (checkUuid && checkUuid === "true" && uuidParams === uuid) {
    const token = await context.session?.get("wepAppToken");

    return new Response(`{"uuid":"${uuid}","ok": true, "token": "${token}" }`, {
      status: 200,
    });
  }
  if (uuidParams !== uuid) return new Response("Unauthorized", { status: 401 });
  if (isTokenList && isTokenList === "true") {
    const token = await context.session?.get("wepAppToken");
    if (!token) return new Response("Unauthorized", { status: 401 });
    return new Response(`{"uuid":"${uuid}","ok": true, "token": "${token}" }`, {
      status: 200,
    });
  }

  res = await sendMessageToDevice(message);

  return new Response(JSON.stringify(res));
}
