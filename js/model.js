
const FamilyModel = {
    people: [],

    async loadPeople() {
        const response = await fetch("data/people.json");

        if (!response.ok) {
            throw new Error("Unable to load family data.");
        }

        this.people = await response.json();
        return this.people;
    },

    getPersonById(id) {
        return this.people.find(person => person.id === id);
    }
};
