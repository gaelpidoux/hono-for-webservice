import { Hono } from "hono";
import { every } from "hono/combine";
import { isJwtValid } from "@/middlewares/check-jwt";
import { isValidObjectIdMiddleware } from "@/middlewares/is-object-id";
import { rbacGuard } from "@/middlewares/rbac-guard";
import { Group } from "@/models/group";
import { groupService } from "@/services/group-service";
import { CREATED,NO_CONTENT,NOT_FOUND} from "@/shared/constants/http-status-codes";

const api = new Hono();

/**
 * GET
 */
api.get("/", async (c) => {
  const allGroups = await groupService.fetchAll(c.req);
  return c.json(allGroups);
});

api.get("/:id", isValidObjectIdMiddleware, async (c) => {
  const oneGroup = await groupService.fetchById(c.req);

  if (!oneGroup) {
    return c.json({ message: "Group not found" }, NOT_FOUND);
  }

  return c.json(oneGroup);
});

/**
 * GET /groups/:id/vinyls
 */
api.get("/:id/vinyls", isValidObjectIdMiddleware, async (c) => {
  const vinyls = await groupService.fetchVinylsByGroup(c.req);
  return c.json(vinyls);
});

/**
 * POST
 */
api.post("/", every(isJwtValid, rbacGuard), async (c) => {
  const createdGroup = await groupService.createOne(c.req);
  return c.json(createdGroup, CREATED);
});

/**
 * PATCH
 */
api.patch("/:id", isValidObjectIdMiddleware, async (c) => {
  const updated = await groupService.update(c.req);

  if (!updated) {
    return c.json({ message: "Group not found" }, NOT_FOUND);
  }

  return c.json(updated);
});

/**
 * DELETE
 */
api.delete("/:id", isValidObjectIdMiddleware, async (c) => {
  const { id } = c.req.param();
  const tryToDelete = await Group.findByIdAndDelete(id);

  if (!tryToDelete) {
    return c.json({ message: "Group not found" }, NOT_FOUND);
  }

  return c.body('delete ok', NO_CONTENT);

});

export default api;
