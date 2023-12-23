import { Bot, Context, GrammyError, HttpError } from "grammy";
import { autoRetry } from "@grammyjs/auto-retry";
import { run } from "@grammyjs/runner";
import { addJob, cancelJob, getJob } from "./midjourney-api";
import { Message } from "grammy/types";
import { cleanMarkdown } from "./bot_helper";
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const express = require('express');
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const bodyParser = require("body-parser");
// const app = express();
// app.use(bodyParser.json());
if (process.env.CYCLIC_APP_ID) {
    // 
} else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('dotenv').config();
}
export const bot = new Bot(process.env.BOT_TOKEN);

const audioFiles: string[] = [
    '/files/0.mp3',
    '/files/1.mp3',
    '/files/2.mp3',
    '/files/3.mp3',
    '/files/4.mp3'
];

let count: number = 0;

bot.api.config.use(autoRetry());

// app.use(webhookCallback(bot, "express"));
const jobs = [

];
if (process.env.CYCLIC_APP_ID) {
    // app.use(webhookCallback(bot, "express"));
    // app.listen(process.env.PORT || 3000);
} else {
    run(bot);
}

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
      console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
      console.error("Could not contact Telegram:", e);
    } else {
      console.error("Unknown error:", e);
    }
});

bot.on("::mention", async (ctx: Context) => {
    if (count < audioFiles.length - 1) {
        count++;
    } else {
        count = 0;
    }
    ctx.replyWithAudio(
        audioFiles[0]
    );
});

bot.command("generate", async (ctx: Context) => {
    jobs.push([ctx.chat.id, ctx.message.message_id, ctx.match as string]);
    const sent_context: Message.TextMessage = await ctx.reply("*dolphine noises*\\. ", {
        parse_mode: "MarkdownV2",
        reply_to_message_id: ctx.update.message.message_id,

    });
    if (jobs[0][1] === ctx.message.message_id) {
        await contactMidjourney(ctx, sent_context);
    } else {
        const outer_interval = setInterval(async () => {
            if (jobs[0][1] === ctx.message.message_id) {
                await contactMidjourney(ctx, sent_context, outer_interval);
            }
        }, Number(process.env.OUTER_INTERVAL_TIME));
    }
    
    // bot.api.sendPhoto()
});

async function contactMidjourney(ctx: Context, sent_context?: Message.TextMessage, outer_interval?) {
        const add_job_data = await addJob((cleanMarkdown(ctx.match as string) as string));
        let times_updated: number = 0;
        let last_progress_update: number = -1;
        const interval = setInterval(async () => {
            times_updated++;
            const get_job_data = await getJob(add_job_data.id);
            if (get_job_data.state === 'canceled') {
                await cancelJob(add_job_data.id);
                jobs.shift();
                
                try {
                    bot.api.editMessageText(
                        sent_context.chat.id,
                        sent_context.message_id,
                        "*dolphine noises*\\. ich bein fur *error*\\.", {
                            parse_mode: "MarkdownV2"
                        }
                    )
                } catch (e) {
                    console.log(e);
                }
                if (outer_interval) {
                    clearInterval(outer_interval);
                }
                clearInterval(interval);
                return;
            } else if (get_job_data.progress === -1) {
                // JOB NOT YET STARTED
                if (times_updated === 10 || get_job_data.state === 'canceled') {
                    await cancelJob(add_job_data.id);
                    jobs.shift();
                    
                    try {
                        bot.api.editMessageText(
                            sent_context.chat.id,
                            sent_context.message_id,
                            "*dolphine noises*\\. ich bein fur *error*\\.", {
                                parse_mode: "MarkdownV2"
                            }
                        )
                    } catch (e) {
                        console.log(e);
                    }
                    if (outer_interval) {
                        clearInterval(outer_interval);
                    }
                    clearInterval(interval);
                    return;
                }
            } else if (get_job_data.progress === 100) {
                // JOB IS FINISHED
                ctx.replyWithPhoto(
                    get_job_data.result_url, {
                        reply_to_message_id: ctx.update.message.message_id,
                    }
                )
                jobs.shift();
                clearInterval(interval);
                try {
                    // bot.api.deleteMessage(sent_context.chat.id, sent_context.message_id);
                } catch (e) {
                    console.log(e);
                }
            } else {
                // JOB IS IN PROGRESS
                if (get_job_data.progress !== last_progress_update) {
                    last_progress_update = get_job_data.progress;
                    try {
                        bot.api.editMessageText(
                            sent_context.chat.id,
                            sent_context.message_id,
                            "*dolphine noises*\\. " + get_job_data.progress + '% finished\\.', {
                                parse_mode: "MarkdownV2"
                            }
                        )
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        }, Number(process.env.JOB_UPDATE_TIME));
        if (outer_interval) {
            clearInterval(outer_interval);
        }
}

// app.listen(process.env.PORT || 3000);