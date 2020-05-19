window.addEventListener('DOMContentLoaded', () => {
    'use strict'

    onCatalogClick()
})

const onUserClick = (id) => {
    getAlbums(id)
}

const onAlbumClick = (albumId) => {
    gesPhotos(albumId)
}

const onCatalogClick = () => {
    let link = document.querySelector('#catalog')
    link.addEventListener('click', () => getUsers())
}

class Star {
    isFavorite = false
    onStarClick(id) {
        let star = document.querySelector(`#star-${id}`)
        this.isFavorite = !this.isFavorite
        if (this.isFavorite) {
            star.classList.remove('photo__star_grey')
            star.classList.add('photo__star_gold')
        } else {
            star.classList.remove('photo__star_gold')
            star.classList.add('photo__star_grey')
        }
    }
}

const getUsers = async () => {
    let url = 'https://json.medrating.org/users/';
    let response = await fetch(url);
    let content = await response.json()

    let list = document.querySelector('#users')

    let key
    for (key in content) {
        list.innerHTML += `
            <div class="user" id="${content[key].id}" onclick="onUserClick(${content[key].id})">
                <div class="user__info" id="user-info">
                    <img src="./img/svg/pointer.svg" alt="pointer" class="user__pointer"/>
                    <span class="user__name">
                        ${content[key].name}
                    </span>
                </div>
            </div>
        `
    }
    return content
}

async function getAlbums(id) {
    let url = `https://json.medrating.org/albums?userId=${id}`
    let response = await fetch(url)
    let content = await response.json()

    let list = document.querySelector('#albums')

    let key
    for (key in content) {
        list.innerHTML += `
            <div class="album">
                <div class="album__info" onclick="onAlbumClick(${content[key].id})">
                    <img src="./img/svg/pointer.svg" alt="pointer" class="album__pointer"/>
                    <span class="album__name">
                        ${content[key].title}
                    </span>
                </div>
            </div>
        `
    }
}

async function gesPhotos(albumId) {
    let url = `https://json.medrating.org/photos?albumId=${albumId}`
    let response = await fetch(url)
    let content = await response.json()

    let list = document.querySelector('#photos')

    let key
    for (key in content) {
        list.innerHTML += `
            <div class="photo">
                <img src=${content[key].thumbnailUrl} alt="${content[key].title}" class="photo__small" id="photo-${content[key].id}"/>
                <span class="photo__star photo__star_grey" id="star-${content[key].id}" onclick="Star.prototype.onStarClick(${content[key].id})"></span>
            </div>
        `
    }
}
