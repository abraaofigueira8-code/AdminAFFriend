// ===============================
// PEGAR ID DO CURSO
// ===============================
const params = new URLSearchParams(window.location.search);
const courseId = params.get("curso");

if (!courseId) {
  showAlert("ID do curso não encontrado na URL.", "error");
  throw new Error("courseId is null");
}

// ===============================
// CRIAR AULA
// ===============================
async function createLesson() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const type = document.getElementById("type").value;
  const order = parseInt(document.getElementById("order").value);
  const videoUrl = document.getElementById("videoUrl").value.trim();
  const pdfUrl = document.getElementById("pdfUrl").value.trim();
  const duration = document.getElementById("duration").value.trim();
  const status = document.getElementById("status").value;

  if (!title || !description || !order) {
    showAlert("Preencha os campos obrigatórios.", "warning");
    return;
  }

  const lessonData = {
    title,
    description,
    type,
    order,
    duration,
    status,
    createdAt: Date.now()
  };

  if (type === "video" && videoUrl) lessonData.videoUrl = videoUrl;
  if (type === "pdf" && pdfUrl) lessonData.pdfUrl = pdfUrl;

  try {
    const db = firebase.database();
    const lessonId = db.ref().push().key;

    await db.ref(`courseLessons/${courseId}/${lessonId}`).set(lessonData);

    showAlert("Aula criada com sucesso!", "success");

    setTimeout(() => {
      window.location.href = `criar-aula.html?curso=${courseId}`;
    }, 1500);

  } catch (error) {
    showAlert("Erro ao criar aula: " + error.message, "error");
  }
}

// ===============================
// TOGGLE SIDEBAR
// ===============================

  function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("-translate-x-full");
}
  const titles = {
  "dashboard.html": "Dashboard",
  "cursos.html": "Cursos",
  "produtos.html": "Produtos",
  "marketplace.html": "Marketplace",
  "usuarios.html": "Usuários",
  "notificacoes.html": "Notificações",
  "compras.html": "Compras",
  "logs.html": "Logs",
  "configuracoes.html": "Configurações"
};

const page = location.pathname.split("/").pop();
document.getElementById("pageTitle").textContent = titles[page] || "Admin";


// ===============================
// MOSTRAR EMAIL DO ADMIN
// ===============================
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    document.getElementById("adminEmail").textContent = user.email;
  } else {
    window.location.href = "login.html";
  }
});

// ===============================
// NAVEGAÇÃO
// ===============================
function go(page) {
  window.location.href = page;
}

// ===============================
// LOGOUT
// ===============================
function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "login.html";
  });
}

// ===============================
// MOSTRAR CAMPOS POR TIPO
// ===============================
function toggleFields() {
  const type = document.getElementById("type").value;
  document.getElementById("videoField").classList.toggle("hidden", type !== "video");
  document.getElementById("pdfField").classList.toggle("hidden", type !== "pdf");
}

// ===============================
// DEFINIR TÍTULO
// ===============================
document.getElementById("pageTitle").textContent = "Criar Aula";

// ===============================
// ALERTA PROFISSIONAL
// ===============================
function showAlert(message, type = "success") {
  const box = document.getElementById("alertBox");
  const msg = document.getElementById("alertMessage");
  const icon = document.getElementById("alertIcon");

  msg.textContent = message;

  if (type === "success") {
    box.style.background = "#16a34a";
    icon.textContent = "✔️";
  } else if (type === "error") {
    box.style.background = "#dc2626";
    icon.textContent = "❌";
  } else if (type === "warning") {
    box.style.background = "#d97706";
    icon.textContent = "⚠️";
  }

  box.classList.remove("hidden");
  setTimeout(() => {
    box.style.opacity = "1";
    box.style.transform = "translateY(0)";
  }, 10);

  setTimeout(() => {
    box.style.opacity = "0";
    box.style.transform = "translateY(-10px)";
    setTimeout(() => box.classList.add("hidden"), 300);
  }, 3000);
}

