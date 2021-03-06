import type YumekoClient from "@yumeko/classes/Client";
import { Event } from "@yumeko/interfaces";

export default class RawEvent implements Event {
    public readonly listener = "raw";
    public constructor(public readonly client: YumekoClient) {}
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public exec (packet: any): void {
        switch(packet.t) {
            case "VOICE_STATE_UPDATE":
                this.client.lavalink.voiceStateUpdate(packet.d);
                break;
            case "VOICE_SERVER_UPDATE":
                this.client.lavalink.voiceServerUpdate(packet.d);
                break;
        }
    }
}