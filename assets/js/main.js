async function submitForm(endpoint, formId) {
    const form = document.getElementById(formId);

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = Object.fromEntries(new FormData(form));

        const res = await fetch(`/api/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const result = await res.json();

        if (result.success) {
            alert("Submitted successfully!");
            form.reset();
        } else {
            alert("Submission failed.");
        }
    });
}

