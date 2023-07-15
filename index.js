const { Telegraf, Markup } = require("telegraf");
require("dotenv").config();

const bot = new Telegraf(process.env.TOKEN);

bot.start((ctx) => {
  ctx.reply("Selamat datang! Silakan masukkan username yang ingin Anda cari.");
});

bot.on("text", (ctx) => {
  const username = ctx.message.text;
  if (username.startsWith("+")) {
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.url("Whatsapp", `https://wa.me/${username}`)],
      [Markup.button.url("Telegram", `https://t.me/${username}`)],
    ]);
    ctx.reply("Ini adalah nomor telepon.", keyboard);
  } else {
    // jika dimulai dari / maka akan dianggap sebagai command
    if (username.startsWith("/")) {
      bot.command("help", (ctx) => {
        ctx.reply("Silakan masukkan username yang ingin Anda cari.");
      });
    } else {
      const keyboard = Markup.inlineKeyboard([
        [Markup.button.url("Instagram", `https://instagram.com/${username}`)],
        [Markup.button.url("Tiktok", `https://tiktok.com/${username}`)],
        [Markup.button.url("Onlyfans", `https://onlyfans.com/${username}`)],
      ]);
      ctx.reply("Ini adalah username.", keyboard);
    }
  }
});

if (process.env.NODE_ENV === "production") {
  bot
    .launch({
      webhook: {
        domain: process.env.HEROKU_URL,
        port: process.env.PORT || 8000,
      },
    })
    .then(() => {
      console.info(`The bot is running on server`);
    });
} else {
  bot.launch().then(() => {
    console.info(`The bot is running locally`);
  });
}
