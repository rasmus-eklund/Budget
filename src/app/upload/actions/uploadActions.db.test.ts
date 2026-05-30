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
import type {
  removeBankAccount as RemoveBankAccount,
  removePerson as RemovePerson,
  renameBankAccount as RenameBankAccount,
  renamePerson as RenamePerson,
} from "../../people/dataLayer/peopleActions";
import type {
  getAllMatches as GetAllMatches,
  removeCategory as RemoveCategory,
  removeMatch as RemoveMatch,
  replaceAllMatches as ReplaceAllMatches,
  renameCategory as RenameCategory,
  renameMatch as RenameMatch,
} from "../../categories/dataLayer/categoriesActions";

const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ??
  "postgresql://postgres:password@localhost:5432/budget";

Object.assign(process.env, {
  DATABASE_URL: TEST_DATABASE_URL,
  NODE_ENV: "test",
  SKIP_ENV_VALIDATION: "1",
});

await mock.module("next/cache", () => ({
  revalidatePath: () => undefined,
}));

await mock.module("next/navigation", () => ({
  notFound: () => {
    throw new Error("notFound");
  },
  redirect: (url: string) => {
    throw new Error(`redirect:${url}`);
  },
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
let renameBankAccount: typeof RenameBankAccount;
let removeBankAccount: typeof RemoveBankAccount;
let renamePerson: typeof RenamePerson;
let removePerson: typeof RemovePerson;
let renameCategory: typeof RenameCategory;
let removeCategory: typeof RemoveCategory;
let renameMatch: typeof RenameMatch;
let removeMatch: typeof RemoveMatch;
let getAllMatches: typeof GetAllMatches;
let replaceAllMatches: typeof ReplaceAllMatches;

const userId = "db-test-user";
const otherUserId = "db-test-other-user";
const password = "test-password";
const year = 2025;

await mock.module("~/server/getUserId", () => ({
  default: async () => userId,
}));

const accountA = "db-test-account-a";
const accountB = "db-test-account-b";
const accountC = "db-test-account-c";
const otherAccount = "db-test-other-account";
const categoryA = "db-test-category-a";
const otherCategory = "db-test-other-category";
const matchA = "db-test-match-a";
const otherMatch = "db-test-other-match";

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

  const peopleActions = await import("../../people/dataLayer/peopleActions");
  renameBankAccount = peopleActions.renameBankAccount;
  removeBankAccount = peopleActions.removeBankAccount;
  renamePerson = peopleActions.renamePerson;
  removePerson = peopleActions.removePerson;

  const categoryActions =
    await import("../../categories/dataLayer/categoriesActions");
  renameCategory = categoryActions.renameCategory;
  removeCategory = categoryActions.removeCategory;
  renameMatch = categoryActions.renameMatch;
  removeMatch = categoryActions.removeMatch;
  getAllMatches = categoryActions.getAllMatches;
  replaceAllMatches = categoryActions.replaceAllMatches;
});

afterAll(async () => {
  await sql.end();
});

beforeEach(async () => {
  await cleanTestRows();
  await seedAccounts();
  await seedCategories();
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
        sourceOrder: 0,
        text: "New transfer",
      },
    ];

    const existingTxs = await getMergeBaseTxs({
      password,
      uploadedTxs,
    });
    const mergedTxs = prepareMergeTxs({ existingTxs, uploadedTxs });

    await uploadFiles({
      mode: "mergeAccounts",
      password,
      replacedAccountIds: [accountA],
      txs: mergedTxs,
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
    expect(kept?.sourceOrder).toBe(0);
    expect(inserted?.sourceOrder).toBe(0);

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

  it("refuses to merge account ids owned by another user", async () => {
    await expectRejectsToThrow(
      upload({
        mode: "mergeAccounts",
        replacedAccountIds: [otherAccount],
        transactions: [],
        year,
      }),
      "Kunde inte uppdatera valt konto.",
    );
  });

  it("refuses to insert replacement transactions for another user's account", async () => {
    await expectRejectsToThrow(
      upload({
        mode: "replaceYear",
        transactions: [
          await encryptedTx({
            accountId: otherAccount,
            amount: 123,
            category: "ovrigt",
            date: new Date("2025-01-10"),
            id: "crafted-other-user-tx",
          }),
        ],
        year,
      }),
      "Kunde inte uppdatera valt konto.",
    );

    const rows = await testDb
      .select()
      .from(schema.txs)
      .where(eq(schema.txs.id, "crafted-other-user-tx"));
    expect(rows).toEqual([]);
  });

  it("merges replacement transactions from two accounts after an initial full replace", async () => {
    const initialTxs: TxBankAccount[] = [
      txInput({
        accountId: accountA,
        amount: -999,
        date: new Date("2025-01-09"),
        id: "initial-account-a",
        sourceOrder: 0,
      }),
      txInput({
        accountId: accountB,
        amount: 100,
        date: new Date("2025-01-10"),
        id: "kept-account-b-merge",
        sourceOrder: 0,
      }),
      txInput({
        accountId: accountC,
        amount: -42,
        date: new Date("2025-01-11"),
        id: "initial-account-c",
        sourceOrder: 0,
      }),
    ];

    await uploadFiles({
      mode: "replaceYear",
      password,
      txs: prepareFullReplaceTxs(initialTxs),
    });

    const uploadedTxs: TxBankAccount[] = [
      txInput({
        accountId: accountC,
        amount: -42,
        date: new Date("2025-01-11"),
        id: "new-account-c-grocery",
        sourceOrder: 0,
      }),
      txInput({
        accountId: accountA,
        amount: -100,
        date: new Date("2025-01-10"),
        id: "new-account-a-transfer",
        sourceOrder: 0,
      }),
      txInput({
        accountId: accountC,
        amount: 250,
        date: new Date("2025-01-12"),
        id: "new-account-c-income",
        sourceOrder: 1,
      }),
    ];

    const existingTxs = await getMergeBaseTxs({
      password,
      uploadedTxs,
    });
    const mergedTxs = prepareMergeTxs({ existingTxs, uploadedTxs });

    await uploadFiles({
      mode: "mergeAccounts",
      password,
      replacedAccountIds: [accountA, accountC],
      txs: mergedTxs,
    });

    const finalRows = await getNormalizedUserTxs([
      accountA,
      accountB,
      accountC,
    ]);

    expect(finalRows).toEqual([
      expect.objectContaining({
        bankAccountId: accountB,
        id: "kept-account-b-merge",
        sourceOrder: 0,
        tx: expect.objectContaining({ belopp: 100, budgetgrupp: "inom" }),
      }),
      expect.objectContaining({
        bankAccountId: accountA,
        id: "new-account-a-transfer",
        sourceOrder: 0,
        tx: expect.objectContaining({ belopp: -100, budgetgrupp: "inom" }),
      }),
      expect.objectContaining({
        bankAccountId: accountC,
        id: "new-account-c-grocery",
        sourceOrder: 0,
        tx: expect.objectContaining({ belopp: -42, budgetgrupp: "övrigt" }),
      }),
      expect.objectContaining({
        bankAccountId: accountC,
        id: "new-account-c-income",
        sourceOrder: 1,
        tx: expect.objectContaining({ belopp: 250, budgetgrupp: "övrigt" }),
      }),
    ]);
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
      sourceOrder: 0,
      text: "Final account A",
    };
    const finalAccountB: TxBankAccount = {
      bankAccountId: accountB,
      belopp: 100,
      budgetgrupp: "övrigt",
      datum: new Date("2025-01-10"),
      id: "final-account-b",
      saldo: 0,
      sourceOrder: 0,
      text: "final-account-b",
    };

    await testDb.insert(schema.txs).values(startingRows);
    const mergeBaseTxs = await getMergeBaseTxs({
      password,
      uploadedTxs: [finalAccountA],
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
    });
    const mergeState = await getNormalizedUserTxs();

    await cleanTestRows();
    await seedAccounts();
    await testDb.insert(schema.txs).values(startingRows);
    await uploadFiles({
      mode: "replaceYear",
      password,
      txs: prepareFullReplaceTxs([finalAccountA, finalAccountB]),
    });
    const replaceState = await getNormalizedUserTxs();

    expect(mergeState).toEqual(replaceState);
  });
});

