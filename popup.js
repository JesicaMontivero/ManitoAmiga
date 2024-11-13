let currentUtterance; // Variable para almacenar la utterance actual
let isPaused = false; // Estado de pausa

document.getElementById("startRead").addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: startReading,
        });
    });
});

document.getElementById("pauseResumeRead").addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: pauseResumeReading,
            args: [isPaused],
        }, (result) => {
            isPaused = result[0]; // Actualizar el estado de pausa
        });
    });
});

document.getElementById("changeColor").addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: changePageColor,
        });
    });
});

// Agregar un evento para manejar el cambio del tamaño de la fuente
document.getElementById("fontSize").addEventListener("input", function () {
    const fontSize = this.value; // Obtener el valor del slider
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: setFontSize,
            args: [fontSize],
        });
    });
});

// Agregar un evento para manejar las teclas presionadas
document.addEventListener("keydown", function (event) {
    if (event.key === "f") {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: startReading,
            });
        });
    } else if (event.key === "j") {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: pauseResumeReading,
                args: [isPaused],
            }, (result) => {
                isPaused = result[0]; // Actualizar el estado de pausa
            });
        });
    }
    else if (event.key === "g") { // funcion para cambiar de color con la letra "g"
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: changeColors
            });
        });
    }
});

function startReading() {
    // Cancelar cualquier lectura en curso
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }

    const text = document.body.innerText; // Leer todo el texto de la página
    currentUtterance = new SpeechSynthesisUtterance(text);

    // Evento al terminar la lectura
    currentUtterance.onend = function () {
        isPaused = false; // Reiniciar el estado de pausa
    };

    // Iniciar la lectura
    window.speechSynthesis.speak(currentUtterance);
}

function pauseResumeReading(isPaused) {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause(); // Pausar
        return true; // Devuelve el estado como pausado
    } else if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume(); // Reanudar
        return false; // Devuelve el estado como no pausado
    }
}
function changeColors() {
    const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16);
    
    document.body.style.backgroundColor = randomColor();
    document.body.style.color = randomColor();

    // Cambiar el color de todos los elementos de texto
    const elements = document.querySelectorAll("*");
    elements.forEach(el => {
        el.style.color = randomColor();
    });

    console.log("Colores cambiados.");
}

function changePageColor() {
    const colors = ["#0072B2", "#F0E442", "#E69F00","#CC79A7"]; // Colores para el cambio
    document.body.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
}

function setFontSize(size) {
    document.body.style.fontSize = size + 'px'; // Ajustar el tamaño de la fuente
}
