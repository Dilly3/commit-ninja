"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
exports.BuildPaginator = BuildPaginator;
const typeorm_cursor_pagination_1 = require("typeorm-cursor-pagination");
var Order;
(function (Order) {
    Order["ASC"] = "ASC";
    Order["DESC"] = "DESC";
})(Order || (exports.Order = Order = {}));
function BuildPaginator(entity, order, limit) {
    return (0, typeorm_cursor_pagination_1.buildPaginator)({
        entity: entity,
        query: {
            limit: limit,
            order: order,
        },
    });
}
