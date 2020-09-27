import type YumekoClient from "@yumeko/classes/Client";
import type { Message } from "discord.js";
import { Event } from "@yumeko/interfaces";

export default class MessageEvent implements Event {
    public readonly listener = "message";
    public constructor(public readonly client: YumekoClient) {}
    public exec(msg: Message): void {
        this.client.collector.runner.handle(msg);
        if (msg.guild && !msg.author.bot && !this.client.collector.runner.isCooldown(msg, false) && [`<@${this.client.user!.id}>`, `<@!${this.client.user!.id}>`].includes(msg.content))
            return this.client.collector.commands.get("about")!.exec(msg);
    }
}