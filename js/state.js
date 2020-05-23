const state = {

    _lsKey: 'favorites-photos',
    _users: [],
    _albums: {
        //"userId": []
    },
    _photos: {
        //"albumId": []
    },
    _favoritePhotos: [],

    /*метод инициализации получения отмеченных фото из localStorage*/
    init() {

        let favPhotos = localStorage.getItem(this._lsKey);

        if (favPhotos) {
            this._favoritePhotos = JSON.parse(favPhotos);
        }

    },

    /*метод загрузки юзеров, к которому обращается main.js*/
    async loadUsers() {

        /*если юзеры уже загружены, не делаем запрос на сервер*/
        if (this._users.length > 0) {
            return;
        }

        let response = await api.getUsers();
        this._users = response.filter(u => u.name !== undefined)

    },

    async loadAlbums(userId) {

        /*если альбомы загружены, не делаем запрос на сервер*/
        if (this._albums[userId] && this._albums[userId].length > 0) {
            return;
        }

        this._albums[userId] = await api.getAlbums(userId);

    },

    async loadPhotos(albumId) {

        /*если фото загружены, не делаем запрос на сервер*/
        if (this._photos[albumId] && this._photos[albumId].length > 0) {
            return;
        }

        this._photos[albumId] = await api.getPhotos(albumId);

    },

    /*метод переключения состояния звездочки, запись в local storage*/
    async toggleFavorite(photo) {

        /*проверяем, пришла новая фотография, либо та, которая уже была помечена избранной*/
        const favPhotos = this._favoritePhotos.filter((p) => p.id !== photo.id);
        let added = false;

        if (favPhotos.length === this._favoritePhotos.length) {
            this._favoritePhotos.push(photo);
            added = true;
        } else {
            /*если просле filter длина массива уменьшилась, значит эта фотография уже была в массиве и ее из него нужно убрать*/
            this._favoritePhotos = favPhotos;
        }

        localStorage.setItem(this._lsKey, JSON.stringify(this._favoritePhotos));

        /*возвращаем булево значение, говорящее о том, была ли добавлена фотография или наоборот удалена*/
        return added;

    },

    getUsers() {
        return this._users;
    },

    getAlbums(userId) {
        return this._albums[userId];
    },

    getPhotos(albumId) {
        return this._photos[albumId];
    },

    getPhoto(albumId, photoId) {
        return this.getPhotos(albumId).find(p => p.id === photoId)
    },

    isPhotoFavorite(photoId) {
        return this._favoritePhotos.find(p => p.id === photoId) !== undefined
    },

    getFavoritePhotos() {
        return this._favoritePhotos
    },

    getFavoritePhoto(albumId, photoId) {
        return this.getFavoritePhotos(albumId).find(p => p.id === photoId)
    }

};