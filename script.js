let materiali = [];
let materialiFiltrati = [];

fetch("materiali.json")
  .then(response => response.json())
  .then(data => {
    materiali = data;
    popolaProduttori();
    // Assicura che i menu siano reattivi solo dopo il caricamento
    document.getElementById("produttore").disabled = false;
    document.getElementById("materiale").disabled = false;
  })
  .catch(error => {
    console.error("Errore nel caricamento dei materiali:", error);
  });

function popolaProduttori() {
  const produttori = [...new Set(materiali.map(m => m.produttore))];
  const select = document.getElementById("produttore");
  select.innerHTML = "<option value=''>-- Seleziona --</option>";
  produttori.forEach(p => {
    const option = document.createElement("option");
    option.value = p;
    option.textContent = p;
    select.appendChild(option);
  });
}

function aggiornaMateriali() {
  const produttore = document.getElementById("produttore").value;
  const selectMateriale = document.getElementById("materiale");
  selectMateriale.innerHTML = "<option value=''>-- Seleziona --</option>";

  materialiFiltrati = materiali.filter(m => m.produttore === produttore);
  materialiFiltrati.forEach(m => {
    const option = document.createElement("option");
    option.value = m.nome;
    option.textContent = m.nome;
    selectMateriale.appendChild(option);
  });

  aggiornaDatiMateriale();
}

function aggiornaDatiMateriale() {
  const nome = document.getElementById("materiale").value;
  const materiale = materialiFiltrati.find(m => m.nome === nome);
  if (!materiale) {
    document.getElementById("fusione").value = "";
    document.getElementById("densita").value = "";
    document.getElementById("calore").value = "";
    document.getElementById("costo").value = "";
    return;
  }

  document.getElementById("fusione").value = materiale.punto_fusione || "";
  document.getElementById("densita").value = materiale.densita || "";
  document.getElementById("calore").value = materiale.calore_latente || "";
  document.getElementById("costo").value = materiale.costo || "";
}

function calcola() {
  const batterie = parseFloat(document.getElementById("batterie").value);
  const energia = parseFloat(document.getElementById("energia").value);
  const calore = parseFloat(document.getElementById("calore").value);
  const densita = parseFloat(document.getElementById("densita").value);
  const costo = parseFloat(document.getElementById("costo").value);
  const massaInput = document.getElementById("massa_pcm");
  const volumeOutput = document.getElementById("volume");
  const volumeBatteriaOutput = document.getElementById("volume_batteria");
  const energiaVolumeOutput = document.getElementById("energia_volume");
  const costoTotaleOutput = document.getElementById("costo_totale");

  let massa = parseFloat(massaInput.value);

  if (isNaN(massa) && !isNaN(batterie) && !isNaN(energia) && !isNaN(calore) && calore !== 0) {
    massa = (energia * batterie * 3600) / calore;
    massaInput.value = massa.toFixed(2);
  }

  if (!isNaN(massa)) {
    if (!isNaN(costo)) {
      const costoTotale = massa * costo;
      costoTotaleOutput.value = costoTotale.toFixed(2);
    } else {
      costoTotaleOutput.value = "";
    }
  } else {
    costoTotaleOutput.value = "";
  }

  if (!isNaN(massa) && !isNaN(densita) && densita !== 0) {
    const volumeLitri = (massa * 1000) / densita / 1000;
    volumeOutput.value = volumeLitri.toFixed(2);

    if (!isNaN(batterie) && batterie !== 0) {
      volumeBatteriaOutput.value = (volumeLitri / batterie).toFixed(2);
    }

    if (!isNaN(calore)) {
      const energiaVolume = ((volumeLitri * 1000 * densita * calore) / 3600) / 1000;
      energiaVolumeOutput.value = energiaVolume.toFixed(3);
    }
  }

  const record = {
    produttore: document.getElementById("produttore").value,
    materiale: document.getElementById("materiale").value,
    fusione: document.getElementById("fusione").value,
    batterie: batterie,
    energia: energia,
    massa: massaInput.value,
    volume_batteria: volumeBatteriaOutput.value,
  };

  const storico = JSON.parse(localStorage.getItem("storico")) || [];
  storico.push(record);
  localStorage.setItem("storico", JSON.stringify(storico));

  document.getElementById("risultato").textContent = "Calcolo completato.";
}

function azzera() {
  document.querySelectorAll("input").forEach(input => {
    if (input.type === "text" || input.type === "number") {
      input.value = "";
    }
  });

  document.getElementById("produttore").value = "";
  document.getElementById("materiale").innerHTML = "<option value=''>-- Seleziona --</option>";
  document.getElementById("risultato").textContent = "";
}

