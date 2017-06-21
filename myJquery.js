(function() {

    class Collection  {
        constructor (selector) {
            if (typeof selector === 'string') {
                let elements = document.querySelectorAll(selector);
                this.elements = Array.from(elements);
            } else {
                this.elements = [];
                this.elements.push(selector);
            }
            return this;
        }

        addClass (newClass) {
            if (typeof newClass === 'string') {
                newClass = newClass.split(' ');
                this.elements.forEach( el =>
                    newClass.forEach( className =>
                        el.classList.add(className)));
            }
            if (typeof newClass === 'function') {
                this.elements.forEach((el, i) =>
                    $(el).addClass(newClass.call(el, i, el.className))
                );
            }
            return this;
        }

        append (content) {
            if (typeof content == 'string') {
                this.elements.forEach( el =>
                    el.innerHTML +=  content )
            } else {
                this.elements.forEach((el, i) =>
                    el.appendChild(content.cloneNode(true)))
            }
            return this;
        }

        html (htmlString) {
            if (!htmlString) {
                return this.elements[0].innerHTML;
            } else {
                this.elements.forEach( el =>
                    el.innerHTML = htmlString );
            }
            return this;
        }

        attr (attributeName, value) {
            if (!value) {
                return this.elements[0].getAttribute(attributeName);
            } else {
                this.elements.forEach( el => {
                    el.setAttribute(attributeName, value);
                });
            }
            return this;
        }

        children (selector) {
            if (!selector) {
                return this.elements[0].children;
            } else {
                return Array.from(this.elements[0].children)
                    .filter( el =>
                        el.classList.contains(selector.slice(1)) );
            }
        }

        css (properties) {
            if (typeof properties === 'string') {
                return getComputedStyle(this.elements[0])
                    .getPropertyValue(properties);
            }
            if (typeof properties === 'object') {
                this.elements.forEach( el => {
                    for (let property in properties) {
                        if (properties.hasOwnProperty(property)) {
                            el.style[property] = properties[property];
                        }
                    }
                });
            }
        }

        data (...args) {
            if (!args[0]) {
                return this.elements[0].dataset;
            } else if (typeof args[0] === 'string' && !args[1]) {
                return this.elements[0].dataset[args[0]];
            } else  if (typeof args[0] === 'string') {
                this.elements.forEach( el =>
                    el.dataset[args[0]] = args[1] );
            }

            if (typeof args[0] === 'object') {
                this.elements.forEach( el => {
                    for (let dataName in args[0]) {
                        if (args[0].hasOwnProperty(dataName)) {
                            el.dataset[dataName] = args[0][dataName];
                        }
                    }
                })
            }
            return this;
        }

        on (...args) {
            if (args.length == 2) {
                this.elements[0].addEventListener(args[0], args[1]);
            } else {
                this.elements[0].addEventListener(args[0], event => {
                    console.log(this.children(args[1]))
                    this.children(args[1]).forEach( child => {
                        if (event.target == child) {
                            args[2]();
                        }
                    });
                });
            }
            return this;
        }

        one (event, handler) {
            this.elements[0].addEventListener(event, function handlerTrigger() {
                handler();
                this.removeEventListener(event, handlerTrigger);
            })
            return this;
        }

        each (callback) {
            for (let i = 0; i < this.elements.length; i++) {
                if (callback.call(this.elements[i], i, this.elements[i]) === false) {
                    return false;
                }
            }
            return this;
        }
    }

    window.$ = selector =>  new Collection(selector);
})();

