import { Hono } from "hono";
import { every } from "hono/combine";
import { isJwtValid } from "@/middlewares/check-jwt";
import { isValidObjectIdMiddleware } from "@/middlewares/is-object-id";
import { rbacGuard } from "@/middlewares/rbac-guard";
import { Vinyl } from "@/models/vinyl";
import { vinylService } from "@/services/vinyl-service";
import {
  CREATED,
  NO_CONTENT,
  NOT_FOUND,
} from "@/shared/constants/http-status-codes";

const api = new Hono();

/**
 * GET ALL VINYLS
 * Tout
 */
api.get(
  "/",
  every(isJwtValid, rbacGuard),
  async (c) => {
    const allVinyls = await vinylService.fetchAll(c.req);

    c.res.headers.set("X-Count", `${allVinyls.xCount}`);

    return c.json(allVinyls.data);
  }
);

/**
 * GET 
 */
api.get(
  "/:id",
  every(isJwtValid, rbacGuard),
  isValidObjectIdMiddleware,
  async (c) => {
    const oneVinyl = await vinylService.fetchById(c.req);

    if (!oneVinyl) {
      return c.json({ message: "Vinyl not found" }, NOT_FOUND);
    }

    return c.json(oneVinyl);
  }
);

/**
 * POST CREATE 
 */
api.post(
  "/",
  every(isJwtValid, rbacGuard),
  async (c) => {
    const createdVinyl = await vinylService.createOne(c.req);

    return c.json(createdVinyl, CREATED);
  }
);

/**
 * PATCH UPDATE 
 */
api.patch(
  "/:id",
  every(isJwtValid, rbacGuard),
  isValidObjectIdMiddleware,
  async (c) => {
    const updated = await vinylService.updateOne(c.req);

    if (!updated) {
      return c.json({ message: "Vinyl not found" }, NOT_FOUND);
    }

    return c.json(updated);
  }
);

/**
 * DELETE 
 */
api.delete(
  "/:id",
  every(isJwtValid, rbacGuard),
  isValidObjectIdMiddleware,
  async (c) => {
    const { id } = c.req.param();

    const tryToDelete = await Vinyl.findByIdAndDelete(id);

    if (!tryToDelete) {
      return c.json({ message: "Vinyl not found" }, NOT_FOUND);
    }

    return c.body('deleted ok', NO_CONTENT);
  }
);

export default api;
