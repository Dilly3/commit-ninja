"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommitInfo = void 0;
const typeorm_1 = require("typeorm");
let CommitInfo = class CommitInfo {
};
exports.CommitInfo = CommitInfo;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], CommitInfo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        name: "repo_name",
        nullable: false,
    }),
    __metadata("design:type", String)
], CommitInfo.prototype, "repoName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "message", type: "varchar" }),
    __metadata("design:type", String)
], CommitInfo.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "author_name" }),
    __metadata("design:type", String)
], CommitInfo.prototype, "authorName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "author_email" }),
    __metadata("design:type", String)
], CommitInfo.prototype, "authorEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "date" }),
    __metadata("design:type", String)
], CommitInfo.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "url" }),
    __metadata("design:type", String)
], CommitInfo.prototype, "url", void 0);
exports.CommitInfo = CommitInfo = __decorate([
    (0, typeorm_1.Entity)({ name: "commits" })
], CommitInfo);
