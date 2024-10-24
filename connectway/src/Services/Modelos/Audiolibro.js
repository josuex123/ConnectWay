export class Audiobook {
    constructor(id, title, author, category, created, description, duration, imagenPortadaUrl, archivoUrl, updated) {
        this._id = id;
        this._title = title;
        this._author = author;
        this._category = category;
        this._created = created;
        this._description = description;
        this._duration = duration;
        this._imagenPortadaUrl = imagenPortadaUrl;
        this._archivoUrl = archivoUrl;
        this._updated = updated;
    }

    get id() {
        return this._id;
    }

    get title() {
        return this._title;
    }

    get author() {
        return this._author;
    }

    get category() {
        return this._category;
    }

    get created() {
        return this._created;
    }

    get description() {
        return this._description;
    }

    get duration() {
        return this._duration;
    }

    get imagenPortadaUrl() {
        return this._imagenPortadaUrl;
    }

    get archivoUrl() {
        return this._archivoUrl;
    }

    get updated() {
        return this._updated;
    }

    set title(value) {
        if (typeof value !== 'string') {
            throw new Error('Title must be a string');
        }
        this._title = value;
    }

    set author(value) {
        if (typeof value !== 'string') {
            throw new Error('Author must be a string');
        }
        this._author = value;
    }

    set duration(value) {
        if (typeof value !== 'number') {
            throw new Error('Duration must be a number');
        }
        this._duration = value;
    }

    set imagenPortadaUrl(value) {
        if (typeof value !== 'string') {
            throw new Error('Image URL must be a string');
        }
        this._imagenPortadaUrl = value;
    }

    set archivoUrl(value) {
        if (typeof value !== 'string') {
            throw new Error('Audio URL must be a string');
        }
        this._archivoUrl = value;
    }

    set updated(value) {
        this._updated = value;
    }
}
