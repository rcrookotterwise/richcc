//Event listeners
let authorLinks = document.querySelectorAll(".author-link");
for (const authorLink of authorLinks) {
    authorLink.addEventListener("click", getAuthorInfo);
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

async function getAuthorInfo(event) {
    event.preventDefault();
    let url = `/api/author/${this.id}`;
    let response = await fetch(url);
    let data = await response.json();

    if (!response.ok || data.length === 0) {
        return;
    }

    const author = data[0];
    let authorInfo = document.querySelector("#authorInfo");
    authorInfo.innerHTML = `
        <div class="author-profile">
            <img class="author-portrait" src="${escapeHtml(author.portrait)}"
                 alt="Portrait of ${escapeHtml(author.firstName)} ${escapeHtml(author.lastName)}">
            <div>
                <h2 class="author-name">${escapeHtml(author.firstName)} ${escapeHtml(author.lastName)}</h2>
                <div class="author-profession">${escapeHtml(author.profession || "Author")}</div>
                <dl class="author-details">
                    <dt>Country</dt><dd>${escapeHtml(author.country || "Not listed")}</dd>
                    <dt>Born</dt><dd>${author.dob ? new Date(author.dob).toLocaleDateString() : "Not listed"}</dd>
                    <dt>Died</dt><dd>${author.dod ? new Date(author.dod).toLocaleDateString() : "Not listed"}</dd>
                </dl>
            </div>
        </div>
        <div class="author-biography">
            <strong>Biography</strong>
            <p>${escapeHtml(author.biography || "No biography available.")}</p>
        </div>`;

    const myModal = new bootstrap.Modal(document.getElementById('authorModal'));
    myModal.show();
}
