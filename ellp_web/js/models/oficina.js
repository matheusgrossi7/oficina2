export class Oficina {
    constructor(codigoIdentificador, status, nome, descricao, cargaHorariaTotal) {
        this.codigoIdentificador = codigoIdentificador;
        this.status = status;
        this.nome = nome;
        this.descricao = descricao;
        this.cargaHorariaTotal = cargaHorariaTotal;
    }

    getCodigoIdentificador() {
        return this.codigoIdentificador;
    }

    getStatus() {
        return this.status;
    }

    getNome() {
        return this.nome;
    }

    getDescricao() {
        return this.descricao;
    }

    getCargaHorariaTotal() {
        return this.cargaHorariaTotal;
    }
}