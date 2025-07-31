fetch('note.json')
.then(response => response.json())
.then(data => {
    const container = document.getElementById('noteContainer');

    data.forEach(pacchetto => {
        const div = document.createElement('div');
        div.className = 'note-box';

        let contenuto = `<strong>${pacchetto.Prodotto}</strong><br><br>`;
        for (let chiave in pacchetto) {
            if (chiave !== "Prodotto") {
                contenuto += `<strong>${chiave}:</strong> ${pacchetto[chiave]}<br>`;
            }
        }

        div.innerHTML = contenuto;
        container.appendChild(div);
    });
})
.catch(error => {
    console.error('Errore nel caricamento delle note:', error);
});



