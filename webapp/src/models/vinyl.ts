import { model, Schema } from "mongoose";

export interface iVinyl {
  title: string;
  releaseDate: Date;
  state: string;
  price: number;
  stock: number;
  genre: string;
  group: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const vinylSchema = new Schema<iVinyl>({
  title: {
    type: "String",
  },
  releaseDate: {
    type: "Date",
  },
  state: {
    type: "String",
  },
  price: {
    type: "Number",
  },
  stock: {
    type: "Number",
  },
  genre: {
    type: "String",
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: "groups",
  },
  createdAt: {
    type: "Date",
  },
  updatedAt: {
    type: "Date",
  },
});

const Vinyl = model<iVinyl>("vinyls", vinylSchema);

export { Vinyl };
