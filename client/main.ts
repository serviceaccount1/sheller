// @ts-ignore
import ws from "npm:ws";
import { message, open,onError, onClosed } from "./controllers.ts";

const client = new ws("ws://localhost:8080");

client.on("open",()=> open(client));

client.on("message", (data:string)=>message(client,data));

client.on("error", (err:any) =>onError(err));

client.on("close", onClosed);


