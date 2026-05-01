import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  mock,
} from "bun:test";
import postgres from "postgres";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { and, eq, inArray } from "drizzle-orm";
import * as schema from "~/server/db/schema";
import type { InsertTx } from "~/server/db/schema";
import type { TxBankAccount } from "~/lib/zodSchemas";
import type { encryptWithAES as EncryptWithAES } from "~/lib";
import type { decryptTxData as DecryptTxData } from "~/lib";
import type {
  getMergeBaseTxs as GetMergeBaseTxs,
  prepareFullReplaceTxs as PrepareFullReplaceTxs,
  prepareMergeTxs as PrepareMergeTxs,
  uploadFiles as UploadFiles,
} from "../_components/fileFormHelpers";
import type { upload as Upload } from "./uploadActions";

const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ??
  "postgresql://postgres:password@localhost:5432/budget";

Object.assign(process.env, {
  DATABASE_URL: TEST_DATABASE_URL,
  NODE_ENV: "test",
  SKIP_ENV_VALIDATION: "1",
});

mock.module("next/cache", () => ({
  revalidatePath: () => undefined,
}));

assertLocalDatabaseUrl(TEST_DATABASE_URL);

let sql: postgres.Sql;
let testDb: PostgresJsDatabase<typeof schema>;
let encryptWithAES: typeof EncryptWithAES;
let decryptTxData: typeof DecryptTxData;
let uploadFiles: typeof UploadFiles;
let getMergeBaseTxs: typeof GetMergeBaseTxs;
let prepareFullReplaceTxs: typeof PrepareFullReplaceTxs;
let prepareMergeTxs: typeof PrepareMergeTxs;
let upload: typeof Upload;

const userId = "db-test-user";
const otherUserId = "db-test-other-user";
const password = "test-password";
const year = 2025;

const accountA = "db-test-account-a";
const accountB = "db-test-account-b";
const otherAccount = "db-test-other-account";

beforeAll(async () => {
  sql = postgres(TEST_DATABASE_URL, { connect_timeout: 2, prepare: false });
  try {
    await sql.unsafe("select 1");
  } catch (error) {
    throw new Error(
      [
        `Local Postgres is not available at ${TEST_DATABASE_URL}.`,
        "Start the local test database, then rerun npm run test:db.",
        String(error),
      ].join("\n"),
    );
  }

  const push = Bun.spawnSync({
    cmd: ["bunx", "drizzle-kit", "push", "--force"],
    env: {
      ...process.env,
      DATABASE_URL: TEST_DATABASE_URL,
      NODE_ENV: "test",
      SKIP_ENV_VALIDATION: "1",
    },
    stdout: "pipe",
    stderr: "pipe",
  });

  if (!push.success) {
    throw new Error(
      [
        "Could not push schema to local test database.",
        push.stdout.toString(),
        push.stderr.toString(),
      ].join("\n"),
    );
  }

  testDb = drizzle(sql, { schema });

  const lib = await import("~/lib");
  encryptWithAES = lib.encryptWithAES;
  decryptTxData = lib.decryptTxData;

  const helpers = await import("../_components/fileFormHelpers");
  uploadFiles = helpers.uploadFiles;
  getMergeBaseTxs = helpers.getMergeBaseTxs;
  prepareFullReplaceTxs = helpers.prepareFullReplaceTxs;
  prepareMergeTxs = helpers.prepareMergeTxs;

  const actions = await import("./uploadActions");
  upload = actions.upload;
});

afterAll(async () => {
  await sql?.end();
});

beforeEach(async () => {
  await cleanTestRows();
  await seedAccounts();
});

