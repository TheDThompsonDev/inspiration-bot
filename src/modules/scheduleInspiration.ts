import { Client } from "discord.js";
import { scheduleJob } from "node-schedule";

import { Inspiration } from "../database/models/Inspiration";
import { errorHandler } from "../utils/errorHandler";
import { logHandler } from "../utils/logHandler";

import { generateQuoteEmbed } from "./generateQuoteEmbed";

/**
 * Module to schedule daily inspiration posts.
 *
 * @param {Inspiration} settings The server's settings from the database.
 * @param {Client} BOT The bot's Discord instance.
 */
export const scheduleInspiration = async (
  settings: Inspiration,
  BOT: Client
) => {
  try {
    const { serverId, channelId, hour } = settings;
    const server = await BOT.guilds.fetch(serverId);
    const channel = await server.channels.fetch(channelId);

    if (!channel || !("send" in channel)) {
      throw new Error(`Missing channel ${channelId} for server ${server.name}`);
    }
    scheduleJob(`0 0 ${hour} * * *`, async () => {
      try {
        logHandler.log(
          "debug",
          `Sending inspiration to ${channel.name} in ${server.name}`
        );
        await channel.send({ embeds: [generateQuoteEmbed()] });
      } catch (err) {
        errorHandler("send inspiration", err);
      }
    });
  } catch (err) {
    errorHandler("scheduleInspiration", err);
  }
};
