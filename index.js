const http = require("http"); //create the server
const fs = require("fs"); // handle files
const url = require("url"); // Parse URLs and extract data from them
const port = 3450;
const usersFile = "users.json"; // The file in which we will store user data //This file will save all users in JSON format, and we will use it for reading and writing.
/**[1]
 * Here we check if the users.json file exists or not?
 * fs.existsSync(usersFile): Checks if the file exists.
 * If it does not exist, it will create it and add [] inside it to be an empty array, representing users.
 */
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify([]));
}
const server = http.createServer((req, res) => {
  const parseUrl = url.parse(req.url, true); //Parses the link and converts the Query Parameters into an object.
  const pathname = parseUrl.pathname;
  const method = req.method; // يعطينا نوع الطلب (GET, POST, DELETE...).
  if (pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Welcome to API Home Page</h1>");
  }
  // ------- View all users --------

  // If the request is GET /users, we read data from users.json.
  else if (pathname === "/users" && method === "GET") {
    // fs.readFileSync(usersFile): Read the file.
    const users = JSON.parse(fs.readFileSync(usersFile));
    // JSON.parse(...): Convert the text to a JSON object.
    res.writeHead(200, { "Content-Type": "application/json" });
    // res.end(JSON.stringify(users)): Send the data to the client as JSON.
    res.end(JSON.stringify(users));
  }
  // ------- View data for a specific user --------
  // We check if the request contains an id.
  else if (pathname === "/users" && method === "GET" && parseUrl.query.id) {
    const users = JSON.parse(fs.readFileSync(usersFile));
    const user = users.find((u) => u.id === parseInt(parsedUrl.query.id));

    if (user) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end(" Not Found this user ❌");
    }
  }
  // ------- Add a new user --------
  else if (pathname === "/users" && method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const newUser = JSON.parse(body);
      const users = JSON.parse(fs.readFileSync(usersFile));

      newUser.id = users.length + 1;
      users.push(newUser);
      fs.writeFileSync(usersFile, JSON.stringify(users));

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ message: " add user success ✅!", user: newUser })
      );
    });
  }
  // ------- Delete user --------
  else if (pathname === "/users" && method === "DELETE" && parsedUrl.query.id) {
    let users = JSON.parse(fs.readFileSync(usersFile));
    const newUsers = users.filter((u) => u.id !== parseInt(parsedUrl.query.id));

    if (users.length === newUsers.length) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end(" user is not found ❌ !");
    } else {
      fs.writeFileSync(usersFile, JSON.stringify(newUsers));
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: " Delete Successfull✅ " }));
    }
  }
  // ------- Dealing with non-existent pages --------
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end(" Error ❌ 404 ");
  }
});

server.listen(port, () => {
  console.log("server on");
});
