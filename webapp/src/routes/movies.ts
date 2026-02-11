import { Hono } from "hono";
import { every } from "hono/combine";
import { isJwtValid } from "@/middlewares/check-jwt";
import { isValidObjectIdMiddleware } from "@/middlewares/is-object-id";
import { rbacGuard } from "@/middlewares/rbac-guard";
import { Movie } from "@/models/movies";
import { movieService } from "@/services/movies-service";
import { CREATED, NO_CONTENT, NOT_FOUND } from "@/shared/constants/http-status-codes";

const api = new Hono();

api.get("/", async (c) => {
  const allMovies = await movieService.fetchAll(c.req);
  c.res.headers.set("X-Count", `${allMovies.xCount}`);
  return c.json(allMovies.data);
});

api.get("/:id", isValidObjectIdMiddleware, async (c) => {
  const oneMovie = await movieService.fetchById(c.req);
  if (!oneMovie) {
    return c.json({ message: "Movie not found" }, NOT_FOUND);
  }
  return c.json(oneMovie);
});

api.get("/:id/comments", isValidObjectIdMiddleware, async (c) => {
  // TODO: fetch comments for a movie
  const oneMovie = await movieService.fetchById(c.req);
  if (!oneMovie) {
    return c.json({ message: "Movie not found" }, NOT_FOUND);
  }
  return c.json(oneMovie);
});

api.post("/", every(isJwtValid, rbacGuard), async (c) => {
  const body = await c.req.json();

  return c.json(body, CREATED);
});

api.patch("/:id", isValidObjectIdMiddleware, async (c) => {
  // const { id } = c.req.param();
  //  const updatedData = await c.req.json<IBook>();
  // const tryToUpdate =  await Book.findByIdAndUpdate(id,updatedData,{ new: true });
  // c
  // if(!tryToUpdate){
  //   return c.json({message: "Book not found"}, NOT_FOUND);
  // }
  // return c.json(tryToUpdate, PARTIAL_CONTENT);
});

api.delete("/:id", isValidObjectIdMiddleware, async (c) => {
  const { id } = c.req.param();
  const tryToDelete = await Movie.findByIdAndDelete(id);

  if (!tryToDelete) {
    return c.json({ message: "Movie not found" }, NOT_FOUND);
  }
  return c.status(NO_CONTENT);
});

export default api;
