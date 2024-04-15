import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `budget_${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
  createdAt: timestamp("createdAt", { mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  categories: many(category),
  persons: many(persons),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

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
    userId: varchar("userId", { length: 255 })
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => {
    return {
      nameAccount: unique("nameAccount").on(table.name, table.userId),
    };
  },
);

export const personsRelations = relations(persons, ({ many, one }) => ({
  user: one(users, { fields: [persons.userId], references: [users.id] }),
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
    userId: varchar("userId", { length: 255 })
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => {
    return {
      userCategory: unique("userCategory").on(table.name, table.userId),
    };
  },
);

export const categoryRelations = relations(category, ({ many, one }) => ({
  user: one(users, { fields: [category.userId], references: [users.id] }),
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
