const modal = {

    /*получаем модальное окно, его внутреннее содержимое и подложку*/
    _el: document.getElementById("modal"),
    _elContent: document.getElementById("modal").querySelector(".modal__content"),
    _elBackground: document.getElementById("modal").querySelector(".modal__background"),

    /*инициализируем обработчик клика на подложку*/
    init() {
        this._elBackground.addEventListener("click", () => {
           this.hide();
        });
    },

    /*метод показа модального окна*/
    show(content) {
        this._elContent.innerHTML = content;
        this._el.classList.add("modal_active");
    },

    /*метод закрытия модального окна*/
    hide() {
        this._el.classList.remove("modal_active");
    }

};
