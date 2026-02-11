import env from "../../env";

const queryBuilder = {
  buildFind({ query = {} }: { query?: Record<string, any> } = {}) {
    const {
      sort = false,
      limit = env.API_DEFAUT_LIMIT,
      fields,
      embed,
      page = 1,
      priceMin,
      priceMax,
      ...rest
    } = query;

    const mongooseQuery = this.extractQuery({
      ...rest,
      priceMin,
      priceMax,
    });

    const mongooseSort = this.extractSort(sort);
    const mongooseLimit = this.extractLimit(limit);
    const mongooseSkip = this.extractSkip(page, limit);
    const mongooseProjection = this.extractSimpleProjection(fields);
    const mongooseEmbed = this.extractEmbed(embed);

    const findObjectParams = {
      filter: mongooseQuery,
      projection: mongooseProjection,
      options: {
        ...mongooseSort,
        ...mongooseEmbed,
        limit: mongooseLimit.limit,
        skip: mongooseSkip?.skip,
      },
    };

    return findObjectParams;
  },

 
  extractQuery(queryRest: Record<string, any>) {
    const filter: Record<string, any> = {};

    const { priceMin, priceMax, ...rest } = queryRest;

    // filtres simples (state, genre, group…)
    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        filter[key] = value;
      }
    });

    // gestion intervalle prix
    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = Number(priceMin);
      if (priceMax) filter.price.$lte = Number(priceMax);
    }

    return filter;
  },

  extractSort(sort: string | false) {
    const sortOptions: Record<string, number> = {};

    if (sort) {
      if (sort.startsWith("-")) {
        const cleanParam = sort.slice(1);
        sortOptions[cleanParam] = -1;
      } else {
        sortOptions[sort] = 1;
      }
    }

    return { sort: sortOptions };
  },

  extractLimit(pLimit: number) {
    const limit = pLimit ?? env.API_DEFAUT_LIMIT;
    return { limit: Number(limit) };
  },

  extractSkip(page: number, pLimit: number) {
    const limit = pLimit ?? env.API_DEFAUT_LIMIT;

    if (page && page > 1) {
      return { skip: (page - 1) * limit };
    }
  },

  extractSimpleProjection(fields: string | undefined) {
    const projOptions: Record<string, number> = {};

    if (fields) {
      const fieldsList = fields.split(",");

      fieldsList.forEach((field) => {
        if (field.startsWith("-")) {
          projOptions[field.slice(1)] = 0;
        } else {
          projOptions[field] = 1;
        }
      });
    }

    return projOptions;
  },

  extractEmbed(embed: string | undefined) {
    if (!embed) return {};

    return {
      populate: { path: embed },
    };
  },
};

export { queryBuilder };
