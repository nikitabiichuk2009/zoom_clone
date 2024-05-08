"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const secret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
  const user = await currentUser();
  if (!user) {
    throw new Error("User is not logged in.");
  }
  if (!apiKey) {
    throw new Error("No apiKey");
  }
  if (!secret) {
    throw new Error("No secret");
  }
  const streamClient = new StreamClient(apiKey, secret);
  // exp is optional (by default the token is valid for an hour)
  const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;
  const issued = Math.floor(Date.now() / 1000) - 60;
  const token = streamClient.createToken(user.id, exp, issued);
  return token;
};
