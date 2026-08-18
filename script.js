function bukaPopup() {
    document
        .getElementById("popup")
        .classList.add("show");

}

function tutupPopup() {
    document
        .getElementById("popup")
        .classList.remove("show");

}

async function simulasi(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/api/daftar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            const hasilDiv = document.getElementById("hasil");
            hasilDiv.innerHTML = `<strong>BERHASIL:</strong> ${data.message}`;
            hasilDiv.classList.add("show");
        } else {
            alert(data.message || "Gagal menyimpan data.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Gagal terhubung ke server backend.");
    }
}