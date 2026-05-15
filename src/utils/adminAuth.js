const crypto = require("crypto");

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const TOKEN_SECRET =
  process.env.ADMIN_TOKEN_SECRET || "sg-foundation-admin-secret";
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

function safeCompare(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

function createSignature(payload) {
  return crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(payload)
    .digest("hex");
}

function createAdminToken() {
  const payload = Buffer.from(
    JSON.stringify({
      username: ADMIN_USERNAME,
      exp: Date.now() + TOKEN_TTL_MS,
    })
  ).toString("base64url");

  const signature = createSignature(payload);
  return `${payload}.${signature}`;
}

function verifyAdminToken(token) {
  if (!token || !token.includes(".")) {
    return null;
  }

  const [payload, signature] = token.split(".");
  const expectedSignature = createSignature(payload);

  if (!safeCompare(signature, expectedSignature)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));

    if (!parsed?.exp || parsed.exp < Date.now()) {
      return null;
    }

    return parsed;
  } catch (error) {
    return null;
  }
}

function isValidAdmin(username, password) {
  return safeCompare(username, ADMIN_USERNAME) && safeCompare(password, ADMIN_PASSWORD);
}

module.exports = {
  ADMIN_USERNAME,
  TOKEN_TTL_MS,
  createAdminToken,
  verifyAdminToken,
  isValidAdmin,
};
