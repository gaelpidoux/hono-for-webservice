import type { IVinyl } from "@/models/vinyl";
import { queryBuilder } from "@/lib/mongo-query-builder";
import { Vinyl } from "@/models/vinyl";

export const vinylService = {

  fetchAll: async (req): Promise<any> => {
    const {
      filter,
      projection,
      options,
    } = queryBuilder.buildFind({ query: req.query() });

    const xCount = await Vinyl.countDocuments(filter);

    const data: IVinyl[] = await Vinyl.find(
      filter,
      projection,
      options
    ).populate("group");

    return {
      data,
      xCount,
    };
  },

  fetchById: async (req): Promise<IVinyl | null> => {
    const { id } = req.param();
    return await Vinyl.findById(id).populate("group");
  },

  updateOne: async (req): Promise<IVinyl | null> => {
    const { id } = req.param();
    const body = await req.json();

    return await Vinyl.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
  },

  createOne: async (req): Promise<IVinyl> => {
    const body = await req.json();
    return await Vinyl.create(body);
  },

};
