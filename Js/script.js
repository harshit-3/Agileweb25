document.addEventListener("DOMContentLoaded", function () {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    const submitButton = document.querySelector("button[type='submit']");
    const totalPractices = checkboxes.length;
    const successThreshold = Math.floor(totalPractices * 0.8); // 80% completion to get a reward

    function updateSummary() {
        let checkedCount = 0;

        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                checkedCount++;
            }
        });

        let summaryText = `You have completed ${checkedCount} out of ${totalPractices} best practices.`;
        document.getElementById("summary").innerText = summaryText;

        if (checkedCount >= successThreshold) {
            fetchAnimalImage();
        }
    }

    function fetchAnimalImage() {
        fetch("https://dog.ceo/api/breeds/image/random")
            .then((response) => response.json())
            .then((data) => {
                let img = document.createElement("img");
                img.src = data.message;
                img.alt = "Cute animal";
                img.style.maxWidth = "300px";
                document.getElementById("reward").innerHTML = "";
                document.getElementById("reward").appendChild(img);
            })
            .catch((error) => console.error("Error fetching animal image:", error));
    }

    checkboxes.forEach((checkbox) => {
        // Load saved state
        if (localStorage.getItem(checkbox.id) === "true") {
            checkbox.checked = true;
        }

        // Save state on change
        checkbox.addEventListener("change", () => {
            localStorage.setItem(checkbox.id, checkbox.checked);
            updateSummary();
        });
    });

    // Add summary section
    let summaryDiv = document.createElement("div");
    summaryDiv.id = "summary";
    summaryDiv.style.margin = "20px";
    summaryDiv.style.fontWeight = "bold";
    document.body.insertBefore(summaryDiv, document.querySelector("form"));

    // Add reward section
    let rewardDiv = document.createElement("div");
    rewardDiv.id = "reward";
    rewardDiv.style.marginTop = "20px";
    document.body.appendChild(rewardDiv);

    // Initialize summary on page load
    updateSummary();

    submitButton.addEventListener("click", function (event) {
        event.preventDefault();
        alert("Your selections have been saved.");
    });
});
