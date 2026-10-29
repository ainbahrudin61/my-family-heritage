
const FamilyView = {
    renderMembers(people) {
        const container = document.getElementById("familyList");
        container.replaceChildren();

        people.forEach(person => {
            const card = document.createElement("article");
            card.className = "member-card";

            const name = document.createElement("h3");
            name.textContent = person.name;

            const gender = document.createElement("p");
            gender.textContent = `Gender: ${person.gender || "Unknown"}`;

            const dob = document.createElement("p");
            dob.textContent = `Date of Birth: ${person.dob || "Unknown"}`;

            const button = document.createElement("button");
            button.textContent = "View Relationships";

            button.addEventListener("click", () => {
                FamilyController.showRelationships(person.id);
            });

            card.append(name, gender, dob, button);
            container.appendChild(card);
        });
    },

    renderFamilyTree(generations) {
        const tree = document.getElementById("familyTree");
        tree.replaceChildren();

        const people = generations.flat();
        const find = id => people.find(person => person.id === id);

        const mdAmin = find("g1");
        const saleha = find("g2");
        const mdRamli = find("g3");
        const nassim = find("g4");
        const norhayati = find("g5");
        const bahrudin = find("g6");
        const children = ["g7", "g8", "g9"].map(find);

        if (
            !mdAmin || !saleha || !mdRamli || !nassim ||
            !norhayati || !bahrudin ||
            children.some(child => !child)
        ) {
            tree.textContent = "Family tree data is incomplete.";
            return;
        }

        const content = document.createElement("div");
        content.className = "tree-content relationship-chart";

        // Create a family member card
        const card = (person, generationClass) => {
            const element = document.createElement("div");
            element.className =
                `person-card connected-person ${generationClass}`;

            const name = document.createElement("strong");
            name.textContent = person.name;

            element.appendChild(name);
            return element;
        };

        // Create plus symbol
        const plus = () => {
            const element = document.createElement("span");
            element.className = "operator";
            element.textContent = "+";
            return element;
        };

        // Create a line element
        const line = className => {
            const element = document.createElement("div");
            element.className = className;
            return element;
        };

        // Create a couple
        const couple = (first, second) => {
            const row = document.createElement("div");
            row.className = "connected-couple";

            row.append(
                card(first, "generation-one"),
                plus(),
                card(second, "generation-one")
            );

            return row;
        };

        // Generation 1: Grandparents
        const grandparents = document.createElement("div");
        grandparents.className = "connected-ancestors";

        const leftBranch = document.createElement("div");
        leftBranch.className = "ancestor-branch";
        leftBranch.append(
            couple(mdAmin, saleha),
            line("grandparent-drop")
        );

        const rightBranch = document.createElement("div");
        rightBranch.className = "ancestor-branch";
        rightBranch.append(
            couple(mdRamli, nassim),
            line("grandparent-drop")
        );

        grandparents.append(leftBranch, rightBranch);
        content.appendChild(grandparents);

        // Generation 2: Parents
        const parents = document.createElement("div");
        parents.className = "connected-middle";

        const motherSlot = document.createElement("div");
        motherSlot.className = "parent-slot";
        motherSlot.appendChild(card(norhayati, "generation-two"));

        const fatherSlot = document.createElement("div");
        fatherSlot.className = "parent-slot";
        fatherSlot.appendChild(card(bahrudin, "generation-two"));

        parents.append(
            motherSlot,
            plus(),
            fatherSlot
        );

        content.appendChild(parents);

        // U-shaped connector below the parents
        const parentsConnector = line("parents-connector");
        content.appendChild(parentsConnector);

        // Connector above children
        const childrenConnector = document.createElement("div");
        childrenConnector.className = "children-connector-new";

        childrenConnector.append(
            line("children-stem-main"),
            line("children-horizontal-main")
        );

        content.appendChild(childrenConnector);

        // Generation 3: Children
        const childGrid = document.createElement("div");
        childGrid.className = "connected-children";

        children.forEach(child => {
            const branch = document.createElement("div");
            branch.className = "connected-child";

            branch.append(
                line("child-stem"),
                card(child, "generation-three")
            );

            childGrid.appendChild(branch);
        });

        content.appendChild(childGrid);
        tree.appendChild(content);
    },

    // Display family relationships in a popup
    showRelationships(person, father, mother, spouseNames, children, siblings) {
    const modal = document.getElementById("relationshipModal");
    const title = document.getElementById("relationshipTitle");
    const content = document.getElementById("relationshipContent");

    title.textContent = `${person.name}'s Family Relationships`;
    content.replaceChildren();

    // Format Date of Birth
    const dob = person.dob
        ? new Date(person.dob + "T00:00:00").toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
        })
        : "Unknown";

    // Display only these four details
    const details = [
        {
            label: "Father",
            value: father?.name || "Unknown"
        },
        {
            label: "Mother",
            value: mother?.name || "Unknown"
        },
        {
            label: "Sibling",
            value: siblings.map(sibling => sibling.name).join(", ") || "None"
        },
        {
            label: "Date of Birth",
            value: dob
        }
    ];

    details.forEach(detail => {
        const item = document.createElement("div");
        item.className = "relationship-item";

        const label = document.createElement("strong");
        label.textContent = detail.label;

        const value = document.createElement("p");
        value.textContent = detail.value;

        item.append(label, value);
        content.appendChild(item);
    });

    modal.hidden = false;
    document.getElementById("closeRelationshipModal").focus();
}
};


// =========================================
// SETUP RELATIONSHIP POPUP
// =========================================

function setupRelationshipModal() {
    const modal = document.getElementById("relationshipModal");
    const closeButton = document.getElementById("closeRelationshipModal");
    const closeMainButton = document.getElementById("closeRelationshipButton");

    // Check whether popup elements exist
    if (!modal || !closeButton || !closeMainButton) {
        console.error("Relationship popup elements are missing.");
        return;
    }

    // Close popup
    function closeModal() {
        modal.hidden = true;
    }

    // Close using X button
    closeButton.addEventListener("click", closeModal);

    // Close using Close button
    closeMainButton.addEventListener("click", closeModal);

    // Close when clicking the dark background
    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Close when pressing Escape
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !modal.hidden) {
            closeModal();
        }
    });
}


// Initialize popup event listeners
if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        setupRelationshipModal
    );
} else {
    setupRelationshipModal();
}
