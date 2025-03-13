//@ts-ignore
import { exec } from "node:child_process";

export function open(client:any) {
//@ts-ignore
  client.send(JSON.stringify({ command: "initial_cwd", data: null, path: Deno.cwd() }));
  console.log("Client connesso");
}

export function message(client:any, data:any) {
  const cmd:string = data.toString().trim();
  
//   const timeoutId = setTimeout(() => {
//     console.log(`Command timeout: ${cmd}`);
//     client.send(JSON.stringify({ 
//       command: `${cmd}:timeout`, 
//       data: "Command timed out after 30 seconds", 
//       //@ts-ignore
//       path: Deno.cwd(),
//       error: true 
//     }));
//   }, 30000); // 30 second timeout
  
  try {
    if(cmd.startsWith("cd")){
        const dir = cmd.split(" ")[1];
        //@ts-ignore
        Deno.chdir(dir)
        client.send(JSON.stringify({ 
            command: `${cmd}:response`, 
            data: "", 
            //@ts-ignore
            path: Deno.cwd() ,
            error:data
          }));
        return;
    }
    exec(cmd, { maxBuffer: 1024 * 1024 * 10, timeout: 25000 }, (error, stdout, stderr) => {
      // Clear the timeout since the command completed (either successfully or with an error)
    //   clearTimeout(timeoutId);
      
      if (error) {
        client.send(JSON.stringify({ 
          command: `${cmd}:error`, 
          data: error.message, 
          //@ts-ignore
          path: Deno.cwd(),
          error: error.toString()
        }));
        return;
      }
      
      if (stderr && stderr.trim() !== "") {
        client.send(JSON.stringify({ 
          command: `${cmd}:stderr`, 
          data: stderr.trim(), 
          //@ts-ignore
          path: Deno.cwd(),
          error: stderr.toString()
        }));
        return;
      }
      
      // Success case
      client.send(JSON.stringify({ 
        command: `${cmd}:response`, 
        data: stdout.trim(), 
        //@ts-ignore
        path: Deno.cwd() ,
        error:data
      }));
    });
  } catch (e:any) {
    // Handle any synchronous exceptions
    // clearTimeout(timeoutId);
    console.log(`Command exception: ${e.message}`);
    client.send(JSON.stringify({ 
      command: `${cmd}:exception`, 
      data: e.message, 
      //@ts-ignore
      path: Deno.cwd(),
      error: "true" 
    }));
  }
}

export function onError(err:any) {
  console.log(`Connection error ${err.message}`);
}

export function onClosed() {
  console.log("Connection closed");
}