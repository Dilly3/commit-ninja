import { buildPaginator } from "typeorm-cursor-pagination";

export type Constructor = new (...args: any[]) => {};
export enum Order {
  ASC = "ASC",
  DESC = "DESC",
}

export function BuildPaginator<T extends Constructor>(
  entity: T,
  order?: Order,
  limit?: number,
) {
  return buildPaginator({
    entity: entity,
    query: {
      limit: limit,
      order: order,
    },
  });
}

export interface Page<T extends Constructor> {
  data: T[];
  cursor: Cursor;
}

interface Cursor {
  beforeCursor: string | null;
  afterCursor: string | null;
}
