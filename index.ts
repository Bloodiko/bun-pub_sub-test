const usernames = ["Alice", "Bob", "Charlie", "Dave", "Eve", "Frank"];

let wsCounter = 0;

const server = Bun.serve<{ username: string }>({
  fetch(req, server) {
    const success = server.upgrade(req, {
      data: {
        username:
          usernames[wsCounter % usernames.length] +
          Math.floor(wsCounter++ / usernames.length),
      },
    });
    if (success) return undefined;

    return new Response("Hello world");
  },
  websocket: {
    open(ws) {
      const msg = `${ws.data.username} has entered the chat`;

      ws.send(`This websocket got the Username: ${ws.data.username}`);

      console.log(`Websocket opened with user ${ws.data.username}`);
      ws.subscribe("the-group-chat");
      if (ws.data.username === "Charlie0") {
        ws.unsubscribe("the-group-chat"); // Explicitly unsubscribe to test what happens when a user is not subscribed and sends a message
      }
      ws.publish("the-group-chat", msg);
      server.publish("the-group-chat", `ServerPublished: ${msg}`);
      console.log(`Websocket opened with user ${ws.data.username} published.`);
    },
    message(ws, message) {
      // the server re-broadcasts incoming messages to everyone
      console.log(
        `Message in ws with user ${ws.data.username} recieved: `,
        message
      );
      ws.publish("the-group-chat", `${ws.data.username}: ${message}`);
      server.publish(
        "the-group-chat",
        `ServerPublished: ${ws.data.username}: ${message}`
      );
      console.log(
        `Message from ws with user ${ws.data.username} published: `,
        message
      );
    },
    close(ws) {
      const msg = `${ws.data.username} has left the chat`;

      console.log("Websocket Closed with message: ", msg);
      ws.publish("the-group-chat", msg);
      server.publish("the-group-chat", `ServerPublished: ${msg}`);
      ws.unsubscribe("the-group-chat");
    },
  },
});

console.log(`Listening on ${server.hostname}:${server.port}`);
