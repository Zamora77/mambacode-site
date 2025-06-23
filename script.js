// ✅ Scroll Animation
const scrollElements = document.querySelectorAll('.scroll-fade');
const elementInView = (el, percent = 1) => el.getBoundingClientRect().top <= window.innerHeight * percent;
const handleScroll = () => {
  scrollElements.forEach(el => {
    if (elementInView(el, 1.2)) el.classList.add('visible');
    else el.classList.remove('visible');
  });
};
window.addEventListener('scroll', handleScroll);

// ✅ 1. Firebase Initialization
const firebaseConfig = {
  apiKey: "AIzaSyD3uKTJmXGcTYbAlVs-5VrvZSMsgM6hfIk",
  authDomain: "mambacode-33774.firebaseapp.com",
  databaseURL: "https://mambacode-33774-default-rtdb.firebaseio.com",
  projectId: "mambacode-33774",
  storageBucket: "mambacode-33774.firebasestorage.app",
  messagingSenderId: "462341832014",
  appId: "1:462341832014:web:7bdee8c034b3d74b5e721f",
  measurementId: "G-SS5ZPD26DL"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
  // 🌙 تفعيل الوضع الليلي/النهاري
  const toggleBtn = document.getElementById("modeToggle");
  let isLight = localStorage.getItem("mode") === "light";

  const applyMode = () => {
    if (isLight) {
      document.body.classList.add("light-mode");
      toggleBtn.textContent = "☀️ الوضع النهاري";
    } else {
      document.body.classList.remove("light-mode");
      toggleBtn.textContent = "🌙 الوضع الليلي";
    }
  };

  if (toggleBtn) {
    applyMode();
    toggleBtn.addEventListener("click", () => {
      isLight = !isLight;
      localStorage.setItem("mode", isLight ? "light" : "dark");
      applyMode();
    });
  }
// ✅ 2. EmailJS Initialization
emailjs.init("yAuquvP9lXWeoxM4U"); // ← User ID

// ✅ 3. Form Submission
const form = document.getElementById('registerForm');
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();


  if (!name || !email) {
    alert("يرجى إدخال الاسم والبريد الإلكتروني.");
    return;
  }

  // 🧠 Save to Firebase
  const newUserRef = db.ref('registrations').push();
    newUserRef.set({
        name: name,
        email: email,
        password: password,
        timestamp: Date.now()
    });
  // 📧 Send Email using EmailJS
  emailjs.send("service_n0bboh8", "template_z68fe3v", {
    name: name,
    email: email,
    title: "طلب تسجيل كورس"
  })
  .then(() => {
    window.location.href = "courses.html";
    form.reset();
    console.log("✅ Email sent and user saved.");
  })
  .catch((error) => {
    console.error("❌ Email failed:", error);
    alert("حدث خطأ أثناء إرسال البريد.");
  });
});

// ✅ 4. Load Stats & Display
function loadStats() {
  const userList = document.getElementById("userList");
  const count = document.getElementById("count");

  if (!count) return;

  db.ref('registrations').on('value', (snapshot) => {
    const data = snapshot.val();
    if (userList) userList.innerHTML = ''; // اختياري لو العنصر موجود

    if (data) {
      const entries = Object.entries(data);
      count.textContent = `عدد المسجلين: ${entries.length}`;
    } else {
      count.textContent = "لا يوجد مسجلين حتى الآن.";
    }
  });
}


// ✅ استدعاء الإحصائيات لما الصفحة تفتح
window.addEventListener("DOMContentLoaded", loadStats);
