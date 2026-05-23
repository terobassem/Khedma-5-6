# منصة خدمة المدرسة الابتدائية بالكنيسة

تطبيق MERN كامل لإدارة خدمة الأطفال في الكنيسة — واجهة عربية (RTL)، مناسبة للأطفال.

## التقنيات

- **Frontend:** React, Tailwind CSS, React Router, Axios, Context API
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Auth:** JWT + bcrypt
- **Uploads:** Multer (محلي) + Cloudinary (اختياري)

## التشغيل

### 1. MongoDB
تأكد من تشغيل MongoDB محلياً.

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env   # أو استخدم .env الموجود
npm run seed
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

افتح: http://localhost:5173

## حسابات تجريبية (بعد seed)

| الدور | البريد | كلمة المرور |
|-------|--------|-------------|
| مشرف | admin@church.com | admin123 |
| طالب | marian@church.com | student123 |

## هيكل المشروع

```
church-primary/
├── backend/src/
│   ├── config/       # DB, Cloudinary
│   ├── controllers/
│   ├── middleware/   # auth, upload, errors
│   ├── models/       # User, Quiz, Result, Post...
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── seed/
└── frontend/src/
    ├── components/
    ├── context/
    ├── pages/
    └── services/
```

## الميزات

- تسجيل دخول (مشرف / طالب)
- الصفحة الرئيسية: إعلانات، فيديوهات، متصدرون، فعاليات، آية
- بودكاست / فيديوهات مع بحث وتصنيف
- اختبارات (اختيار متعدد / صح وخطأ) + نتائج تلقائية
- مجتمع: رفع صور/فيديو، إعجاب، تعليق
- لوحة تحكم المشرف + إحصائيات
- وضع ليلي، إشعارات، تصميم متجاوب
