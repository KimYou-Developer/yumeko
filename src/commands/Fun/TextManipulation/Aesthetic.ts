import type YumekoClient from "@yumeko/classes/Client";
import Command from "@yumeko/classes/Command";
import type { Message } from "discord.js";

export default class extends Command {
    public constructor (client: YumekoClient) {
        super(client, "aesthetic", {
            aliases: ["aesthetic"],
            description: {
                content: "Convert text to aesthetic way",
                usage: "aesthetic <text>",
                examples: ["aesthetic hahaha"]
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
        return msg.ctx.send(text.split("").join(" ").toUpperCase());
    }
}