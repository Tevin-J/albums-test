const catalogView = {

    _state: null,

    /*с помощью setState связали _state catalogView с глобальным state*/
    setState(state) {
        this._state = state
    },

    _usersElement: null,

    /*отрисовка юзеров*/
    renderUsers() {

        /*получаем блок main и вставляем в него родительский блок для юзеров*/
        document.getElementById('root').innerHTML = `
            <div class="users">
                <div class="users__wrapper" id="users">
                </div>
            </div>`;

        /*получаем родительский блок для юзеров*/
        this._usersElement = document.getElementById('users');

        /*в переменную users получаем необходимую часть данных из state.js*/
        let users = this._state.getUsers();

        /*создаем переменную, которая будет накапливать в себя всю разметку для юзеров*/
        let htmlString = ``;

        /*проходим по массиву юзеров и на каждом цикле добавляю в htmlString разметку для юзера.
        каждому юзеру дата-атрибуты, говорящие о его id и о том, загружен ли его внутренний контент*/
        users.forEach(

            (u) => {
                htmlString += `
                    <div class="user">
                        <span class="user__name user__name_close" id="user-name-${u.id}" data-user-id=${u.id}>
                            ${u.name}
                         </span>
                         <div id="user-${u.id}" class="user__albums"></div>
                    </div>`
            }

        );

        /*в родительский блок юзеров добавляю всю накопившуюся в htmlString разметку*/
        this._usersElement.innerHTML = htmlString;

        /*получаем элементы с именами юзеров и вешаю на них обработчик клика, используя дата-атрибут userId*/
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

        /*получаем элемент с именем юзера*/
        let userName = document.querySelector(`#user-name-${userId}`);

        /*получаем блок с альбомами юзера*/
        let targetElement = document.querySelector(`#user-${userId}`);

        /*если у блока с альбомами есть класс active, то при клике на юзера прячем альбомы. изначально нет active*/
        if (targetElement.classList.contains('user__albums_active')) {
            userName.classList.remove('user__name_open');
            userName.classList.add('user__name_close');
            targetElement.classList.remove('user__albums_active');
            return
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
                <div class="album__photos" id="album-${a.id}"></div>
            </div>`
        });

        /*вставляем весь накопленный html в блок альбомов, присваиваем дата-атрибуту loaded true
        и добавляем класс active. тем самым у нас происходит отображение альбомов*/
        targetElement.innerHTML = htmlString;
        targetElement.classList.add('user__albums_active');
        userName.classList.remove('user__name_close');
        userName.classList.add('user__name_open');

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

        let albumName = document.querySelector(`#album-${albumId}-title`);

        /*берем из state фотографии и помещаем их в переменную photos*/
        let photos = await this._state.getPhotos(albumId);

        /*получаем блок фотографий выбранного альбома*/
        let targetElement = document.querySelector(`#album-${albumId}`);

        /*если у блока с альбомами есть класс active, то при клике на юзера прячем альбомы. изначально нет active*/
        if (targetElement.classList.contains('album__photos_active')) {
            albumName.classList.remove('album__name_open');
            albumName.classList.add('album__name_close');
            targetElement.classList.remove('album__photos_active');
            return
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
            </div>`
        });

        /*добавляем в блок фотографий выбранного альбома разметку*/
        targetElement.innerHTML = htmlString;
        targetElement.classList.add('album__photos_active');
        albumName.classList.remove('album__name_close');
        albumName.classList.add('album__name_open');


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
                окна*/
                let albumId = +e.currentTarget.dataset.albumId;
                let photoId = +e.currentTarget.dataset.photoId;

                this.onPhotoClick(albumId, photoId)
            });
        });

        /*получаем элементы звезд всех фотографий данного альбома*/
        let starsElements = targetElement.querySelectorAll('.photo span.photo__star');

        /*проходим по массиву звезд и вешаем обработчик клика*/
        starsElements.forEach(sEl => {
            sEl.addEventListener('click', (e) => {
                e.stopPropagation();

                /*получаем из дата-атрибута id фото*/
                let photoId = +e.currentTarget.dataset.photoId;
                let photo = photos.filter(p => p.id === photoId);

                this.onStarClick(photoId, photo)
            });
        })

    },

    /*обработчик клика на фото, в модальное окно помещаем большую версию фотографии*/
    onPhotoClick(albumId, photoId) {

        /*получаем фото из state*/
        let photo = this._state.getPhoto(albumId, photoId);

        modal.show(`<img src="${photo.url}"/>`);

    },

    async onStarClick(photoId, photo) {

        let star = document.querySelector(`#star-${photoId}`);

        /*проверяем, есть ли это фото в массиве избранных фото. в зависимости
        от этого делаем звезду серой или золотой*/
        let isFavorite = await this._state.toggleFavorite(...photo);

        if (isFavorite) {
            star.classList.add('photo__star_gold');
            star.classList.remove('photo__star_grey');
        } else {
            star.classList.remove('photo__star_gold');
            star.classList.add('photo__star_grey');
        }

    }

};