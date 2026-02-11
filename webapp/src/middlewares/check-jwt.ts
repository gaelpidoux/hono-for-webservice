import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
import { JwtTokenExpired } from "hono/utils/jwt/types";
import { UNAUTHORIZED } from "@/shared/constants/http-status-codes";
import env from "../../env";

export const isJwtValid = createMiddleware(async (c, next) => {
  const headers = c.req.header("Authorization");
  const extractedToken = headers?.split(" ").at(1); // Assuming "Bearer
  if (!extractedToken) {
    return c.json({ msg: "No token provided" }, UNAUTHORIZED);
  }
  try {
    const decodedPayload = await verify(extractedToken, env.JWT_SECRET, "HS256");
    console.log("Decoded JWT Payload:", decodedPayload);
    c.req.user = decodedPayload; // Attach decoded payload to request object for downstream use
    await next();
  }
  catch (error) {
    if (error instanceof JwtTokenExpired) {
      console.error("Expired token");
      // see > https://hono.dev/docs/helpers/jwt#custom-error-types
    }
    return c.json({ msg: "Invalid token" }, UNAUTHORIZED);
  }
});
