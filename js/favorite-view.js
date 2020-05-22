const favoriteView = {
    _state: null,
    setState(state) {
        this._state = state
    },

    _element: null,


    render() {

        document.getElementById('root').innerHTML = ` 
            <div class="favorite">
                <div class="favorite__title">
                    favorite photos
                </div>
                <div class="favorite__photos" id="favorite__photos"></div>
            </div>`

        this._element = document.getElementById('favorite__photos')

        let favoritePhotos = this._state.getFavoritePhotos()

        let htmlString = ``

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
                    </div>
                `
            }
        )

        this._element.innerHTML = htmlString

        let favPhotosElements = this._element.querySelectorAll('.photo img')
        favPhotosElements.forEach(pEl => {
            pEl.addEventListener('click', (e) => {

                let albumId = +e.currentTarget.dataset.albumId;
                let photoId = +e.currentTarget.dataset.photoId;
                this.onFavPhotoClick(albumId, photoId)
            })
        })

        let starsElements = this._element.querySelectorAll('.photo span.photo__star')
        starsElements.forEach(sEl => {
            sEl.addEventListener('click', async (e) => {
                let photoId = +e.currentTarget.dataset.photoId
                let favoritePhoto = favoritePhotos.filter(fP => fP.id === photoId)

                let isFavorite = await this._state.toggleFavorite(...favoritePhoto)
                if (isFavorite) {
                    e.currentTarget.classList.add('photo__star_gold');
                    e.currentTarget.classList.remove('photo__star_grey');
                } else {
                    e.currentTarget.classList.remove('photo__star_gold');
                    e.currentTarget.classList.add('photo__star_grey');
                    await this.render()
                }
            })
        })
    },
    async onFavPhotoClick(albumId, photoId) {
        let photo = this._state.getFavoritePhoto(albumId, photoId);
        modal.show(`<img src="${photo.url}"/>`);
    }
}


/*
onFavPhotoClick() {
    /!*получаем все фото из альбома*!/
    let photosElements = document.querySelectorAll('.photo img');

    /!*проходим по массиву фото и вешаем на фотографии обработчик клика, затем вызываем модуль
    показа модального окна с большой версией фотографии*!/
    photosElements.forEach(pEl => {
        pEl.addEventListener('click', (e) => {
            /!*запрещаем всплытие события*!/
            e.stopPropagation();

            /!*получаем из дата-атрибутов id альбома и фото, чтоб выполнить метод state по получению
            конкретного объекта фото, из свойста _photos, затем вызываем метод по показу модального
            окна и внутрь параметром отправляем большую версию фотографии*!/
            let albumId = +e.currentTarget.dataset.albumId;
            let photoId = +e.currentTarget.dataset.photoId;
            let photo = this._state.getFavoritePhoto(albumId, photoId);

            modal.show(`<img src="${photo.url}"/>`);
        });
    })*/
