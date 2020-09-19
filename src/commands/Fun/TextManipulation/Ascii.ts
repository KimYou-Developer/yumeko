import type YumekoClient from "@yumeko/classes/Client";
import Command from "@yumeko/classes/Command";
import CustomError from "@yumeko/classes/CustomError";
import figlet from "figlet";
import type { Message } from "discord.js";
import { promisify } from "util";
import { codeBlock } from "@yumeko/util/Util";

export default class extends Command {
    public constructor (client: YumekoClient) {
        super(client, "asciify", {
            aliases: ["asciify", "ascii"],
            description: {
                content: "Concert text to ASCII",
                usage: "asciify <text>",
                examples: ["ascii yo"]
            },
            category: "fun",
            args: [
                {
                    identifier: "text",
                    match: "rest",
                    prompt: "What text do you want me to convert ?",
                    type: (_, content: string): string => {
                        if (content.length > 14) throw new CustomError("!PARSING", "**Only \`14\` characters are allowed**");
                        return content;
                    }
                }
            ]
        });
    }

    public async exec(msg: Message, { text }: { text: string }): Promise<Message> {
        const ascii = await promisify(figlet)(text);
        return msg.ctx.send(codeBlock("ascci", ascii as string));
    }
}