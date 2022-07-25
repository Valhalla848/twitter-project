let API = "http://localhost:8000/products";
let search = document.querySelector(".search");
let div = document.querySelector("#app1");
let cont = document.querySelector("#nickname");
let phone = document.querySelector("#img");
let btnAdd = document.querySelector("#btn-add");
let card = document.querySelector(".card");
let cardMain = document.querySelector(".card-main");
let close = document.querySelector("#close");
let app2 = document.querySelector("#app2");
let last = document.querySelector("#text");
let dlt = document.querySelector(".delete");
let edt = document.querySelector("#edit");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");
let paginationList = document.querySelector(".pagination-list");
let currentPage = 1;
let pageTotalCount = 1;
let infoInput = document.querySelector("#infoInput");
let info = document.querySelector("#info");
let editName = document.querySelector("#edit-name");
let editLast = document.querySelector("#edit-last");
let editPhone = document.querySelector("#edit-phone");
let btnSaveEdit = document.querySelector("#btn-save-edit");
let modul1 = document.querySelector(".modul1");
let star = document.querySelector(".star");
let searchVal = "";
let obj = {
  cont: cont.value,
  last: last.value,
  phone: phone.value,
};

btnAdd.addEventListener("click", async () => {
  let obj = {
    cont: cont.value,
    last: last.value,
    phone: phone.value,
  };
  if (!obj.cont.trim() || !obj.last.trim()) {
    alert("Пьяный что ли?");
    return;
  }
  await fetch(API, {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  });
  cont.value = "";
  phone.value = "";
  last.value = "";

  render();
});
async function render() {
  let products = await fetch(
    `${API}?q=${searchVal}&_page=${currentPage}&_limit=10`
  ).then((res) => res.json());
  // console.log(products);
  drawPageButtons();
  div.innerHTML = "";
  products.forEach((e) => {
    let newElem = document.createElement("div");
    newElem.innerHTML = `<p class="pname" id=${e.id}>${e.cont}</p>
    <p class="ptext" id=${e.id}>${e.last}</p>

${e.phone ? ` <img src=${e.phone} alt="" class="pimg" id=${e.id}/>` : ""}
   `;
    div.append(newElem);
  });
}
render();

//? search
search.addEventListener("input", () => {
  searchVal = search.value;
  render();
});
document.addEventListener("click", async (e) => {
  // console.log("its me p");
  if (e.target.classList.contains("pname")) {
    let id = e.target.id;

    let contact = await fetch(`${API}/${id}`).then((res) => res.json());
    console.log(contact);
    cardMain.style.display = "block";
    card.style.textAlign = "center";
    cardMain.style.position = "fixed";
    cardMain.style.zIndex = "2";
    cardMain.style.left = "50%";
    cardMain.style.top = "50%";
    cardMain.style.transform = "translate(-50%,-50%)";
    cardMain.style.background = "#fff";
    cardMain.style.width = "20vw";
    cardMain.style.height = "20vh";
    cardMain.style.color = "black";
    app2.style.filter = "blur(5px)";
    card.innerHTML = `
    
    <p class="name">NickName: ${contact.cont}</p>
    <p class="last">Text: ${contact.last}</p>
    <div class="threebtn">
    <button class="delete btn-dlt" id=${contact.id}>Delete</button>
    <button id="edit" class="btn-edit">Edit</button>
    <button id="close">Close</button>
    </div>
    
    `;

    close.addEventListener("click", () => {
      cardMain.style.display = "none";
      app2.style.filter = "blur(0)";
    });
    render();
  }
});
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-dlt")) {
    let id = e.target.id;
    // console.log(id);
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
  }
  cardMain.style.display = "none";
  app2.style.filter = "blur(0)";
  render();
});
// ? pagination
function drawPageButtons() {
  fetch(`${API}?q=${searchVal}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      // console.log(data.length);
      pageTotalCount = Math.ceil(data.length / 9);
      paginationList.innerHTML = "";

      for (let i = 1; i <= pageTotalCount; i++) {
        if (currentPage == i) {
          let page = document.createElement("li");
          page.innerHTML = `<li class="page-item active"><a class="page-link page_number" href="#">${i}</a></li>`;
          paginationList.append(page);
        } else {
          let page = document.createElement("li");
          page.innerHTML = `<li class="page-item"><a class="page-link page_number" href="#">${i}</a></li>`;
          paginationList.append(page);
        }
      }

      if (currentPage == 1) {
        prev.style.display = "none";
      } else {
        prev.style.display = "flex";
        prev.style.color = "white";
      }

      if (currentPage == pageTotalCount) {
        next.style.color = "white";
        next.style.display = "flex";
      } else {
      }
    });
}

prev.addEventListener("click", () => {
  if (currentPage <= 1) {
    return;
  }
  currentPage--;
  render();
});

next.addEventListener("click", () => {
  if (currentPage >= pageTotalCount) {
    return;
  }
  currentPage++;
  render();
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("page_number")) {
    currentPage = e.target.innerText;
    render();
    // console.log(e.target.innerText);
  }
});
//! редактирование продукта
//? для заполнения полейч
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-edit")) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editName.value = data.title;
        editLast.value = data.price;
        editPhone.value = data.descr;
        btnSaveEdit.setAttribute("id", data.id);
      });
  }
});

// кнопка из модалки для сохранения
btnSaveEdit.addEventListener("click", (e) => {
  let id = e.target.id;
  let name = editName.value;
  let last = editLast.value;
  let phone = editPhone.value;

  let edittedProduct = {
    name: name,
    last: last,
    phone: phone,
  };
  saveEdit(edittedProduct, id);
});
async function saveEdit(edittedProduct, id) {
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(edittedProduct),
  });
  render();
}
