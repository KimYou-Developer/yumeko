import type YumekoClient from "@yumeko/classes/Client";
import Command from "@yumeko/classes/Command";
import type { Message } from "discord.js";

export default class extends Command {
    public constructor (client: YumekoClient) {
        super(client, "riot", {
            aliases: ["riot"],
            description: {
                content: "Convert text to riot way",
                usage: "riot <text>",
                examples: ["riot hahaha"]
            },
            category: "fun",
            args: [
                {
                    identifier: "text",
                    match: "rest",
                    prompt: "What text do you want to convert ?",
                    type: "string"
                }
            ]
        });
    }

    public exec(msg: Message, { text } : { text: string }): Promise<Message> {
        return msg.ctx.send(`ヽ༼ຈل͜ຈ༽ﾉ ${text.toUpperCase()} ヽ༼ຈل͜ຈ༽ﾉ`);
    }
}