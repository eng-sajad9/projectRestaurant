// دوال التشفير والتحقق لكلمات المرور (base64 مؤقتًا)
// يجب تضمين هذا الملف في <script> قبل أي كود يستخدم hashPassword/verifyPassword


// تشفير كلمة المرور باستخدام SHA-256
async function hashPassword(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return {alg: 'sha256', hash: hashHex};
}

// التحقق من كلمة المرور
async function verifyPassword(stored, plain) {
  if (typeof stored === 'string') {
    // legacy: نص عادي
    return stored === plain;
  }
  if (!stored || !stored.alg || !stored.hash) return false;
  if (stored.alg === 'sha256') {
    const hashObj = await hashPassword(plain);
    return stored.hash === hashObj.hash;
  }
  // دعم التحقق من كلمات المرور القديمة (base64)
  if (stored.alg === 'base64') {
    return stored.hash === btoa(unescape(encodeURIComponent(plain)));
  }
  return false;
}

// دالة هجرة جميع المستخدمين legacy (تلقائيًا)
async function migrateAllPlaintextUsers() {
  const snap = await db.ref('users').once('value');
  const users = snap.val() || {};
  for (const [username, data] of Object.entries(users)) {
    if (typeof data.password === 'string') {
      const hashObj = await hashPassword(data.password);
      await db.ref('users/' + username + '/password').set(hashObj);
    }
    // دعم الهجرة من base64 إلى sha256
    if (data.password && data.password.alg === 'base64') {
      const plain = decodeURIComponent(escape(atob(data.password.hash)));
      const hashObj = await hashPassword(plain);
      await db.ref('users/' + username + '/password').set(hashObj);
    }
  }
  // يمكن استدعاء هذه الدالة تلقائيًا عند تسجيل الدخول أو إنشاء مستخدم جديد
}
