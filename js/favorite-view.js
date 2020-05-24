const favoriteView = {

    _state: null,

    setState(state) {
        this._state = state
    },

    _element: null,

    /*метод отрисовки блока избранных фото*/
    render() {

        document.getElementById('root').innerHTML = ` 
            <div class="favorite">
                <div class="favorite__title">
                    ИЗБРАННЫЕ ФОТО
                </div>
                <div class="favorite__photos" id="favorite__photos"></div>
            </div>`;

        /*получаем блок, в который будем помещать избранные фото*/
        this._element = document.getElementById('favorite__photos');

        /*получаем из state избранные фото*/
        let favoritePhotos = this._state.getFavoritePhotos();

        let htmlString = ``;

        /*накапливаем разметку*/
        favoritePhotos.forEach(
            (p) => {
                htmlString += `
                    <div class="photo">
                        <img src=${p.thumbnailUrl} alt="${p.title}" class="photo__small" 
                            data-photo-id=${p.id} 
                            data-album-id=${p.albumId}
                            id="photo-${p.id}"
                            title="${p.title}"/>
                        <span class="photo__star photo__star_gold" 
                            data-photo-id=${p.id}
                            id="star-${p.id}"></span>
                    </div>`
            }
        );

        /*вставляем накопленную разметку в блок избранных фото*/
        this._element.innerHTML = htmlString;

        /*вешаем обработчик клика на фотографии*/
        let favPhotosElements = this._element.querySelectorAll('.photo img');

        favPhotosElements.forEach(pEl => {
            pEl.addEventListener('click', (e) => {
                let albumId = +e.currentTarget.dataset.albumId;
                let photoId = +e.currentTarget.dataset.photoId;
                this.onFavPhotoClick(albumId, photoId)
            })
        });

        /*получаем элементы звезд со страницы*/
        let starsElements = this._element.querySelectorAll('.photo span.photo__star');

        /*вешаем обработчик клика на звезды*/
        starsElements.forEach(sEl => {
            sEl.addEventListener('click', async (e) => {
                /*получаем id фото из дата-атрибутов*/
                let photoId = +e.currentTarget.dataset.photoId;

                /*получаем фото, на которое был клик из массива избранных фото*/
                let favoritePhoto = favoritePhotos.filter(fP => fP.id === photoId);

                this.onStarClick(photoId, favoritePhoto);
            })
        })
    },

    /*обработчик клика на фото*/
    async onFavPhotoClick(albumId, photoId) {

        let photo = this._state.getFavoritePhoto(albumId, photoId);

        modal.show(`<img src="${photo.url}"/>`);

    },

    /*обработчик клика на звезду*/
    async onStarClick(photoId, favoritePhoto) {

        let star = document.querySelector(`#star-${photoId}`);

        /*вызываем метод, который уберет из массива избранных фото текущее*/
        await this._state.toggleFavorite(...favoritePhoto);

        /*меняем класс подстветки звезды*/
        star.classList.remove('photo__star_gold');
        star.classList.add('photo__star_grey');

        /*перерисовываем страницу, отображая на ней новый массив избранных фото*/
        this.render()

    }

};