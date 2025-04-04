document.addEventListener("DOMContentLoaded", function () {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const summary = document.createElement("p");
    const form = document.querySelector(".form");
    const imgContainer = document.createElement("div");
    imgContainer.id = "reward-image-container";
    form.appendChild(summary);
    form.appendChild(imgContainer);
    
    const STORAGE_KEY = "selectedBestPractices";
    const THRESHOLD = 12;
    let lastImageShown = false;

    function loadSelections() {
        const savedSelections = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        checkboxes.forEach(checkbox => {
            checkbox.checked = savedSelections.includes(checkbox.id);
        });
        updateSummary();
    }

    function saveSelections() {
        const selected = [...checkboxes].filter(cb => cb.checked).map(cb => cb.id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    }

    function fetchAndShowReward() {
        fetch("https://dog.ceo/api/breeds/image/random")
            .then(response => response.json())
            .then(data => {
                imgContainer.innerHTML = `<img src="${data.message}" alt="Cute dog" style="max-width:100%; border-radius:10px; margin-top:10px;">`;
            })
            .catch(error => console.error("Error fetching dog image:", error));
    }

    function updateSummary() {
        const selectedCount = [...checkboxes].filter(cb => cb.checked).length;
        summary.textContent = `You have selected ${selectedCount} / 15 best practices.`;

        if (selectedCount >= THRESHOLD) {
            fetchAndShowReward();
            lastImageShown = true;
        } else {
            imgContainer.innerHTML = "";
            lastImageShown = false;
        }
    }

    function showPopup() {
        const selectedCount = [...checkboxes].filter(cb => cb.checked).length;
        const uncheckedItems = [...checkboxes]
            .filter(cb => !cb.checked)
            .map(cb => cb.parentElement.textContent.trim());

        let message = `🎉 Congratulations! You are following ${selectedCount} / 15 best practices.\n\n`;

        if (uncheckedItems.length > 0) {
            message += `🔹 For future improvement, try to follow these methods too:\n- ${uncheckedItems.join("\n- ")}`;
        } else {
            message += `✅ You are following all best practices! Keep it up!`;
        }

        alert(message);
    }

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            saveSelections();
            updateSummary();
        });
    });

    document.querySelector(".save-btn").addEventListener("click", showPopup);

    loadSelections();
});
