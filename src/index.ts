import { run } from "@grammyjs/runner";
import { Bot, GrammyError } from "grammy";

import { handleBalance } from "./handlers/balance";
import { handleBusiness } from "./handlers/business";
import { handleHelp } from "./handlers/help";
import { handleMessage } from "./handlers/message";
import { handleNickname } from "./handlers/nickname";
import { handleProfile } from "./handlers/profile";
import { handleStart } from "./handlers/start";
import { handleTomatoFarm } from "./handlers/tomato-farm";
import { handleSellTomatoes, handleTomatoes } from "./handlers/tomatoes";

const TOKEN = process.env["TOKEN"];
if (!TOKEN) throw new Error("Missing TOKEN env variable");

const bot = new Bot(TOKEN);

const m = bot.on("message");

bot.on("message", async (ctx, next) => {
  await handleMessage(ctx.from);
  return await next();
});

m.command("start", handleStart);

m.hears(["помощь", "Помощь"], handleHelp);
m.command("help", handleHelp);

m.hears(["б", "баланс", "Б", "Баланс"], handleBalance);
m.command("balance", handleBalance);

m.hears(["профиль", "Профиль"], handleProfile);
m.command("profile", handleProfile);

m.hears(["бизнес", "Бизнес"], (ctx) => handleBusiness(ctx));
m.command("business", (ctx) => handleBusiness(ctx));

m.hears(["бизнес собрать", "Бизнес собрать"], (ctx) =>
  handleBusiness(ctx, "collect"),
);
m.hears(["бизнес улучшить", "Бизнес улучшить"], (ctx) =>
  handleBusiness(ctx, "upgrade"),
);

m.hears(["ферма", "Ферма"], (ctx) => handleTomatoFarm(ctx));
m.command("farm", (ctx) => handleTomatoFarm(ctx));

m.hears(["ферма собрать", "Ферма собрать"], (ctx) =>
  handleTomatoFarm(ctx, "collect"),
);
m.hears(["ферма улучшить", "Ферма улучшить"], (ctx) =>
  handleTomatoFarm(ctx, "upgrade"),
);

m.hears(["помидоры", "Помидоры"], handleTomatoes);
m.command("tomatoes", handleTomatoes);

m.hears(["помидоры продать", "Помидоры продать"], (ctx) =>
  handleSellTomatoes(ctx),
);

m.hears(["ник", "никнейм", "/nick", "/nickname"], (ctx) => handleNickname(ctx));
m.hears(/^(?:ник|никнейм|\/nick|\/nickname)\s+(.+)$/i, (ctx) =>
  handleNickname(ctx, ctx.match[1]),
);

void bot.api.setMyCommands([
  { command: "help", description: "Помощь" },
  { command: "profile", description: "Профиль" },
  { command: "balance", description: "Баланс" },
  { command: "business", description: "Бизнес" },
  { command: "farm", description: "Ферма" },
  { command: "tomatoes", description: "Помидоры" },
]);

const runner = run(bot);
const stopRunner = () => runner.isRunning() && runner.stop();

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else {
    console.error("Unknown error:", e);
  }
});

process.once("SIGINT", stopRunner);
process.once("SIGTERM", stopRunner);
