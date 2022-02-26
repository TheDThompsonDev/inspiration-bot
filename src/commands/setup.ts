import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildBasedChannel } from "discord.js";

import InspirationModel from "../database/models/Inspiration";
import { Command } from "../interfaces/Command";
import { getDateStamp } from "../modules/getDateStamp";
import { scheduleInspiration } from "../modules/scheduleInspiration";
import { errorHandler } from "../utils/errorHandler";

export const setup: Command = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Set up your daily inspirations.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to post inspirations in.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("utc-hour")
        .setDescription("The hour, **in UTC**, to post your inspiration")
        .setMinValue(0)
        .setMaxValue(23)
        .setRequired(true)
    ),
  run: async (interaction, BOT) => {
    try {
      await interaction.deferReply();
      const { guild, member } = interaction;
      const targetChannel = interaction.options.getChannel("channel", true);
      const targetHour = interaction.options.getInteger("utc-hour", true);
      if (!guild || !member) {
        await interaction.editReply(
          "Did not receive the guild or member objects. Please try again."
        );
        return;
      }

      if (
        typeof member.permissions === "string" ||
        !member.permissions.has("MANAGE_GUILD")
      ) {
        await interaction.editReply(
          "You do not have the permissions to use this command."
        );
        return;
      }

      if (
        !["GUILD_TEXT", "GUILD_NEWS"].includes(targetChannel.type as string)
      ) {
        await interaction.editReply(
          "The channel you specified is not a text channel."
        );
        return;
      }

      if (
        !guild.me
          ?.permissionsIn(targetChannel as GuildBasedChannel)
          .has("SEND_MESSAGES") ||
        !guild.me
          ?.permissionsIn(targetChannel as GuildBasedChannel)
          .has("EMBED_LINKS")
      ) {
        await interaction.editReply(
          "I do not have the permissions to send messages or embed links in the channel you specified."
        );
        return;
      }

      const serverData =
        (await InspirationModel.findOne({ serverId: guild.id })) ||
        (await InspirationModel.create({
          serverId: guild.id,
          channelId: targetChannel.id,
          hour: targetHour,
        }));

      serverData.channelId = targetChannel.id;
      serverData.hour = targetHour;
      await serverData.save();

      await interaction.editReply(
        `You will receive daily inspirations in <#${
          targetChannel.id
        }> at ${getDateStamp(targetHour)}.`
      );
      await scheduleInspiration(serverData, BOT);
    } catch (err) {
      errorHandler("setup command", err);
      await interaction.editReply(
        "Something went wrong! Join our support server for assistance: https://chat.nhcarrigan.com"
      );
    }
  },
};
