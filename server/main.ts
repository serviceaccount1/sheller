//@ts-ignore
import { WebSocketServer } from "npm:ws";

let connected = false;
const server = new WebSocketServer({
  port: 8080,
});

function message(data:any, socket:any) {
  const res = Respose.fromString(data.toString())
  console.log(res.data)
  const cmd = prompt(`${res.path.trim()}$`);
  socket.send(cmd);
}

function open(socket:any, req:any) {

  if(connected){
    socket.close();
  }else{
    connected = true;
    socket.on("message", (data:any) => message(data, socket));
  }

}

server.on("connection", open);



export class Respose {

  constructor(public command:string,public data:string,public path:string, public error:string) {
    this.command = command;
    this.data = data;
    this.path = path;
    this.error = error;
  }

  static fromString(data:string):Respose{

    const parsed =  JSON.parse(data);
    if(isClear(parsed)){
        console.log(parsed["data"])
    }
    return new Respose(parsed["command"], parsed["data"], parsed["path"],parsed["error"]);
  }
}



const isClear = (cmd:any) => cmd["command"] == "clear:response" || cmd["command"] == "cls:response";