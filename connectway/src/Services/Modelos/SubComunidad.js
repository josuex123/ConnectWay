export class Comunidad{
    constructor(id, titulo, categoria, descripcion, portadaUrl){
        this._id = id
        this._titulo = titulo
        this._categoria = categoria
        this._descripcion = descripcion
        this._portadaUrl = portadaUrl
    }

    get id(){
        return this._id
    }

    get titulo(){
        return this._titulo
    }

    get categoria(){
        return this._categoria
    }

    get descripcion(){
        return this._descripcion
    }

    get portadaUrl(){
        return this._portadaUrl
    }


    set id(value){
        this._id = value
    }

    set titulo(value){
        this._titulo = value
    }

    set categoria(value){
        this._categoria = value
    }

    set descripcion(value){
        this._descripcion = value
    }

    set portadaUrl(value){
        this._portadaUrl = value
    }

}