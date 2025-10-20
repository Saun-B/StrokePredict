// Câu hỏi
const questions = [
  { key: "age", question: "Tuổi của bạn là bao nhiêu?", type: "number" },
  {
    key: "gender",
    question: "Giới tính của bạn?",
    type: "choice",
    options: [
      { label: "Nam", value: "Male" },
      { label: "Nữ", value: "Female" },
    ],
  },
  { key: "height", question: "Chiều cao của bạn (vd: 1,6/1.6 m):", type: "number" },
  { key: "weight", question: "Cân nặng của bạn (kg):", type: "number" },
  {
    key: "hypertension",
    question: "Bạn có bị cao huyết áp không?",
    type: "choice",
    options: [
      { label: "Có", value: 1 },
      { label: "Không", value: 0 },
    ],
  },
  {
    key: "heart_disease",
    question: "Bạn có bị bệnh tim mạch không?",
    type: "choice",
    options: [
      { label: "Có", value: 1 },
      { label: "Không", value: 0 },
    ],
  },
  {
    key: "diabetes",
    question: "Bạn có bị tiểu đường không?",
    type: "choice",
    options: [
      { label: "Có", value: 1 },
      { label: "Không", value: 0 },
    ],
  },
  {
    key: "exercise",
    question: "Bạn có thường xuyên tập thể dục không?",
    type: "choice",
    options: [
      { label: "Có", value: 1 },
      { label: "Không", value: 0 },
    ],
  },
  {
    key: "smoking_status",
    question: "Tình trạng hút thuốc của bạn?",
    type: "choice",
    options: [
      { label: "Đang hút", value: "smokes" },
      { label: "Đã từng hút", value: "formerly smoked" },
      { label: "Chưa bao giờ hút", value: "never smoked" },
    ],
  },
];

// Biến toàn cục
let answers = {};
const container = document.getElementById("form-container");
const resultSection = document.getElementById("result");

// Hiện câu hỏi
function showAllQuestions() {
  container.innerHTML = "";

  questions.forEach((q) => {
    const div = document.createElement("div");
    div.classList.add("question");
    div.dataset.key = q.key;

    const label = document.createElement("p");
    label.textContent = q.question;
    div.appendChild(label);

    if (q.type === "number") {
      const input = document.createElement("input");
      input.type = "number";
      input.placeholder = "Nhập giá trị...";
      input.required = true;

      input.addEventListener("input", (e) => {
        const val = e.target.value.trim();
        answers[q.key] = val ? parseFloat(val) : null;
        div.classList.remove("missing");
        checkAllAnswered();
      });

      div.appendChild(input);
    }

    if (q.type === "choice") {
      const group = document.createElement("div");
      group.classList.add("choice-group");

      q.options.forEach((opt) => {
        const option = document.createElement("div");
        option.classList.add("choice-option");

        const circle = document.createElement("div");
        circle.classList.add("choice-circle");

        const label = document.createElement("span");
        label.textContent = opt.label;

        option.appendChild(circle);
        option.appendChild(label);

        option.onclick = () => {
          group.querySelectorAll(".choice-circle").forEach((c) => c.classList.remove("active"));
          circle.classList.add("active");
          answers[q.key] = opt.value;
          div.classList.remove("missing");
          checkAllAnswered();
        };

        group.appendChild(option);
      });

      div.appendChild(group);
    }

    container.appendChild(div);
  });

  const submitDiv = document.createElement("div");
  submitDiv.classList.add("submit-section");

  const btn = document.createElement("button");
  btn.textContent = "Dự đoán nguy cơ";
  btn.classList.add("submit-btn");
  btn.onclick = validateAndSubmit;

  submitDiv.appendChild(btn);
  container.appendChild(submitDiv);
}

// Kiểm tra câu trả lời
function checkAllAnswered() {
  const allAnswered = questions.every(
    (q) => answers[q.key] !== undefined && answers[q.key] !== null && answers[q.key] !== ""
  );
  const btn = document.querySelector(".submit-btn");

  // Không disable nút — chỉ đổi style cho dễ nhìn
  if (allAnswered) {
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
  } else {
    btn.style.opacity = "0.6";
    btn.style.cursor = "not-allowed";
  }
}

