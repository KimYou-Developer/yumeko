import type YumekoClient from "../classes/Client";
import type Command from "../classes/Command";
import { Message, Collection, Snowflake, PermissionString, GuildMember } from "discord.js";
import { CommandUsed, CommandOption } from "../interfaces";
import { timingSafeEqual } from "crypto";

export default class CommandRunner {
    public commandUsed: Collection<Snowflake, CommandUsed> = new Collection();
    public constructor(public client: YumekoClient) {}

    public async runCommand(msg: Message,command: Command): Promise<boolean> {
        try {
            // eslint-disable-next-line @typescript-eslint/await-thenable
            await command.exec(msg);
            return true;
        } catch(e) {
            this.client.log.error(e);
            return false;
        }
    }

    public async handle(msg: Message): Promise<Message|void> {
        if(msg.author.bot || !msg.guild) return undefined;
        const prefix = this.getPrefix(msg);
        if(!prefix) return undefined;
        const args = msg.content.slice(prefix.length).trim().split(/ +/g);
        const commandID = args.shift();
        const filter = (x: Command): boolean => x.option.aliases.includes(commandID!);
        const command = this.client.collector.commands.filter(filter).first();
        if(!command) return undefined;
        if(this.isCooldown(msg)) return undefined;
        if(command.option.devOnly && !msg.author.isDev) return undefined;
        if(!this.allowed(msg, command.option.permissions)) return undefined;
        const payload: CommandUsed = {
            running: true,
            since: Date.now(),
            amount: (command.option.cooldown || 5) * 1000
        };
        this.commandUsed.set(msg.author.id, payload);
        const result = await this.runCommand(msg, command);
        payload.running = false;
        payload.since = result ? Date.now() : 0;
        this.commandUsed.set(msg.author.id, payload);
    }

    public isCooldown(msg: Message): boolean {
        const now = Date.now();
        const used = this.commandUsed.get(msg.author.id) || {
            running: false,
            since: 0,
            amount: 0
        };
        if(used.running) {
            msg.channel.send(`**❌ | ${msg.author}, Only one command per user**`);
            return true;
        }
        const cooldown = used.since + used.amount;
        if(now < cooldown) {
            const amount = (cooldown - now) / 1000;
            msg.channel.send(`**⏱️ | ${msg.author}, Calm down!.** You can use command again in \`${Math.round(amount)}\` second(s)`);
            return true;
        }
        return false;
    }

    public allowed(msg: Message, permission: CommandOption["permissions"]): boolean {
        if(!permission) return true;
        if(permission.client) {
            const permissions = this.checkMissPermission(msg.guild!.me!, permission.client);
            if(permissions.length) {
                const mappedPerms = permissions.map(x => `\`${x}\``).join();
                msg.channel.send(`**❌ | Im require this permission(s) to run the command. ${mappedPerms}**`);
                return false;
            }
        }
        if(permission.user) {
            const permissions = this.checkMissPermission(msg.member!, permission.user);
            if(permissions.length) {
                const mappedPerms = permissions.map(x => `\`${x}\``).join();
                msg.channel.send(`**❌ | ${msg.author}, You require this permission(s) to run the command. ${mappedPerms}**`);
                return false;
            }
        }
        return true;
    }

    public checkMissPermission(member: GuildMember, perms: PermissionString[]): PermissionString[] {
        const result: PermissionString[] = [];
        for(const perm of perms) {
            if(!member.permissions.has(perm)) result.push(perm);
        }
        return result;
    }

    public getPrefix(msg: Message): string|void {
        const prefixes: string[] = [this.client.config.prefix, this.client.user!.toString()];
        for(const prefix of prefixes) {
            if(msg.content.startsWith(prefix)) return prefix;
        }
    }
}