/* Auth va demo karta regression testlari — DB'ga ulanmaydi (model metodlari
 * stub qilinadi). Build qilingan kodga qarshi ishlaydi:
 *   npm run build && node test/auth-payment.regression.js
 * Node 16 (.nvmrc) bilan mos bo'lishi uchun node:test emas, oddiy assert. */
const assert = require("assert");
const path = require("path");
const jwt = require("jsonwebtoken");

const dist = path.join(__dirname, "..", "dist");
const SECRET = "regression-secret";
process.env.SECRET_TOKEN = SECRET;

const load = (rel) => require(path.join(dist, rel));

// Controller AuthService'ni modul yuklanganda yaratadi — boshqa env bilan
// sinash uchun faqat shu ikki modul keshdan olinadi (mongoose modellari
// qayta ro'yxatdan o'tmasligi uchun boshqalari tegilmaydi)
const loadFreshController = () => {
  for (const rel of ["controllers/member.controller.js", "models/Auth.service.js"]) {
    delete require.cache[require.resolve(path.join(dist, rel))];
  }
  return load("controllers/member.controller.js").default;
};

const { default: Errors, ErrorReason } = load("libs/Errors.js");
const AuthService = load("models/Auth.service.js").default;
const MemberService = load("models/Member.service.js").default;
const memberController = load("controllers/member.controller.js").default;

const fakeRes = () => {
  const res = { statusCode: null, body: null };
  res.status = (code) => ((res.statusCode = code), res);
  res.json = (body) => ((res.body = JSON.parse(JSON.stringify(body))), res);
  return res;
};

const runVerifyAuth = async (controller, token) => {
  const req = { cookies: token ? { accessToken: token } : {} };
  const res = fakeRes();
  let nextCalled = false;
  await controller.verifyAuth(req, res, () => (nextCalled = true));
  return { req, res, nextCalled };
};

const expectErrors = async (promise, code, reason) => {
  try {
    await promise;
  } catch (err) {
    assert.ok(err instanceof Errors, `Errors kutilgan, keldi: ${err}`);
    assert.strictEqual(err.code, code);
    assert.strictEqual(err.reason, reason);
    return err;
  }
  assert.fail("xato kutilgan edi");
};

const stubQuery = (value) => ({
  exec: async () => value,
  select() {
    return this;
  },
  sort() {
    return this;
  },
  limit() {
    return this;
  },
});

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

/* ── 1. JWT: faqat token xatolari 401, qolgani 500 ── */

test("yaroqli token → member", async () => {
  const token = jwt.sign({ _id: "m1", memberNick: "ali" }, SECRET);
  const member = await new AuthService().checkAuth(token);
  assert.strictEqual(member.memberNick, "ali");
});

for (const [label, makeToken] of [
  ["buzilgan", () => "x.y.z"],
  ["boshqa secret imzosi", () => jwt.sign({ _id: "m1" }, "other")],
  ["muddati o'tgan", () => jwt.sign({ _id: "m1", exp: 1 }, SECRET)],
  ["hali aktiv emas (nbf)", () => jwt.sign({ _id: "m1" }, SECRET, { notBefore: 3600 })],
]) {
  test(`${label} token → 401 AUTH_REQUIRED`, async () => {
    await expectErrors(
      new AuthService().checkAuth(makeToken()),
      401,
      ErrorReason.AUTH_REQUIRED,
    );
    const { res, nextCalled } = await runVerifyAuth(memberController, makeToken());
    assert.strictEqual(nextCalled, false);
    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.reason, ErrorReason.AUTH_REQUIRED);
  });
}

test("cookie yo'q → 401 AUTH_REQUIRED", async () => {
  const { res } = await runVerifyAuth(memberController, null);
  assert.strictEqual(res.statusCode, 401);
  assert.strictEqual(res.body.reason, ErrorReason.AUTH_REQUIRED);
});

test("SECRET_TOKEN yo'q → 401 emas, 500", async () => {
  const saved = process.env.SECRET_TOKEN;
  delete process.env.SECRET_TOKEN;
  try {
    const service = new AuthService();
    await assert.rejects(service.checkAuth(jwt.sign({ _id: "m1" }, SECRET)), (err) => {
      return !(err instanceof Errors);
    });
    // Controller modul yuklanganda AuthService yaratadi — secret'siz qayta yuklaymiz
    const controller = loadFreshController();
    const { res } = await runVerifyAuth(controller, jwt.sign({ _id: "m1" }, SECRET));
    assert.strictEqual(res.statusCode, 500);
    assert.strictEqual(res.body.reason, undefined);
  } finally {
    process.env.SECRET_TOKEN = saved;
  }
});

test("verifier ichidagi kutilmagan xato → 500", async () => {
  const original = jwt.verify;
  jwt.verify = () => {
    throw new TypeError("internal boom");
  };
  try {
    await assert.rejects(new AuthService().checkAuth("any"), TypeError);
    const { res } = await runVerifyAuth(memberController, "any");
    assert.strictEqual(res.statusCode, 500);
  } finally {
    jwt.verify = original;
  }
});

/* ── 4. Faol member yo'q → 404 + MEMBER_INACTIVE ── */

test("getMemberDetail: faol member yo'q → 404 MEMBER_INACTIVE (body'da ham)", async () => {
  const service = new MemberService();
  service.memberModel = { findOne: () => stubQuery(null) };
  const err = await expectErrors(
    service.getMemberDetail({ _id: "64b000000000000000000001" }),
    404,
    ErrorReason.MEMBER_INACTIVE,
  );
  assert.strictEqual(JSON.parse(JSON.stringify(err)).reason, "MEMBER_INACTIVE");
});

