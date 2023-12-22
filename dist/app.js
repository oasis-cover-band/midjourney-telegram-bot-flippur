"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
const grammy_1 = require("grammy");
const auto_retry_1 = require("@grammyjs/auto-retry");
const runner_1 = require("@grammyjs/runner");
const midjourney_api_1 = require("./midjourney-api");
const bot_helper_1 = require("./bot_helper");
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const express = require('express');
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const bodyParser = require("body-parser");
// const app = express();
// app.use(bodyParser.json());
if (process.env.CYCLIC_APP_ID) {
    // 
}
else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('dotenv').config();
}
exports.bot = new grammy_1.Bot(process.env.BOT_TOKEN);
exports.bot.api.config.use((0, auto_retry_1.autoRetry)());
// app.use(webhookCallback(bot, "express"));
const jobs = [];
if (process.env.CYCLIC_APP_ID) {
    // app.use(webhookCallback(bot, "express"));
    // app.listen(process.env.PORT || 3000);
}
else {
    (0, runner_1.run)(exports.bot);
}
exports.bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof grammy_1.GrammyError) {
        console.error("Error in request:", e.description);
    }
    else if (e instanceof grammy_1.HttpError) {
        console.error("Could not contact Telegram:", e);
    }
    else {
        console.error("Unknown error:", e);
    }
});
exports.bot.command("pika", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    jobs.push([ctx.chat.id, ctx.message.message_id, ctx.match]);
    const sent_context = yield ctx.reply("Pika pika\\. Pika pika\\. ", {
        parse_mode: "MarkdownV2",
        reply_to_message_id: ctx.update.message.message_id,
    });
    if (jobs[0][1] === ctx.message.message_id) {
        yield contactMidjourney(ctx, sent_context);
    }
    else {
        const outer_interval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
            if (jobs[0][1] === ctx.message.message_id) {
                yield contactMidjourney(ctx, sent_context, outer_interval);
            }
        }), Number(process.env.OUTER_INTERVAL_TIME));
    }
    // bot.api.sendPhoto()
}));
function contactMidjourney(ctx, sent_context, outer_interval) {
    return __awaiter(this, void 0, void 0, function* () {
        const add_job_data = yield (0, midjourney_api_1.addJob)((0, bot_helper_1.cleanMarkdown)(ctx.match));
        let times_updated = 0;
        let last_progress_update = -1;
        const interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            times_updated++;
            const get_job_data = yield (0, midjourney_api_1.getJob)(add_job_data.id);
            if (get_job_data.progress === -1) {
                // JOB NOT YET STARTED
                if (times_updated === 20 || get_job_data.state === 'canceled') {
                    yield (0, midjourney_api_1.cancelJob)(add_job_data.id);
                    jobs.shift();
                    try {
                        exports.bot.api.editMessageText(sent_context.chat.id, sent_context.message_id, "Pika Pika Pika pika :\\. Pika\\.", {
                            parse_mode: "MarkdownV2"
                        });
                    }
                    catch (e) {
                        console.log(e);
                    }
                    if (outer_interval) {
                        clearInterval(outer_interval);
                    }
                    clearInterval(interval);
                    return;
                }
            }
            else if (get_job_data.progress === 100) {
                // JOB IS FINISHED
                ctx.replyWithPhoto(get_job_data.result_url, {
                    reply_to_message_id: ctx.update.message.message_id,
                });
                jobs.shift();
                clearInterval(interval);
                try {
                    // bot.api.deleteMessage(sent_context.chat.id, sent_context.message_id);
                }
                catch (e) {
                    console.log(e);
                }
            }
            else {
                // JOB IS IN PROGRESS
                if (get_job_data.progress !== last_progress_update) {
                    last_progress_update = get_job_data.progress;
                    try {
                        exports.bot.api.editMessageText(sent_context.chat.id, sent_context.message_id, "Pika pika\\. Pika pika\\. " + get_job_data.progress + '% finished\\.', {
                            parse_mode: "MarkdownV2"
                        });
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            }
        }), Number(process.env.JOB_UPDATE_TIME));
        if (outer_interval) {
            clearInterval(outer_interval);
        }
    });
}
// app.listen(process.env.PORT || 3000);
//# sourceMappingURL=app.js.map