import { MessageEmbed } from "discord.js";

import { QuoteList } from "../config/QuoteList";

/**
 * Module to fetch a random quote and generate a Discord embed.
 *
 * @returns {MessageEmbed} A Discord embed with a random quote.
 */
export const generateQuoteEmbed = (): MessageEmbed => {
  const randomQuote = QuoteList[Math.floor(Math.random() * QuoteList.length)];
  const embed = new MessageEmbed();
  embed.setTitle("Daily Inspiration!");
  embed.setDescription(randomQuote.text.replace(/\\n/g, "\n"));
  embed.addField("Author", randomQuote.author);
  embed.setFooter({
    text: "Finding this bot useful? Support us! https://donate.nhcarrigan.com",
    iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
  });
  return embed;
};
