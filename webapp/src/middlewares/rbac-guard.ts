import { createMiddleware } from "hono/factory";
import { auth } from "hono/utils/basic-auth";
import { userService } from "@/services/users-service";
import { FORBIDDEN } from "@/shared/constants/http-status-codes";

export const rbacGuard = createMiddleware(async (c, next) => {
  // si je suis ici, j'ai la garanti que mon jwt est setté et valide

  console.log(c.req.user);
  const ressource = c.req.path.split("/")[3]; // "movies"
  const method = c.req.method; // "GET", "POST" ...
  console.log(`ressource to check: ${ressource}, method to check: ${method}`);
  const connectedUser = await userService.fetchRoleByUserId({ _id: c.req.user.sub });
  console.log(connectedUser);
  const { roles } = connectedUser;
  const [firstRole] = roles;
  const { authorizations } = firstRole;
  const foundRules = authorizations.find(auth => auth.ressource === ressource);
  if (!foundRules) {
    return c.json({ msg: "Forbidden" }, FORBIDDEN);
  }
  // Attention > PATCH == PUT
  // HEAD == GET
  const isAuthorized = foundRules.permissions.full.includes(method);
  console.log("isAuthorized", isAuthorized);
  if (!isAuthorized) {
    return c.json({ msg: "Forbidden" }, FORBIDDEN);
  }
  await next();
});
