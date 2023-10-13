# bun-pub_sub-test


This is a test of the pub/sub functionality of bun. 

Its just the example from the bun docs, but with a few extra lines to make it work.

I added some console logs to the index.ts file to understand how it works. 

## Findings: 

* You **must** be subscribed to a channel to be able to publish via `ws.publish(channel, msg)`. 
* Your own Websocket will **not** receive the message you publish via `ws.publish(channel, msg)`. 
  * Make sure to display the message for yourself as well if you want to see it.
* To publish a message without being subscribed, use `server.publish(channel, msg)`. (I think this might even be a bug, but its good that its there.)
* Use `server.publish(channel, msg)` to send a message to all subscribers of a channel. 
  * This works even if you are not subscribed to the channel yourself.


### Try it out
Try it in web console with 

```js
let ws1 = new WebSocket("ws://localhost:3000");
let ws2 = new WebSocket("ws://localhost:3000");
let ws3 = new WebSocket("ws://localhost:3000");
ws1.onmessage = (e) => console.log(`Websocket 1: ${e.data}`);
ws2.onmessage = (e) => console.log(`Websocket 2: ${e.data}`);
ws3.onmessage = (e) => console.log(`Websocket 2: ${e.data}`);

setTimeout(() => ws1.send("Hello from Websocket1"), 1000);
setTimeout(() => ws2.send("Hello from Websocket2"), 2000);
setTimeout(() => ws3.send("Hello from Websocket3"), 3000);

```


-------

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.4. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
