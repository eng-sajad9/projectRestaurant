// دوال التشفير والتحقق لكلمات المرور (base64 مؤقتًا)
// يجب تضمين هذا الملف في <script> قبل أي كود يستخدم hashPassword/verifyPassword

// تشفير كلمة المرور باستخدام base64 (للاختبار فقط)
function hashPassword(plain) {
  // لا تستخدم هذا في الإنتاج، فقط للاختبار
  return {alg: 'base64', hash: btoa(unescape(encodeURIComponent(plain)))};
}

// التحقق من كلمة المرور
function verifyPassword(stored, plain) {
  if (typeof stored === 'string') {
    // legacy: نص عادي
    return stored === plain;
  }
  if (!stored || !stored.alg || !stored.hash) return false;
  if (stored.alg === 'base64') {
    return stored.hash === btoa(unescape(encodeURIComponent(plain)));
  }
  return false;
}

// دالة هجرة جميع المستخدمين legacy (تشغيلها من حساب المدير)
async function migrateAllPlaintextUsers() {
  const snap = await db.ref('users').once('value');
  const users = snap.val() || {};
  for (const [username, data] of Object.entries(users)) {
    if (typeof data.password === 'string') {
      const hashObj = hashPassword(data.password);
      await db.ref('users/' + username + '/password').set(hashObj);
    }
  }
  alert('تم تحويل جميع كلمات المرور القديمة إلى صيغة مشفرة.');
}
