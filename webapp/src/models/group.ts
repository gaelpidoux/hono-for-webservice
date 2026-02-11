import { model, Schema } from "mongoose";

export interface iGroup {
  name: string;
  genre: string;
  createdAt: Date;
}

const groupSchema = new Schema<iGroup>({
  name: {
    type: "String",
  },
  genre: {
    type: "String",
  },
  createdAt: {
    type: "Date",
  },
});

const Group = model<iGroup>("groups", groupSchema);

export { Group };
