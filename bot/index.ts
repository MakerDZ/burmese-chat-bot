import { Bot, InlineKeyboard } from 'grammy';
import { ConvexClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';

const client = new ConvexClient(process.env['CONVEX_URL']!);
const bot = new Bot(process.env.BOT_TOKEN!);

console.log('Bot is running...');

bot.command('start', (ctx) => {
    client.mutation(api.user.createUser, {
        telegramId: ctx.from?.id.toString() ?? '',
        name: ctx.from?.first_name ?? '',
        username: ctx.from?.username ?? '',
    });
    const keyboard = new InlineKeyboard()
        .webApp('🙊 chat မယ်', process.env.APP_BASE_URL!)
        .row()
        .webApp(
            '⚙️ profile setup လုပ်မယ်',
            `${process.env.APP_BASE_URL}/profile`
        );

    return ctx.reply(
        `😺 Meow !!

"Chat မယ်" ဆိုတဲ့ ခလုပ်ကိုနှိပ်ပြီး စကားစပြောနိုင်ပါတယ်။`,
        { reply_markup: keyboard }
    );
});

bot.start();
