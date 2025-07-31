let storico = JSON.parse(localStorage.getItem("storico")) || [];

const filtroProduttore = document.getElementById("filtroProduttore");
const filtroMateriale = document.getElementById("filtroMateriale");
const tabellaStorico = document.getElementById("tabellaStorico").getElementsByTagName("tbody")[0];
const tabellaPreferiti = document.getElementById("tabellaPreferiti").getElementsByTagName("tbody")[0];

fetch("materiali.json")
  .then(res => res.json())
  .then(data => {
    const produttori = [...new Set(data.map(m => m.produttore))];
    const materiali = [...new Set(data.map(m => m.nome))];

    produttori.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p;
      opt.textContent = p;
      filtroProduttore.appendChild(opt);
    });

    materiali.forEach(m => {
      const opt = document.createElement("option");
      opt.value = m;
      opt.textContent = m;
      filtroMateriale.appendChild(opt);
    });
  });

filtroProduttore.addEventListener("change", mostraRicerche);
filtroMateriale.addEventListener("change", mostraRicerche);

function mostraRicerche() {
  const produttore = filtroProduttore.value;
  const materiale = filtroMateriale.value;

  tabellaStorico.innerHTML = "";
  tabellaPreferiti.innerHTML = "";

  storico.forEach((r, i) => {
    if ((produttore && r.produttore !== produttore) || (materiale && r.materiale !== materiale)) return;

    const riga = document.createElement("tr");
    riga.innerHTML = `
      <td>${r.produttore}</td>
      <td>${r.materiale}</td>
      <td>${r.fusione}</td>
      <td>${r.batterie}</td>
      <td>${r.energia}</td>
      <td>${r.massa}</td>
      <td>${r.volume_batteria}</td>
      <td><span class="star" onclick="togglePreferito(${i})">${r.preferito ? "★" : "☆"}</span></td>
    `;

    if (r.preferito) {
      tabellaPreferiti.appendChild(riga.cloneNode(true));
    } else {
      tabellaStorico.appendChild(riga);
    }
  });
}

function togglePreferito(index) {
  storico[index].preferito = !storico[index].preferito;
  localStorage.setItem("storico", JSON.stringify(storico));
  mostraRicerche();
}

document.addEventListener("DOMContentLoaded", mostraRicerche);