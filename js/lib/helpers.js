export const DataHelpers = {
    fetchData: async (url) => {
        const response = await fetch(url);
        return response.json();
    },
    persistData: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
    retrieveData: (key) => JSON.parse(localStorage.getItem(key)) || null
};

export const DOMHelpers = {
    qs: (selector, parent = document) => parent.querySelector(selector),
    qsa: (selector, parent = document) => [...parent.querySelectorAll(selector)],
    createElement: (tag, classes = '', content = '') => {
        const el = document.createElement(tag);
        el.className = classes;
        el.innerHTML = content;
        return el;
    }
};