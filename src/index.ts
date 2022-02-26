import { RewriteFrames } from "@sentry/integrations";
import * as Sentry from "@sentry/node";
import { Client } from "discord.js";

import { CommandList } from "./commands/CommandList";
import { IntentOptions } from "./config/IntentOptions";
import { connectDatabase } from "./database/connectDatabase";
import InspirationModel from "./database/models/Inspiration";
import { scheduleInspiration } from "./modules/scheduleInspiration";
import { validateEnv } from "./modules/validateEnv";
import { logHandler } from "./utils/logHandler";
import { registerCommands } from "./utils/registerCommands";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  integrations: [
    new RewriteFrames({
      root: global.__dirname,
    }),
  ],
});

(async () => {
  const BOT = new Client({ intents: IntentOptions });

  const hasEnv = validateEnv();
  if (!hasEnv) {
    logHandler.log("error", "Missing required environment variables.");
    process.exit(1);
  }

  await connectDatabase();

  BOT.on("ready", async () => {
    logHandler.log("debug", "Connected to Discord!");
    await registerCommands();
    const schedules = await InspirationModel.find({});
    for (const schedule of schedules) {
      await scheduleInspiration(schedule, BOT);
    }
  });

  BOT.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
      return;
    }
    const target = CommandList.find(
      (el) => el.data.name === interaction.commandName
    );
    if (!target) {
      return;
    }
    await target.run(interaction, BOT);
  });

  await BOT.login(process.env.DISCORD_TOKEN);
})();
