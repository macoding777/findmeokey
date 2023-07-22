const { Telegraf, Markup } = require("telegraf");
require("dotenv").config();
const User = require("./models/mongoose");
const mongoose = require('mongoose');
const bot = new Telegraf(process.env.TOKEN);


const dbURL = process.env.MONGO_URL;
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

bot.use(async (ctx, next) => {
  const chatId = ctx.message.chat.id;

  try {
    const user = await User.findOne({ chatId });
    if (user && user.isPremium) {
      // Jika pengguna premium, lanjutkan ke handler utama
      return next();
    } else {
      // jika ingin jadi premium /jadipremokey
      if (ctx.message.text === "/jadipremokey") {
        // buat user baru dengan isPremium true
        const newUser = new User({ chatId, isPremium: true });
        await newUser.save();
        // ctx.reply("Selamat! Anda sekarang adalah pengguna premium.");
        ctx.reply("Welcome to Social Catfish!\n\nScan various social network accounts or messaging application accounts from people username or mobile number.\n\nEnter people username or mobile number (+ country code):");

      } else {
        // jika bukan pengguna premium, tampilkan pesan ini
        ctx.reply(
          "Anda bukan pengguna premium."
        );
      }
    }
  } catch (err) {
    console.error('Error checking premium status:', err);
    ctx.reply('Terjadi kesalahan saat memeriksa status premium Anda.');
  }
});


// const keep_alive = require('./keep_alive.js')

bot.start((ctx) => {
  ctx.reply("Welcome to Social Catfish!\n\nScan various social network accounts or messaging application accounts from people username or mobile number.\n\nEnter people username or mobile number (+ country code):");
});

bot.on("text", (ctx) => {
  const username = ctx.message.text;
  if (username.startsWith("+")) {
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.url("WhatsApp", `https://wa.me/${username}`)],
      [Markup.button.url("Telegram", `https://t.me/${username}`)],
      [Markup.button.url("Line", `https://line.me/R/${username}`)],
      [Markup.button.url("WeChat", `https://wechat.com/${username}`)],
    ]);
    ctx.reply(`🔎 Searching ${username} over messaging applications...\n\nSuccess! Messaging application accounts found for ${username}`, keyboard);
  } else {
    // jika dimulai dari / maka akan dianggap sebagai command
    if (username.startsWith("/")) {
      ctx.reply("Invalid Command");
    } else {
      const keyboard = Markup.inlineKeyboard([

        [Markup.button.url("Facebook", `https://facebook.com/${username}`)],
        [Markup.button.url("Messenger", `https://m.me/${username}`)],
        [Markup.button.url("Instagram", `https://instagram.com/${username}`)],
        [Markup.button.url("Twitter", `https://twitter.com/${username}`)],
        [Markup.button.url("Snapchat", `https://www.snapchat.com/add/${username}`)],
        [Markup.button.url("Pinterest", `https://pinterest.com/${username}`)],
        [Markup.button.url("Youtube", `https://youtube.com/${username}`)],
        [Markup.button.url("TikTok", `https://tiktok.com/@${username}`)],
        [Markup.button.url("OnlyFans", `https://onlyfans.com/${username}`)],
      ]);
      ctx.reply(`🔎 Searching ${username} over social networks...\n\nSuccess! Social network accounts found for ${username}`, keyboard);
    }
  }
});

if (process.env.NODE_ENV === "production") {
  bot
    .launch({
      webhook: {
        domain: process.env.REPLIT_URL,
        port: process.env.PORT || 8080,
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