describe("server-owned user identity db integration", () => {
  it("does not rename or delete another user's person or bank account", async () => {
    await expectRejectsToThrow(
      renameBankAccount({ id: otherAccount, name: "hacked account" }),
      "Kunde inte byta bankkontots namn.",
    );
    await expectRejectsToThrow(
      renamePerson({ id: "db-test-other-person", name: "hacked person" }),
      "Kunde inte ändra personens namn",
    );

    const deleteAccountForm = new FormData();
    deleteAccountForm.set("id", "db-test-person");
    deleteAccountForm.set("bankAccountId", otherAccount);
    await removeBankAccount(deleteAccountForm);

    const deletePersonForm = new FormData();
    deletePersonForm.set("id", "db-test-other-person");
    await removePerson(deletePersonForm);

    const [otherPerson] = await testDb
      .select()
      .from(schema.persons)
      .where(eq(schema.persons.id, "db-test-other-person"));
    const [otherBankAccount] = await testDb
      .select()
      .from(schema.bankAccounts)
      .where(eq(schema.bankAccounts.id, otherAccount));

    expect(otherPerson?.name).toBe("Other");
    expect(otherBankAccount?.name).toBe("Other Account");
  });

  it("does not rename another user's category", async () => {
    await expectRejectsToThrow(
      renameCategory({ id: otherCategory, name: "hacked category" }),
      "Kunde inte ändra kategorins namn",
    );
    const [categoryRow] = await testDb
      .select()
      .from(schema.category)
      .where(eq(schema.category.id, otherCategory));
    expect(categoryRow?.name).toBe("other-category");
  });

  it("does not rename another user's match", async () => {
    await expectRejectsToThrow(
      renameMatch({ id: otherMatch, name: "hacked match" }),
      "Kunde inte ändra matchningens namn",
    );
    const [matchRow] = await testDb
      .select()
      .from(schema.match)
      .where(eq(schema.match.id, otherMatch));
    expect(matchRow?.name).toBe("other-match");
  });

  it("does not delete another user's category", async () => {
    const deleteCategoryForm = new FormData();
    deleteCategoryForm.set("id", otherCategory);
    await removeCategory(deleteCategoryForm);
    const [categoryRow] = await testDb
      .select()
      .from(schema.category)
      .where(eq(schema.category.id, otherCategory));
    expect(categoryRow?.name).toBe("other-category");
  });

  it("does not delete another user's match", async () => {
    const deleteMatchForm = new FormData();
    deleteMatchForm.set("id", otherMatch);
    await expectRejectsToThrow(
      removeMatch(deleteMatchForm),
      "Kunde inte ta bort matchning",
    );
    const [matchRow] = await testDb
      .select()
      .from(schema.match)
      .where(eq(schema.match.id, otherMatch));
    expect(matchRow?.name).toBe("other-match");
  });

  it("exports and replaces category JSON only for the current user", async () => {
    const exported = await getAllMatches();
    expect(exported).toEqual([
      { name: "category-a", match: [{ name: "match-a" }] },
    ]);

    await replaceAllMatches({
      data: [{ name: "fresh-category", match: [{ name: "fresh-match" }] }],
    });

    const currentUserCategories = await testDb
      .select({ name: schema.category.name })
      .from(schema.category)
      .where(eq(schema.category.userId, userId));
    const [otherUserCategory] = await testDb
      .select()
      .from(schema.category)
      .where(eq(schema.category.id, otherCategory));
    const [otherUserMatch] = await testDb
      .select()
      .from(schema.match)
      .where(eq(schema.match.id, otherMatch));

    expect(currentUserCategories).toEqual([{ name: "fresh-category" }]);
    expect(otherUserCategory?.name).toBe("other-category");
    expect(otherUserMatch?.name).toBe("other-match");
  });
});

