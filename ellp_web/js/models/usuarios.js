class Usuario {
    constructor(nome, ra, email, senha) {
        this.nome = nome;
        this.ra = ra;
        this.email = email;
        this.senha = senha;
        this.papel = "Sem Papel"; // Conforme estipulado no RF01
    }

    // Métodos getters para encapsulamento
    getNome() {
        return this.nome;
    }

    getRa() {
        return this.ra;
    }

    getEmail() {
        return this.email;
    }

    getPapel() {
        return this.papel;
    }
}