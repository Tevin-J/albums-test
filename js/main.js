(async () => {

    /*инициализируем работу по закрытию модального окна и записи в state данных из localStorage*/
    modal.init();
    state.init();

    /*предоставляем глобальный state отдельным презентационным js файлам, чтоб они от своего имени
    пользовались необходимыми методами для получения необходимых свойств*/
    favoriteView.setState(state);
    catalogView.setState(state);

    /*в зависимости от хэша движемся по определенной ветке действий*/
    const showPage = async () => {
        switch (location.hash) {
            case '#favorites':
                favoriteView.render();
                break;
            case '#catalog':
                await state.loadUsers();
                catalogView.renderUsers();
                break;
            default:
                defaultView.render();
        }
    };

    /*вызываем showPage() для первой отрисовки*/
    showPage();

    /*вызываем showPage всякий раз, когда изменится хэш*/
    window.addEventListener('hashchange', showPage)

})();