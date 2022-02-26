import { Document, model, Schema } from "mongoose";

const InspirationSchema = new Schema({
  serverId: String,
  channelId: String,
  hour: Number,
});

export interface Inspiration extends Document {
  serverId: string;
  channelId: string;
  hour: number;
}

export default model<Inspiration>("Inspiration", InspirationSchema);
