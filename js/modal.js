const modal = {

    /*получаем модальное окно, его внутреннее содержимое и подложку*/
    _el: document.getElementById("modal"),
    _elContent: document.getElementById("modal").querySelector(".content"),
    _elBackground: document.getElementById("modal").querySelector(".background"),


    init() {
        this._elBackground.addEventListener("click", () => {
           this.hide();
        });
    },

    show(content) {
        this._elContent.innerHTML = content;
        this._el.classList.add("active");

    },
    hide() {
        this._el.classList.remove("active");
    }
}
