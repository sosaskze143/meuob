// بيانات التهيئة من Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAnPtdE3GLca_iFEB-oe8fy6XG3vbmahGA",
    authDomain: "meuop-29c24.firebaseapp.com",
    projectId: "meuop-29c24",
    storageBucket: "meuop-29c24.firebasestorage.app",
    messagingSenderId: "247259151770",
    appId: "1:247259151770:web:03d9c53ef77f75351a4e23",
    measurementId: "G-V1GVX2MH0X"
};

// تهيئة Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// تفعيل استمرارية الجلسة
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => console.log("استمرارية الجلسة مفعلة."))
    .catch((error) => console.error("خطأ في تفعيل استمرارية الجلسة:", error));

// عناصر واجهة المستخدم
const signinButton = document.getElementById('signin-button');
const signupButton = document.getElementById('signup-button');
const signoutButton = document.getElementById('signout-button');
const videoFileInput = document.getElementById('video-file');
const uploadButton = document.getElementById('upload-button');
const videoList = document.getElementById('video-list');

// تسجيل الدخول
signinButton.addEventListener('click', () => {
    const email = prompt("أدخل بريدك الإلكتروني:");
    const password = prompt("أدخل كلمة المرور:");
    auth.signInWithEmailAndPassword(email, password)
        .then(() => alert("تم تسجيل الدخول بنجاح!"))
        .catch(error => alert("خطأ في تسجيل الدخول: " + error.message));
});

// إنشاء حساب
signupButton.addEventListener('click', () => {
    const email = prompt("أدخل بريدك الإلكتروني:");
    const password = prompt("أدخل كلمة المرور:");
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => alert("تم إنشاء الحساب بنجاح!"))
        .catch(error => alert("خطأ في إنشاء الحساب: " + error.message));
});

// تسجيل الخروج
signoutButton.addEventListener('click', () => {
    auth.signOut().then(() => alert("تم تسجيل الخروج بنجاح!"));
});

// رفع الفيديو
uploadButton.addEventListener('click', () => {
    const file = videoFileInput.files[0];
    if (file) {
        const storageRef = storage.ref(`videos/${file.name}`);
        storageRef.put(file).then(snapshot => {
            snapshot.ref.getDownloadURL().then(url => {
                db.collection('videos').add({
                    name: file.name,
                    url: url
                });
                alert("تم رفع الفيديو بنجاح!");
            });
        }).catch(error => alert("خطأ في رفع الفيديو: " + error.message));
    } else {
        alert("الرجاء اختيار فيديو أولاً!");
    }
});

// عرض الفيديوهات
auth.onAuthStateChanged(user => {
    if (user) {
        signinButton.style.display = 'none';
        signupButton.style.display = 'none';
        signoutButton.style.display = 'block';
        loadVideos();
    } else {
        signinButton.style.display = 'block';
        signupButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
});

function loadVideos() {
    db.collection('videos').onSnapshot(snapshot => {
        videoList.innerHTML = '';
        snapshot.forEach(doc => {
            const video = doc.data();
            const videoCard = document.createElement('div');
            videoCard.className = 'video-card';
            videoCard.innerHTML = `
                <h3>${video.name}</h3>
                <video controls src="${video.url}"></video>
            `;
            videoList.appendChild(videoCard);
        });
    });
}
