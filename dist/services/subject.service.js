"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importStar(require("../config/database"));
const SubjectService = {
    async getAll(limit = 100, offset = 0) {
        const queryText = 'SELECT * FROM subject WHERE available = true ORDER BY subject_id LIMIT $1 OFFSET $2';
        const result = await (0, database_1.query)(queryText, [limit, offset]);
        return result.rows;
    },
    async create(subject) {
        const client = await database_1.default.connect();
        try {
            await client.query('BEGIN');
            const result = await client.query('INSERT INTO subject (subject_name) VALUES ($1) RETURNING *', [subject.subject_name]);
            await client.query('COMMIT');
            return result.rows[0];
        }
        catch (err) {
            await client.query('ROLLBACK');
            throw err;
        }
        finally {
            client.release();
        }
    },
    async update(id, subject) {
        const client = await database_1.default.connect();
        try {
            await client.query('BEGIN');
            const result = await client.query('UPDATE subject SET subject_name = $1 WHERE subject_id = $2 RETURNING *', [subject.subject_name, id]);
            await client.query('COMMIT');
            return result.rows[0];
        }
        catch (err) {
            await client.query('ROLLBACK');
            throw err;
        }
        finally {
            client.release();
        }
    },
    async setAvailable(id, available) {
        const result = await (0, database_1.query)('UPDATE subject SET available = $1 WHERE subject_id = $2', [available, id]);
        return (result.rowCount ?? 0) > 0;
    },
    async remove(id) {
        const client = await database_1.default.connect();
        try {
            await client.query('BEGIN');
            // Xóa  subject
            await client.query('DELETE FROM subject WHERE subject_id = $1', [id]);
            await client.query('COMMIT');
        }
        catch (err) {
            await client.query('ROLLBACK');
            throw err;
        }
        finally {
            client.release();
        }
    }
};
exports.default = SubjectService;
