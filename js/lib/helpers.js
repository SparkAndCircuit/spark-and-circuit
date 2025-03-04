export const DataHelpers = {
    async fetchData(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    },

    persistData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    retrieveData(key) {
        return JSON.parse(localStorage.getItem(key)) || null;
    }
};

export const DOMHelpers = {
    createElement(tag, classes, innerHTML) {
        const el = document.createElement(tag);
        if (classes) el.className = classes;
        if (innerHTML) el.innerHTML = innerHTML;
        return el;
    },

    qs(selector, parent = document) {
        return parent.querySelector(selector);
    },

    qsa(selector, parent = document) {
        return [...parent.querySelectorAll(selector)];
    }
};