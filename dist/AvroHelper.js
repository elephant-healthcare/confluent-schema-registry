"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
const avsc_1 = __importDefault(require("avsc"));
class AvroHelper {
    getRawAvroSchema(schema) {
        return (typeof schema.schema === 'string'
            ? JSON.parse(schema.schema)
            : schema.schema);
    }
    getAvroSchema(schema, opts) {
        const rawSchema = this.isRawAvroSchema(schema)
            ? schema
            : this.getRawAvroSchema(schema);
        // The `avro.Type.forSchema` will mutate the options object passed. This can cause issues if you calling `getAvroSchema`
        // for multiple schemas as stale state will bleed between the calls on the mutated options.
        // This is a work around for: https://github.com/mtth/avsc/issues/312
        const optionsCopy = { ...opts };
        // @ts-ignore TODO: Fix typings for Schema...
        const avroSchema = avsc_1.default.Type.forSchema(rawSchema, optionsCopy);
        return avroSchema;
    }
    validate(avroSchema) {
        if (!avroSchema.name) {
            throw new errors_1.ConfluentSchemaRegistryArgumentError(`Invalid name: ${avroSchema.name}`);
        }
    }
    getSubject(schema, 
    // @ts-ignore
    avroSchema, separator) {
        const rawSchema = this.getRawAvroSchema(schema);
        if (!rawSchema.namespace) {
            throw new errors_1.ConfluentSchemaRegistryArgumentError(`Invalid namespace: ${rawSchema.namespace}`);
        }
        const subject = {
            name: [rawSchema.namespace, rawSchema.name].join(separator),
        };
        return subject;
    }
    isRawAvroSchema(schema) {
        const asRawAvroSchema = schema;
        return asRawAvroSchema.name != null && asRawAvroSchema.type != null;
    }
}
exports.default = AvroHelper;
//# sourceMappingURL=AvroHelper.js.map