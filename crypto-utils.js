// دوال التشفير والتحقق لكلمات المرور (PBKDF2-SHA256)
// يجب تضمين هذا الملف في <script> قبل أي كود يستخدم hashPassword/verifyPassword

// توليد salt عشوائي (base64)
function generateSalt(length = 16) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return btoa(String.fromCharCode.apply(null, array));
}

// تحويل base64 إلى Uint8Array
function base64ToBytes(b64) {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}
// تحويل Uint8Array إلى base64
function bytesToBase64(bytes) {
  return btoa(String.fromCharCode.apply(null, bytes));
}

// hashPassword(plain) => {alg, iterations, salt, hash}
async function hashPassword(plain, iterations = 150000) {
  const encoder = new TextEncoder();
  const salt = generateSalt(16);
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw', encoder.encode(plain), {name: 'PBKDF2'}, false, ['deriveBits']
  );
  const derivedBits = await window.crypto.subtle.deriveBits({
    name: 'PBKDF2',
    salt: base64ToBytes(salt),
    iterations,
    hash: 'SHA-256'
  }, keyMaterial, 256);
  const hash = bytesToBase64(new Uint8Array(derivedBits));
  return {alg: 'PBKDF2-SHA256', iterations, salt, hash};
}

// verifyPassword(stored, plain) => true/false
async function verifyPassword(stored, plain) {
  if (typeof stored === 'string') {
    // legacy: نص عادي
    return stored === plain;
  }
  if (!stored || !stored.alg || !stored.salt || !stored.hash) return false;
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw', encoder.encode(plain), {name: 'PBKDF2'}, false, ['deriveBits']
  );
  const derivedBits = await window.crypto.subtle.deriveBits({
    name: 'PBKDF2',
    salt: base64ToBytes(stored.salt),
    iterations: stored.iterations || 150000,
    hash: 'SHA-256'
  }, keyMaterial, 256);
  const hash = bytesToBase64(new Uint8Array(derivedBits));
  return hash === stored.hash;
}

// دالة هجرة جميع المستخدمين legacy (تشغيلها من حساب المدير)
async function migrateAllPlaintextUsers() {
  const snap = await db.ref('users').once('value');
  const users = snap.val() || {};
  for (const [username, data] of Object.entries(users)) {
    if (typeof data.password === 'string') {
      const hashObj = await hashPassword(data.password);
      await db.ref('users/' + username + '/password').set(hashObj);
    }
  }
  alert('تم تحويل جميع كلمات المرور القديمة إلى صيغة مشفرة.');
}