// Kiểm tra trước khi gửi
function validateAndSubmit() {
  let missingCount = 0;
  let firstMissing = null;

  questions.forEach((q) => {
    const div = container.querySelector(`[data-key="${q.key}"]`);
    if (!answers[q.key] && answers[q.key] !== 0) {
      div.classList.add("missing");
      if (!firstMissing) firstMissing = div;
      missingCount++;
    } else {
      div.classList.remove("missing");
    }
  });

  if (missingCount > 0) {
    firstMissing.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    firstMissing.style.transition = "box-shadow 0.5s ease";
    firstMissing.style.boxShadow = "0 0 15px 3px rgba(198,40,40,0.4)";

    setTimeout(() => {
      firstMissing.style.boxShadow = "none";
    }, 1000);

    alert("Vui lòng trả lời tất cả các câu hỏi trước khi dự đoán!");
    return;
  }
  submitToBackend();
}

// Gửi dữ liệu lên backend
async function submitToBackend() {
  try {
    const res = await fetch("https://stronkepredict.onrender.com/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers),
    });

    if (!res.ok) throw new Error("Không thể kết nối server");
    const data = await res.json();

    document.getElementById("result-section").style.display = "block";

    const level = data.risk_level.trim().toLowerCase();
    let riskClass = "";
    if (level === "low") riskClass = "Low";
    else if (level === "medium") riskClass = "Medium";
    else riskClass = "High";

    resultSection.innerHTML = `
      <h3>Kết quả dự đoán:</h3>
      <p class="risk-level ${riskClass}">Mức nguy cơ: ${data.risk_level}</p>
      <div class="advice-box">
        <p>${data.advice.replace(/\n/g, "<br>")}</p>
      </div>
    `;

    resultSection.scrollIntoView({ behavior: "smooth" });
  } catch (err) {
    alert("Có lỗi xảy ra khi gửi dữ liệu!");
    console.error(err);
  }
}

// Start
document.getElementById("start-btn").addEventListener("click", () => {
  document.getElementById("intro").style.display = "none";
  container.style.display = "block";
  showAllQuestions();
});

// Menu bar
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("nav ul li a");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes(current)) {
        link.classList.add("active");
      }
    });
  });
});

window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (window.scrollY > 60) header.classList.add("scrolled");
  else header.classList.remove("scrolled");
});

// Fade
(function () {
  const SELECTORS = [
    '.stroke-hero',
    '.content-box',
    '.cause-box',
    '.stroke-box',
    '.question',
    '#result-section',
    '.box',
    'footer'
  ];
  document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
      setTimeout(() => document.body.classList.add('page-visible'), 50);
    });
    const nodes = [];
    SELECTORS.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (!el.classList.contains('fade-section')) {
          el.classList.add('fade-section');
        }
        nodes.push(el);
        if (el.classList.contains('content-box')) {
          el.querySelectorAll('h2, h3, p, .stroke-types, .stats, .box h3').forEach(child => {
            if (!child.classList.contains('fade-child')) child.classList.add('fade-child');
          });
        }

        if (el.classList.contains('stroke-hero')) {
          el.querySelectorAll('.main-title, .sub-text, .stats, .visual').forEach(child => {
            if (!child.classList.contains('fade-child')) child.classList.add('fade-child');
          });
        }
      });
    });

    const ioOptions = {
      root: null,
      rootMargin: '0px 0px -12% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        const el = entry.target;
        if (entry.isIntersecting) {
          el.classList.add('visible');
          const children = el.querySelectorAll('.fade-child');
          if (children.length) {
            children.forEach((c, i) => {
              c.style.transitionDelay = `${i * 80}ms`;
            });
          }
          obs.unobserve(el);
        }
      });
    }, ioOptions);
    nodes.forEach(n => {
      observer.observe(n);
    });
  });
})();