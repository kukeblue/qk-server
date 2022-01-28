"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
var prisma_1 = require("../../prisma");
var express = require('express');
var router = express.Router();
var express_validator_1 = require("express-validator");
router.get('/game_accounts', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var gameAccounts, gameAccountResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma_1["default"].gameAccount.findMany()];
                case 1:
                    gameAccounts = _a.sent();
                    gameAccountResponse = { status: 0, list: gameAccounts };
                    res.json(gameAccountResponse);
                    return [2 /*return*/];
            }
        });
    });
});
router.post('/game_account', (0, express_validator_1.body)('name').isString(), (0, express_validator_1.body)('password').isString(), (0, express_validator_1.body)('gameServer').isString(), function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var errors, _a, id, data, gameAccount, ret;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    errors = (0, express_validator_1.validationResult)(req);
                    if (!errors.isEmpty()) {
                        return [2 /*return*/, res.status(400).json({ status: -1, error: errors.array() })];
                    }
                    _a = req.body, id = _a.id, data = __rest(_a, ["id"]);
                    gameAccount = null;
                    if (!id) return [3 /*break*/, 2];
                    return [4 /*yield*/, prisma_1["default"].gameAccount.update({
                            where: {
                                id: id
                            },
                            data: data
                        })];
                case 1:
                    gameAccount = _b.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, prisma_1["default"].gameAccount.create({
                        data: data
                    })];
                case 3:
                    gameAccount = _b.sent();
                    _b.label = 4;
                case 4:
                    ret = { data: gameAccount, status: 0 };
                    res.json(ret);
                    return [2 /*return*/];
            }
        });
    });
});
router["delete"]('/game_account', function (req, res) {
    var gameAccountResponse = { status: 0 };
    res.json(gameAccountResponse);
});
exports["default"] = router;