describe("upload account merge db integration", () => {
  it("replaces only selected accounts and recalculates kept transactions", async () => {
    await testDb.insert(schema.txs).values([
      await encryptedTx({
        accountId: accountA,
        amount: -999,
        category: "övrigt",
        date: new Date("2025-01-09"),
        id: "old-account-a",
      }),
      await encryptedTx({
        accountId: accountB,
        amount: 100,
        category: "övrigt",
        date: new Date("2025-01-10"),
        id: "kept-account-b",
      }),
      await encryptedTx({
        accountId: otherAccount,
        amount: 100,
        category: "övrigt",
        date: new Date("2025-01-10"),
        id: "other-user-tx",
      }),
    ]);

    const uploadedTxs: TxBankAccount[] = [
      {
        bankAccountId: accountA,
        belopp: -100,
        budgetgrupp: "övrigt",
        datum: new Date("2025-01-10"),
        id: "new-account-a",
        saldo: 900,
        text: "New transfer",
      },
    ];

    const existingTxs = await getMergeBaseTxs({
      password,
      uploadedTxs,
      userId,
    });
    const mergedTxs = prepareMergeTxs({ existingTxs, uploadedTxs });

    await uploadFiles({
      mode: "mergeAccounts",
      password,
      replacedAccountIds: [accountA],
      txs: mergedTxs,
      userId,
    });

    const rows = await testDb
      .select()
      .from(schema.txs)
      .where(
        inArray(schema.txs.bankAccountId, [accountA, accountB, otherAccount]),
      )
      .orderBy(schema.txs.id);

    expect(rows.map(({ id }) => id)).toEqual([
      "kept-account-b",
      "new-account-a",
      "other-user-tx",
    ]);

    const kept = rows.find(({ id }) => id === "kept-account-b");
    const inserted = rows.find(({ id }) => id === "new-account-a");
    const other = rows.find(({ id }) => id === "other-user-tx");

    expect(kept?.bankAccountId).toBe(accountB);
    expect(inserted?.bankAccountId).toBe(accountA);
    expect(other?.bankAccountId).toBe(otherAccount);

    expect(await decryptTxData(kept!.data, password)).toEqual(
      expect.objectContaining({ budgetgrupp: "inom", belopp: 100 }),
    );
    expect(await decryptTxData(inserted!.data, password)).toEqual(
      expect.objectContaining({ budgetgrupp: "inom", belopp: -100 }),
    );
    expect(await decryptTxData(other!.data, password)).toEqual(
      expect.objectContaining({ budgetgrupp: "övrigt", belopp: 100 }),
    );
  });

  it("refuses to merge account ids owned by another user", () => {
    expect(
      upload({
        mode: "mergeAccounts",
        replacedAccountIds: [otherAccount],
        transactions: [],
        userId,
        year,
      }),
    ).rejects.toThrow("Kunde inte uppdatera valt konto.");
  });

  it("produces the same end state as full replace when the final data is the same", async () => {
    const startingRows = [
      await encryptedTx({
        accountId: accountA,
        amount: -999,
        category: "övrigt",
        date: new Date("2025-01-09"),
        id: "old-account-a",
      }),
      await encryptedTx({
        accountId: accountB,
        amount: 100,
        category: "övrigt",
        date: new Date("2025-01-10"),
        id: "final-account-b",
      }),
    ];
    const finalAccountA: TxBankAccount = {
      bankAccountId: accountA,
      belopp: -100,
      budgetgrupp: "övrigt",
      datum: new Date("2025-01-10"),
      id: "final-account-a",
      saldo: 900,
      text: "Final account A",
    };
    const finalAccountB: TxBankAccount = {
      bankAccountId: accountB,
      belopp: 100,
      budgetgrupp: "övrigt",
      datum: new Date("2025-01-10"),
      id: "final-account-b",
      saldo: 0,
      text: "final-account-b",
    };

    await testDb.insert(schema.txs).values(startingRows);
    const mergeBaseTxs = await getMergeBaseTxs({
      password,
      uploadedTxs: [finalAccountA],
      userId,
    });
    const mergedTxs = prepareMergeTxs({
      existingTxs: mergeBaseTxs,
      uploadedTxs: [finalAccountA],
    });
    await uploadFiles({
      mode: "mergeAccounts",
      password,
      replacedAccountIds: [accountA],
      txs: mergedTxs,
      userId,
    });
    const mergeState = await getNormalizedUserTxs();

    await cleanTestRows();
    await seedAccounts();
    await testDb.insert(schema.txs).values(startingRows);
    await uploadFiles({
      mode: "replaceYear",
      password,
      txs: prepareFullReplaceTxs([finalAccountA, finalAccountB]),
      userId,
    });
    const replaceState = await getNormalizedUserTxs();

    expect(mergeState).toEqual(replaceState);
  });
});

const encryptedTx = async ({
  accountId,
  amount,
  category,
  date,
  id,
}: {
  accountId: string;
  amount: number;
  category: string;
  date: Date;
  id: string;
}): Promise<InsertTx> => {
  const encrypted = await encryptWithAES(
    JSON.stringify({
      belopp: amount,
      budgetgrupp: category,
      saldo: 0,
      text: id,
    }),
    password,
  );

  return {
    bankAccountId: accountId,
    data: encrypted.toString(),
    date,
    id,
    year: date.getFullYear(),
  };
};

const seedAccounts = async () => {
  await testDb.insert(schema.persons).values([
    { id: "db-test-person", name: "Test", userId },
    { id: "db-test-other-person", name: "Other", userId: otherUserId },
  ]);
  await testDb.insert(schema.bankAccounts).values([
    { id: accountA, name: "Account A", personId: "db-test-person" },
    { id: accountB, name: "Account B", personId: "db-test-person" },
    {
      id: otherAccount,
      name: "Other Account",
      personId: "db-test-other-person",
    },
  ]);
};

const cleanTestRows = async () => {
  await testDb
    .delete(schema.persons)
    .where(
      and(
        eq(schema.persons.userId, userId),
        eq(schema.persons.id, "db-test-person"),
      ),
    );
  await testDb
    .delete(schema.persons)
    .where(
      and(
        eq(schema.persons.userId, otherUserId),
        eq(schema.persons.id, "db-test-other-person"),
      ),
    );
};

const getNormalizedUserTxs = async () => {
  const rows = await testDb
    .select()
    .from(schema.txs)
    .where(inArray(schema.txs.bankAccountId, [accountA, accountB]))
    .orderBy(schema.txs.id);

  return await Promise.all(
    rows.map(async ({ bankAccountId, data, date, id, year }) => ({
      bankAccountId,
      date: date.toISOString(),
      id,
      tx: await decryptTxData(data, password),
      year,
    })),
  );
};

function assertLocalDatabaseUrl(url: string) {
  const parsed = new URL(url);
  if (!["localhost", "127.0.0.1", "::1"].includes(parsed.hostname)) {
    throw new Error(
      `Refusing to run DB integration tests against non-local database: ${parsed.hostname}`,
    );
  }
}
