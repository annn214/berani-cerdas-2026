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

function simulasi(event) {
    event.preventDefault();

    document
        .getElementById("hasil")
        .classList.add("show");
}