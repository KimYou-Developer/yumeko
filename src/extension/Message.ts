import { Structures } from "discord.js";
import { MessageContext } from "../interfaces";
import YumekoClient from "../classes/Client";

class YumekoMessage extends Structures.get("Message") {
    public args: string[] = [];
    public prefix?: string;
    public ctx: MessageContext = {
        send: (content: unknown, options?: any) => (this.client as YumekoClient).context.send(this, content, options)
    };
}

declare module "discord.js" {
    interface Message {
        args: string[];
        prefix?: string;
        ctx: MessageContext;
    }
}

Structures.extend("Message", () => YumekoMessage);