
const FamilyController = {
    generationMap: new Map(),

    async init() {
        const message = document.getElementById("message");

        try {
            const people = await FamilyModel.loadPeople();

            document.getElementById("memberCount").textContent =
                people.length;

            const generations = this.getGenerations(people);

            FamilyView.renderFamilyTree(generations);

            // Store each person's generation number (1, 2, 3...)
            people.forEach(person => {
                const index = generations.findIndex(group =>
                    group.some(member => member.id === person.id)
                );

                this.generationMap.set(person.id, index + 1);
            });

            // Search and generation filter
            const searchInput = document.getElementById("searchInput");
            const generationFilter =
                document.getElementById("generationFilter");

            const filterMembers = () => {
                const keyword = searchInput.value
                    .toLowerCase()
                    .trim();

                const selectedGeneration = generationFilter.value;

                const filtered = people.filter(person => {
                    const generation =
                        this.generationMap.get(person.id);

                    const matchesName = person.name
                        .toLowerCase()
                        .includes(keyword);

                    const matchesGenerationSearch =
                        `generation ${generation}`.includes(keyword);

                    const matchesSearch =
                        keyword === "" ||
                        matchesName ||
                        matchesGenerationSearch;

                    const matchesFilter =
                        selectedGeneration === "all" ||
                        generation === Number(selectedGeneration);

                    return matchesSearch && matchesFilter;
                });

                FamilyView.renderMembers(filtered);
            };

            searchInput.addEventListener("input", filterMembers);
            generationFilter.addEventListener("change", filterMembers);

            // Display all members when the page loads
            filterMembers();

            message.textContent = "Family data loaded successfully.";

        } catch (error) {
            console.error(error);

            message.textContent =
                "Unable to load family data. Please check your files.";
        }
    },

    getGenerations(people) {
        const personMap = new Map(
            people.map(person => [person.id, person])
        );

        const cache = new Map();
        const visiting = new Set();

        function getGeneration(person) {
            if (cache.has(person.id)) {
                return cache.get(person.id);
            }

            // Prevent infinite recursion if data contains a cycle
            if (visiting.has(person.id)) {
                return 0;
            }

            visiting.add(person.id);

            const parents = [
                personMap.get(person.fatherId),
                personMap.get(person.motherId)
            ].filter(Boolean);

            const generation = parents.length
                ? Math.max(...parents.map(getGeneration)) + 1
                : 0;

            visiting.delete(person.id);
            cache.set(person.id, generation);

            return generation;
        }

        people.forEach(person => getGeneration(person));

        const grouped = new Map();

        people.forEach(person => {
            const generation = cache.get(person.id);

            if (!grouped.has(generation)) {
                grouped.set(generation, []);
            }

            grouped.get(generation).push(person);
        });

        return [...grouped.entries()]
            .sort((a, b) => a[0] - b[0])
            .map(entry => entry[1]);
    },

    showRelationships(id) {
        const person = FamilyModel.getPersonById(id);

        if (!person) return;

        const father = FamilyModel.getPersonById(person.fatherId);
        const mother = FamilyModel.getPersonById(person.motherId);

        const spouseNames = (person.spouses || [])
            .map(spouse => FamilyModel.getPersonById(spouse.id))
            .filter(Boolean)
            .map(spouse => spouse.name);

        const children = FamilyModel.people.filter(child =>
            child.fatherId === person.id ||
            child.motherId === person.id
        );

        FamilyView.showRelationships(
            person,
            father,
            mother,
            spouseNames,
            children
        );
    }
};

document.addEventListener("DOMContentLoaded", () => {
    FamilyController.init();
});
