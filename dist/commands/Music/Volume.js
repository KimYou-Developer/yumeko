"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const CustomError_1 = __importDefault(require("@yumeko/classes/CustomError"));
const decorators_1 = require("@yumeko/decorators");
let VolumeCommand = class VolumeCommand extends Command_1.default {
    async exec(msg, { amount }) {
        const { music } = msg.guild;
        music.setVolume(amount);
        return msg.ctx.send(`🔉 **| Change Volume to \`${amount}\`**`);
    }
    ignore(msg) {
        return !!msg.guild.music.song && (msg.guild.music.listeners.length < 2 ||
            msg.guild.music.song.requester.id === msg.author.id);
    }
};
__decorate([
    decorators_1.isMusicPlaying(),
    decorators_1.isMemberInVoiceChannel(),
    decorators_1.isSameVoiceChannel()
], VolumeCommand.prototype, "exec", null);
VolumeCommand = __decorate([
    decorators_1.DeclareCommand("volume", {
        aliases: ["volume"],
        description: {
            content: "Stop playing current song",
            usage: "volume <amount>",
            examples: ["volume 100"]
        },
        category: "music",
        permissions: {
            user: ["MANAGE_GUILD"]
        },
        args: [
            {
                identifier: "amount",
                match: "single",
                prompt: "What time position do you want jump to ?",
                type: (_, content) => {
                    const volume = _.client.collector.runner.argsParser.getType("number")(_, content);
                    if (volume > 120)
                        throw new CustomError_1.default("!PARSING", "**Volume is too high. max \`120\`**");
                    if (volume < 0)
                        throw new CustomError_1.default("!PARSING", "Volume is too low. min \`0\`");
                    return volume;
                }
            }
        ]
    })
], VolumeCommand);
exports.default = VolumeCommand;
