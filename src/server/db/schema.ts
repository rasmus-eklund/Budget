import { relations } from "drizzle-orm";
import {
  integer,
  pgTableCreator,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `pengar_${name}`);

export const txs = createTable("txs", {
  id: varchar("id", { length: 255 }).primaryKey(),
  year: integer("year").notNull(),
  date: timestamp("date").notNull(),
  data: text("data").notNull(),
  bankAccountId: varchar("bankAccountId", { length: 255 })
    .references(() => bankAccounts.id, { onDelete: "cascade" })
    .notNull(),
});

export type InsertTx = typeof txs.$inferInsert;

export const txsRelations = relations(txs, ({ one }) => ({
  bankAccount: one(bankAccounts, {
    fields: [txs.bankAccountId],
    references: [bankAccounts.id],
  }),
}));

export const persons = createTable(
  "persons",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    userId: varchar("userId", { length: 255 }).notNull(),
  },
  (table) => {
    return {
      nameAccount: unique("nameAccount").on(table.name, table.userId),
    };
  },
);

export const personsRelations = relations(persons, ({ many }) => ({
  bankAccounts: many(bankAccounts),
}));

export const bankAccounts = createTable(
  "bankAccounts",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    personId: varchar("personId", { length: 255 })
      .references(() => persons.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => {
    return {
      namePerson: unique("namePerson").on(table.name, table.personId),
    };
  },
);

export const bankAccountsRelations = relations(
  bankAccounts,
  ({ one, many }) => ({
    txs: many(txs),
    person: one(persons, {
      fields: [bankAccounts.personId],
      references: [persons.id],
    }),
  }),
);

export const category = createTable(
  "category",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    userId: varchar("userId", { length: 255 }).notNull(),
  },
  (table) => {
    return {
      userCategory: unique("userCategory").on(table.name, table.userId),
    };
  },
);

export const categoryRelations = relations(category, ({ many }) => ({
  match: many(match),
}));

export const match = createTable("match", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  categoryId: varchar("categoryId", { length: 255 })
    .references(() => category.id, { onDelete: "cascade" })
    .notNull(),
});

export const matchRelations = relations(match, ({ one }) => ({
  category: one(category, {
    fields: [match.categoryId],
    references: [category.id],
  }),
}));
