const catalogView = {
    _state: null,

    /*с помощью setState связали _state catalogView с глобальным state*/
    setState(state) {
        this._state = state
    },

    _usersElement: null,

    /*отрисовка юзеров*/
    renderUsers() {
        /*получаю блок main и вставляю в него родительский блок для юзеров*/
        document.getElementById('root').innerHTML = `
            <div class="users">
                <div class="users__wrapper" id="users">
                </div>
            </div>`

        /*получаю родительский блок для юзеров*/
        this._usersElement = document.getElementById('users');

        /*в переменную users получаем необходимую часть данных из state.js*/
        let users = this._state.getUsers();

        /*создаю переменную, которая будет накапливать в себя всю разметку для юзеров*/
        let htmlString = ``;

        /*прохожу по массиву юзеров и на каждом цикле добавляю в htmlString разметку для юзера.
        каждому юзеру дата-атрибуты, говорящие о его id и о том, загружен ли его внутренний контент*/
        users.forEach(
            (u) => {
                htmlString += `
                    <div class="user">
                        <span class="user__name user__name_close" data-user-id=${u.id}>
                            ${u.name}
                         </span>
                         <div id="user-${u.id}" data-loaded="false" class="user__albums"></div>
                    </div>
                `
            }
        )

        /*в родительский блок юзеров добавляю всю накопившуюся в htmlString разметку*/
        this._usersElement.innerHTML = htmlString;

        /*получаю элементы с именами юзеров и вешаю на них обработчик клика, используя дата-атрибут userId*/
        let usersElements = this._usersElement.querySelectorAll('.user span');
        usersElements.forEach(uEl => {
            uEl.addEventListener('click', (e) => {
                let userId = +e.currentTarget.dataset.userId;
                this.onUserNameClick(userId);
            });
        })
    },

    /*обработчик клика на юзера*/
    async onUserNameClick(userId) {

        /*получаю блок с альбомами юзера*/
        let targetElement = document.querySelector(`#user-${userId}`);

        /*если у блока с альбомами есть класс active, то при клике на юзера прячем альбомы. изначально нет active*/
        if (targetElement.classList.contains('active')) {
            targetElement.classList.remove('active');
            return;
        }

        /*если дата-атрибуту loaded присвоился true, то покажем альбомы. изначально false*/
        if (targetElement.dataset.loaded === 'true') {
            targetElement.classList.add('active');
            return;
        }

        /*отправляем запрос на сервер за альбомами юзера и записываем их в state в переменную _albums*/
        await this._state.loadAlbums(userId);

        /*получаем из state альбомы и помещаем их в переменную albums*/
        let albums = await this._state.getAlbums(userId);

        /*создаем переменную, в которой будем накапливать html для альбомов*/
        let htmlString = ``;

        /*проходим по массиву альбомов и добавляем в htmlString разметку, добавляем дата-атрибуты для названий альбомов*/
        albums.forEach(a => {
            htmlString += `
            <div class="album">
                <span class="album__name album__name_close" data-album-id=${a.id} id="album-${a.id}-title">
                    ${a.title}
                </span>
                <div class="album__photos" data-loaded="false" id="album-${a.id}"></div>
            </div>
        `
        });

        /*вставляем весь накопленный html в блок альбомов, присваиваем дата-атрибуту loaded true
        и добавляем класс active. тем самым у нас происходит отображение альбомов*/
        targetElement.innerHTML = htmlString;
        targetElement.dataset.loaded = 'true';
        targetElement.classList.add('active');

        /*получаем элементы названий всех альбомов юзера*/
        let albumsElements = targetElement.querySelectorAll('.album span');

        /*вешаем на элементы названий альбомов обработчики клика*/
        albumsElements.forEach(aEl => {
            aEl.addEventListener('click', (e) => {
                e.stopPropagation();
                let albumId = +e.currentTarget.dataset.albumId;
                this.onAlbumNameClick(albumId);
            });
        })

    },

    /*обработчик клика на альбом*/
    async onAlbumNameClick(albumId) {

        /*делаем запрос на сервер за фотографиями альбома и записываем их в _photos*/
        await this._state.loadPhotos(albumId);

        /*берем из state фотографии и помещаем их в переменную photos*/
        let photos = await this._state.getPhotos(albumId);

        /*получаем блок фотографий выбранного альбома*/
        let targetElement = document.querySelector(`#album-${albumId}`);

        /*если у блока с альбомами есть класс active, то при клике на юзера прячем альбомы. изначально нет active*/
        if (targetElement.classList.contains('active')) {
            targetElement.classList.remove('active');
            return;
        }

        /*если дата-атрибуту loaded присвоился true, то покажем альбомы. изначально false*/
        if (targetElement.dataset.loaded === 'true') {
            targetElement.classList.add('active');
            return;
        }

        /*создаем переменную, в которой будем накапливать html для фотографий*/
        let htmlString = ``;

        /*проходим по массиву фотографий и добавляем в htmlString разметку, добавляем
        дата-атрибуты для фото звезды*/
        photos.forEach(p => {

            /*проверяем каждое фото на наличие его в списке избранных фото внутри state*/
            let isFavorite = this._state.isPhotoFavorite(p.id);

            /*накапливаем в htmlString разметку фотографий*/
            htmlString += `
            <div class="photo">
                <img src=${p.thumbnailUrl} alt="${p.title}" class="photo__small" 
                    data-photo-id=${p.id} 
                    data-album-id=${albumId}
                    id="photo-${p.id}"
                    title="${p.title}"/>
                <span class="photo__star  ${isFavorite ? 'photo__star_gold' : 'photo__star_grey'}" 
                    data-photo-id=${p.id}
                    id="star-${p.id}"></span>
            </div>
            `
        });

        /*добавляем в блок фотографий выбранного альбома разметку*/
        targetElement.innerHTML = htmlString;
        targetElement.classList.add('active')
        targetElement.dataset.loaded = 'true'

        /*получаем все фото из альбома*/
        let photosElements = targetElement.querySelectorAll('.photo img');

        /*проходим по массиву фото и вешаем на фотографии обработчик клика, затем вызываем модуль
        показа модального окна с большой версией фотографии*/
        photosElements.forEach(pEl => {
            pEl.addEventListener('click', (e) => {
                /*запрещаем всплытие события*/
                e.stopPropagation();

                /*получаем из дата-атрибутов id альбома и фото, чтоб выполнить метод state по получению
                конкретного объекта фото, из свойста _photos, затем вызываем метод по показу модального
                окна и внутрь параметром отправляем большую версию фотографии*/
                let albumId = +e.currentTarget.dataset.albumId;
                let photoId = +e.currentTarget.dataset.photoId;
                let photo = this._state.getPhoto(albumId, photoId);

                modal.show(`<img src="${photo.url}"/>`);
            });
        })

        /*получаем элементы звезд всех фотографий данного альбома*/
        let starsElements = targetElement.querySelectorAll('.photo span.photo__star');

        /*проходим по массиву звезд и вешаем обработчик клика*/
        starsElements.forEach(sEl => {
            sEl.addEventListener('click', async (e) => {
                e.stopPropagation();

                /*получаем из дата-атрибута id фото*/
                let photoId = +e.currentTarget.dataset.photoId;
                let photo = photos.filter(p => p.id === photoId)
                console.log(photo);
                /*проверяем, есть ли это фото в массиве избранных фото. в зависимости
                от этого делаем звезду серой или золотой*/
                let isFavorite = await this._state.toggleFavorite(...photo);
                if (isFavorite) {
                    e.currentTarget.classList.add('photo__star_gold');
                    e.currentTarget.classList.remove('photo__star_grey');
                } else {
                    e.currentTarget.classList.remove('photo__star_gold');
                    e.currentTarget.classList.add('photo__star_grey');
                }
            });
        })
    },
    async onPhotoClick() {

    }

}
