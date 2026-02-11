import { Hono } from "hono";
import { notFound } from "@/middlewares/not-found";
import auth from "@/routes/auth";
import vinyl from "@/routes/vinyl"; 
import group from "@/routes/group"; 
import roles from "@/routes/roles";

const app = new Hono({ strict: false }).basePath("/v1/api");

app.get("/", (c) => {
  return c.text("Hello Hono FF");
});
app.route("/vinyls", vinyl); // > donc v1/api/vinyls
app.route("/groups", group); // > donc v1/api/groups
app.route("/auth", auth); // > donc v1/api/auth
app.route("/roles", roles); // > donc v1/api/roles
app.notFound(notFound);

export default app;
