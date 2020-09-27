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
require("module-alias/register");
const Database_1 = __importDefault(require("@yumeko/libs/Database"));
const CommandCollector_1 = __importDefault(require("@yumeko/libs/CommandCollector"));
const MessageContext_1 = __importDefault(require("@yumeko/libs/MessageContext"));
const Logger_1 = __importDefault(require("@yumeko/libs/Logger"));
const EventLoader_1 = __importDefault(require("@yumeko/libs/EventLoader"));
const NowplayMoeWS_1 = __importDefault(require("@yumeko/libs/NowplayMoeWS"));
const Localization_1 = require("@yumeko/libs/Localization");
const discord_js_1 = require("discord.js");
const lavalink_1 = require("lavalink");
require("../extension");
const decorators_1 = require("@yumeko/decorators");
const config = require("../../config.json");
class YumekoClient extends discord_js_1.Client {
    constructor() {
        super({
            fetchAllMembers: true,
            allowedMentions: {
                parse: ["roles", "users"]
            }
        });
        this.config = config;
        this.collector = new CommandCollector_1.default(this);
        this.context = new MessageContext_1.default();
        this.log = new Logger_1.default();
        this.db = new Database_1.default();
        this.lavalink = new lavalink_1.Node({
            userID: "",
            send: (guildID, packet) => {
                const guild = this.guilds.cache.get(guildID);
                if (guild)
                    return guild.shard.send(packet);
            },
            ...config.lavalink
        });
        this.nowplayMoe = NowplayMoeWS_1.default;
        this.langs = Localization_1.langCollector();
        EventLoader_1.default(this);
        this.collector.loadAll();
        this.on("error", this.log.error);
        this.on("warn", this.log.warn);
        this.lavalink.once("ready", () => this.log.info("Lavalink is ready to use"));
    }
}
__decorate([
    decorators_1.hide
], YumekoClient.prototype, "config", void 0);
exports.default = YumekoClient;
