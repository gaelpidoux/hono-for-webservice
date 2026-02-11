import type { IGroup } from "@/models/group";
import { queryBuilder } from "@/lib/mongo-query-builder";
import { Group } from "@/models/group";
import { Vinyl } from "@/models/vinyl";

export const groupService = {

  fetchAll: async (req): Promise<any> => {
    const {
      filter,
      projection,
      options,
    } = queryBuilder.buildFind({ query: req.query() });

    const xCount = await Group.countDocuments(filter);

    const data: IGroup[] = await Group.find(
      filter,
      projection,
      options
    );

    return {
      data,
      xCount,
    };
  },

  fetchById: async (req): Promise<IGroup | null> => {
    const { id } = req.param();
    return await Group.findById(id);
  },

  fetchVinylsByGroup: async (req): Promise<any> => {
    const { id } = req.param();

    const {
      filter,
      projection,
      options,
    } = queryBuilder.buildFind({ query: req.query() });

    filter.group = id;

    const xCount = await Vinyl.countDocuments(filter);

    const data = await Vinyl.find(
      filter,
      projection,
      options
    );

    return {
      data,
      xCount,
    };
  },

  update: async (req): Promise<IGroup | null> => {
    const { id } = req.param();
    const body = await req.json();

    return await Group.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
  },

    createOne: async (req) => {
    const body = await req.json();
    return await Group.create(body);
    }

};