test("boshqa 404'larda reason yo'q (Errors.standard ham)", async () => {
  const err = new Errors(404, "No data is found!");
  assert.strictEqual(JSON.parse(JSON.stringify(err)).reason, undefined);
  assert.strictEqual(Errors.standard.reason, undefined);
});

/* ── 5. cardHolder/cardExpiry: avval string tipi ── */

const memberRef = { _id: "64b000000000000000000001" };
const futureExpiry = "12/39";

for (const [label, input] of [
  ["holder object", { cardHolder: { bad: true }, cardExpiry: futureExpiry }],
  ["holder array", { cardHolder: ["Ali"], cardExpiry: futureExpiry }],
  ["holder number", { cardHolder: 12345, cardExpiry: futureExpiry }],
  ["holder null", { cardHolder: null, cardExpiry: futureExpiry }],
  ["expiry object", { cardHolder: "Ali", cardExpiry: { m: 12 } }],
  ["expiry array", { cardHolder: "Ali", cardExpiry: ["12/39"] }],
  ["expiry number", { cardHolder: "Ali", cardExpiry: 1239 }],
  ["expiry null", { cardHolder: "Ali", cardExpiry: null }],
  ["body null", null],
  ["holder bo'sh joy", { cardHolder: "   ", cardExpiry: futureExpiry }],
  ["expiry o'tgan", { cardHolder: "Ali", cardExpiry: "01/20" }],
]) {
  test(`savePaymentMethod rad etadi: ${label}`, async () => {
    const service = new MemberService();
    let updateCalled = false;
    service.memberModel = {
      findOneAndUpdate: () => ((updateCalled = true), stubQuery({})),
    };
    await expectErrors(service.savePaymentMethod(memberRef, input), 400, undefined);
    assert.strictEqual(updateCalled, false);
  });
}

test("savePaymentMethod: faqat holder/expiry, faqat o'z kartasi", async () => {
  const service = new MemberService();
  let captured;
  service.memberModel = {
    findOneAndUpdate: (filter, update) => ((captured = { filter, update }), stubQuery({ ok: 1 })),
  };
  await service.savePaymentMethod(memberRef, {
    cardHolder: "  Ali Valiyev ",
    cardExpiry: futureExpiry,
    cardLast4: "9999",
    cardBrand: "VISA",
  });
  assert.strictEqual(String(captured.filter._id), memberRef._id);
  assert.deepStrictEqual(captured.filter["memberPayment.cardLast4"], { $exists: true });
  assert.deepStrictEqual(captured.update, {
    $set: {
      "memberPayment.cardHolder": "Ali Valiyev",
      "memberPayment.cardExpiry": futureExpiry,
    },
  });
});

/* ── Oldingi talablar saqlanganini tekshirish ── */

test("signup: client yuborgan memberPayment server generatsiyasi bilan almashtiriladi", async () => {
  const service = new MemberService();
  let created;
  service.memberModel = {
    create: async (doc) => ((created = doc), { toJSON: () => doc }),
  };
  await service.signup({
    memberNick: "  Ali  ",
    memberPhone: "010",
    memberPassword: "pw",
    memberPayment: { cardBrand: "VISA", cardLast4: "4242" },
  });
  assert.strictEqual(created.memberPayment.cardBrand, "DEMO");
  assert.match(created.memberPayment.cardLast4, /^\d{4}$/);
  assert.strictEqual(created.memberPayment.cardHolder, "Ali");
  assert.match(created.memberPayment.cardExpiry, /^\d{2}\/\d{2}$/);
});

test("generate: karta bor bo'lsa update qilinmaydi (idempotent)", async () => {
  const service = new MemberService();
  const existing = { memberNick: "ali", memberPayment: { cardLast4: "1234" } };
  let updateCalled = false;
  service.memberModel = {
    findOne: () => stubQuery(existing),
    findOneAndUpdate: () => ((updateCalled = true), stubQuery(null)),
  };
  assert.strictEqual(await service.generatePaymentMethod(memberRef), existing);
  assert.strictEqual(updateCalled, false);
});

test("generate: faqat kartasi yo'q o'z hujjatini yangilaydi", async () => {
  const service = new MemberService();
  let captured;
  service.memberModel = {
    findOne: () => stubQuery({ memberNick: "ali" }),
    findOneAndUpdate: (filter, update) => ((captured = { filter, update }), stubQuery({ ok: 1 })),
  };
  await service.generatePaymentMethod(memberRef);
  assert.strictEqual(String(captured.filter._id), memberRef._id);
  assert.deepStrictEqual(captured.filter["memberPayment.cardLast4"], { $exists: false });
  assert.strictEqual(captured.update.$set.memberPayment.cardHolder, "ali");
});

test("top-users: faqat public maydonlar projection'da", async () => {
  const service = new MemberService();
  let projection;
  const query = stubQuery([]);
  query.select = (p) => ((projection = p), query);
  service.memberModel = { find: () => query };
  await service.getTopUsers();
  assert.deepStrictEqual(Object.keys(projection).sort(), [
    "memberImage",
    "memberNick",
    "memberPoints",
    "memberType",
  ]);
});

(async () => {
  let failed = 0;
  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`  ✓ ${name}`);
    } catch (err) {
      failed++;
      console.log(`  ✗ ${name}\n    ${err && err.stack}`);
    }
  }
  console.log(`\n${tests.length - failed}/${tests.length} passed`);
  process.exit(failed ? 1 : 0);
})();
