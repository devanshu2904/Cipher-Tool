// Cipher Functions
function caesarCipher(text, shift, mode) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";

    shift = mode === "encode" ? shift : -shift;

    for (let char of text) {
        const isLetter = /[A-Z]/i.test(char);
        if (isLetter) {
            const isUpper = char === char.toUpperCase();
            char = char.toUpperCase();
            const index = (alphabet.indexOf(char) + shift + 26) % 26;
            result += isUpper ? alphabet[index] : alphabet[index].toLowerCase();
        } else {
            result += char;
        }
    }

    return result;
}

function vigenereCipher(text, keyword, mode) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    let keywordIndex = 0;

    text = text.toUpperCase();
    keyword = keyword.toUpperCase();

    for (let char of text) {
        if (alphabet.includes(char)) {
            const textIndex = alphabet.indexOf(char);
            const keyIndex = alphabet.indexOf(keyword[keywordIndex % keyword.length]);
            let newIndex;

            if (mode === "encode") {
                newIndex = (textIndex + keyIndex) % 26;
            } else if (mode === "decode") {
                newIndex = (textIndex - keyIndex + 26) % 26;
            }

            result += alphabet[newIndex];
            keywordIndex++;
        } else {
            result += char;
        }
    }

    return result;
}

// UI Logic
document.getElementById("submit").addEventListener("click", () => {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    const cipher = document.querySelector('input[name="cipher"]:checked').value;
    const text = document.getElementById("text-input").value;

    let result = "";

    if (cipher === "caesar") {
        const shift = parseInt(document.getElementById("shift-input").value);
        result = caesarCipher(text, shift, mode);
    } else if (cipher === "vigenere") {
        const keyword = document.getElementById("keyword-input").value;
        result = vigenereCipher(text, keyword, mode);
    }

    document.getElementById("output").value = result;

    // File Handling
    const fileInput = document.getElementById("file-input");
    const downloadLink = document.getElementById("download-link");

    if (fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = () => {
            const fileContent = reader.result;
            let fileResult = cipher === "caesar"
                ? caesarCipher(fileContent, parseInt(document.getElementById("shift-input").value), mode)
                : vigenereCipher(fileContent, document.getElementById("keyword-input").value, mode);

            const blob = new Blob([fileResult], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.style.display = "inline-block";
        };
        reader.readAsText(fileInput.files[0]);
        
    }
});

// Cipher Option Toggle
document.querySelectorAll('input[name="cipher"]').forEach(input => {
    input.addEventListener("change", () => {
        document.getElementById("caesar-controls").style.display = input.id === "caesar" ? "block" : "none";
        document.getElementById("vigenere-controls").style.display = input.id === "vigenere" ? "block" : "none";
    });
});
