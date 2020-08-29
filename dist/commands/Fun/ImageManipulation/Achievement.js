"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const node_superfetch_1 = __importDefault(require("node-superfetch"));
class AchievementCommand extends Command_1.default {
    constructor(client) {
        super(client, "achievement", {
            aliases: ["achievement", "acvmnt"],
            description: {
                content: "Sends a achievement with the text of your choice",
                usage: "achievement <text> [--image=<image|user>]",
                examples: ["achievement"]
            },
            category: "fun",
            permissions: {
                client: ["ATTACH_FILES"]
            },
            args: [
                {
                    identifier: "image",
                    match: "flag",
                    type: "image",
                    flag: "image",
                    default: (msg) => msg.author.displayAvatarURL({ format: "png", size: 512, dynamic: true })
                },
                {
                    identifier: "text",
                    match: "rest",
                    type: "string",
                    prompt: "What text do you want to achieve?"
                }
            ]
        });
    }
    async exec(msg, { text, image }) {
        const m = await msg.channel.send("🖌️ **| Painting..**");
        const { raw: attachment } = await node_superfetch_1.default.get("https://emilia-api.xyz/api/achievement")
            .set("Authorization", `Bearer ${process.env.EMIAPI}`)
            .query({ text, image });
        m.delete();
        return msg.ctx.send({ files: [{ attachment, name: "achievement.png" }] });
    }
}
exports.default = AchievementCommand;
