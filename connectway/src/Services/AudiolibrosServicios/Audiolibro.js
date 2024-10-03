export class Audiobook {
    constructor(id, title, author, category, created, description, duration) {
        this._id = id;
        this._title = title;
        this._author = author;
        this._category = category;
        this._created = created;
        this._description = description;
        this._duration = duration;
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
}