const encryptedTx = async ({
  accountId,
  amount,
  category,
  date,
  id,
  sourceOrder = 0,
}: {
  accountId: string;
  amount: number;
  category: string;
  date: Date;
  id: string;
  sourceOrder?: number;
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
    sourceOrder,
    year: date.getFullYear(),
  };
};

const txInput = ({
  accountId,
  amount,
  date,
  id,
  sourceOrder,
}: {
  accountId: string;
  amount: number;
  date: Date;
  id: string;
  sourceOrder: number;
}): TxBankAccount => ({
  bankAccountId: accountId,
  belopp: amount,
  budgetgrupp: "övrigt",
  datum: date,
  id,
  saldo: 0,
  sourceOrder,
  text: id,
});

const seedAccounts = async () => {
  await testDb.insert(schema.persons).values([
    { id: "db-test-person", name: "Test", userId },
    { id: "db-test-other-person", name: "Other", userId: otherUserId },
  ]);
  await testDb.insert(schema.bankAccounts).values([
    { id: accountA, name: "Account A", personId: "db-test-person" },
    { id: accountB, name: "Account B", personId: "db-test-person" },
    { id: accountC, name: "Account C", personId: "db-test-person" },
    {
      id: otherAccount,
      name: "Other Account",
      personId: "db-test-other-person",
    },
  ]);
};

const seedCategories = async () => {
  await testDb.insert(schema.category).values([
    { id: categoryA, name: "category-a", userId },
    { id: otherCategory, name: "other-category", userId: otherUserId },
  ]);
  await testDb.insert(schema.match).values([
    { id: matchA, name: "match-a", categoryId: categoryA },
    { id: otherMatch, name: "other-match", categoryId: otherCategory },
  ]);
};

const cleanTestRows = async () => {
  await testDb
    .delete(schema.category)
    .where(inArray(schema.category.userId, [userId, otherUserId]));
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

const getNormalizedUserTxs = async (accountIds = [accountA, accountB]) => {
  const rows = await testDb
    .select()
    .from(schema.txs)
    .where(inArray(schema.txs.bankAccountId, accountIds))
    .orderBy(schema.txs.id);

  return Promise.all(
    rows.map(async ({ bankAccountId, data, date, id, sourceOrder, year }) => ({
      bankAccountId,
      date: date.toISOString(),
      id,
      sourceOrder,
      tx: await decryptTxData(data, password),
      year,
    })),
  );
};

const expectRejectsToThrow = async (
  promise: Promise<unknown>,
  message: string,
) => {
  try {
    await promise;
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toContain(message);
    return;
  }

  throw new Error(`Expected promise to reject with message: ${message}`);
};

function assertLocalDatabaseUrl(url: string) {
  const parsed = new URL(url);
  if (!["localhost", "127.0.0.1", "::1"].includes(parsed.hostname)) {
    throw new Error(
      `Refusing to run DB integration tests against non-local database: ${parsed.hostname}`,
    );
  }
}
