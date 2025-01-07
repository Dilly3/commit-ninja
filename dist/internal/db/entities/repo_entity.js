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
exports.RepoInfo = void 0;
const typeorm_1 = require("typeorm");
let RepoInfo = class RepoInfo {
};
exports.RepoInfo = RepoInfo;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "int" }),
    __metadata("design:type", Number)
], RepoInfo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RepoInfo.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "created_at" }),
    __metadata("design:type", String)
], RepoInfo.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "updated_at" }),
    __metadata("design:type", String)
], RepoInfo.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "url" }),
    __metadata("design:type", String)
], RepoInfo.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "description" }),
    __metadata("design:type", String)
], RepoInfo.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "language" }),
    __metadata("design:type", String)
], RepoInfo.prototype, "language", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "forks", type: "int" }),
    __metadata("design:type", Number)
], RepoInfo.prototype, "forks", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "stars", type: "int" }),
    __metadata("design:type", Number)
], RepoInfo.prototype, "stars", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "open_issues", type: "int" }),
    __metadata("design:type", Number)
], RepoInfo.prototype, "openIssues", void 0);
exports.RepoInfo = RepoInfo = __decorate([
    (0, typeorm_1.Entity)({ name: "repos" })
], RepoInfo);
