"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = __importDefault(require("@yumeko/classes/CustomError"));
const Util_1 = require("@yumeko/util/Util");
class TypeTimespan {
    constructor() {
        this.name = "timespan";
    }
    exec(_, content) {
        const parsed = Util_1.parseTime(content);
        if (isNaN(parsed))
            throw new CustomError_1.default("!PARSING", "**Cannot determine that time position.**");
        return parsed;
    }
}
exports.default = TypeTimespan;
