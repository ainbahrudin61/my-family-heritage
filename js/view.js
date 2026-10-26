
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

        // Vertical stem and horizontal line for the children
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

    showRelationships(person, father, mother, spouseNames, children) {
        const message = document.getElementById("message");
        message.replaceChildren();

        const title = document.createElement("h3");
        title.textContent = `${person.name}'s Family Relationships`;

        const details = [
            `Father: ${father?.name || "Unknown"}`,
            `Mother: ${mother?.name || "Unknown"}`,
            `Spouse: ${spouseNames.join(", ") || "None recorded"}`,
            `Children: ${children.map(child => child.name).join(", ") || "None recorded"}`
        ];

        message.appendChild(title);

        details.forEach(detail => {
            const paragraph = document.createElement("p");
            paragraph.textContent = detail;
            message.appendChild(paragraph);
        });
    }
};
