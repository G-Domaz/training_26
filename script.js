const scriptURL = "https://script.google.com/macros/s/AKfycbyH3h9KyLO1wyuJF_OgrorLIYRAomYcjsHtQOyB8KYq-9_PqFfXUrpTwS9rqbEkPXU9/exec";

function updateChoice2() {
  const choice1 = document.getElementById("choice1").value;
  const all = ["Reception", "Kitchen", "Service"];
  const select = document.getElementById("choice2");
  select.innerHTML = "<option value=''>-- اختر رغبة ثانية --</option>";
  all.filter(o => o !== choice1).forEach(o => {
    const opt = document.createElement("option");
    opt.value = opt.text = o;
    select.appendChild(opt);
  });
}

async function submitForm() {
  const name    = document.getElementById("name").value.trim();
  const id      = document.getElementById("national-id").value.trim();
  const phone   = document.getElementById("phone").value.trim();
  const level   = document.getElementById("level").value;
  const choice1 = document.getElementById("choice1").value;
  const choice2 = document.getElementById("choice2").value;
  const address = document.getElementById("address").value.trim();
  const msg     = document.getElementById("message");
  const loading = document.getElementById("loading");

  if (!name || !id || !phone || !level || !choice1 || !choice2 || !address) {
    alert("يرجى ملء جميع البيانات.");
    return;
  }

  loading.style.display = "block";
  msg.innerText = "";
  msg.className = "";

  const formData = new URLSearchParams();
  formData.append("name",    name);
  formData.append("id",      id);
  formData.append("phone",   phone);
  formData.append("level",   level);
  formData.append("choice1", choice1);
  formData.append("choice2", choice2);
  formData.append("address", address);

  try {
    const res  = await fetch(scriptURL, { method: "POST", body: formData });
    const text = await res.text();
    loading.style.display = "none";

    if (text === "SAVED") {
      msg.innerText = "✅ تم تسجيلك بنجاح! شكراً.";
      msg.className = "success";
      document.querySelector(".form-section").style.display = "none";
    } else if (text === "ALREADY_REGISTERED") {
      msg.innerText = "❌ تم تسجيلك مسبقاً. لا يمكن التسجيل مرة أخرى.";
      msg.className = "error";
      document.querySelector(".form-section").style.display = "none";
    } else if (text === "MISSING_DATA") {
      msg.innerText = "❌ بيانات ناقصة، يرجى ملء جميع الحقول.";
      msg.className = "error";
    } else {
      msg.innerText = "❌ حدث خطأ غير متوقع، حاول مرة أخرى.";
      msg.className = "error";
    }
  } catch (error) {
    loading.style.display = "none";
    msg.innerText = "❌ حدث خطأ في الاتصال. تأكد من الإنترنت.";
    msg.className = "error";
  }
}