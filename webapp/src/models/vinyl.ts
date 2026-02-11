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
    type: String,
    enum: ["new", "ok", "used"],
    required: true,
  },
  price: {
    type: "Number",
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"]
  },
  stock: {
    type: "Number",
    required: true,
    min: [0, "Stock cannot be negative"]
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
