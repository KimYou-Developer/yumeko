"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@yumeko/classes/Command"));
const CustomError_1 = __importDefault(require("@yumeko/classes/CustomError"));
class GuessTheNumberCommand extends Command_1.default {
    constructor(client) {
        super(client, "game-guessthenumber", {
            aliases: [],
            description: {
                content: "Play Guess the Number Game!. This game is game of luck, i'll pick random number and you must guess it.",
                usage: "[range]",
                examples: ["game-guessthenumber"],
                adionalInfo: ["❓ Guess The Number", "gtn", "hilo"]
            },
            category: "fun",
            args: [
                {
                    identifier: "thatNumber",
                    match: "single",
                    default: "1-100",
                    type: (_, content) => {
                        if (!content.includes("-"))
                            throw new CustomError_1.default("!PARSING", "**Invalid input, right input `min-max`**");
                        const typeNumber = this.collector.runner.argsParser.getType("number");
                        const numbers = [];
                        for (const num of content.split("-")) {
                            numbers.push(typeNumber(_, num));
                        }
                        if (numbers[0] < 1)
                            throw new CustomError_1.default("!PARSING", "Minimum range is `1` or higher");
                        if (numbers[1] > 1000)
                            throw new CustomError_1.default("!PARSING", "Maximume value is `1000` or shorter");
                        if ((numbers[1] - numbers[0]) < 10)
                            throw new CustomError_1.default("!PARSING", "Your range is too short!");
                        return this.randomNumber(numbers[0], numbers[1]);
                    }
                }
            ]
        });
    }
    async exec(msg, { thatNumber }) {
        let toSend = "❓ **| Guess the number started. you can guessing now!**";
        let guessed = false;
        let chance = 10;
        while (!guessed && chance > 0) {
            await msg.channel.send(toSend);
            const filter = (m) => !isNaN(Number(m.content)) && msg.author.id === m.author.id;
            const responses = await msg.channel.awaitMessages(filter, { max: 1, time: 30000 });
            if (!responses.size) {
                await msg.channel.send("⏱️ **| Timeout**");
                break;
            }
            const num = parseInt(responses.first().content, 10);
            if (num < thatNumber)
                toSend = `🔼 **| The number is higher than \`${num}\`**`;
            else if (num > thatNumber)
                toSend = `🔽 **| The number is shorter than \`${num}\`**`;
            else
                guessed = true;
            chance--;
        }
        if (!guessed)
            return msg.ctx.send(`❌ **| Too Bad it was \`${thatNumber}\`**`);
        return msg.ctx.send(`✅ **| You're right! it was \`${thatNumber}\`**`);
    }
    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
exports.default = GuessTheNumberCommand;
