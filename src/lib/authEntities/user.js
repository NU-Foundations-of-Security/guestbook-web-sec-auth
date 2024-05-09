export class User {
    constructor(username, password) {
        this.username = this.isValidUsername(username);
        this.password = this.isValidPassword(password);
    }

    isValidUsername(username) {
        const usernamePattern = /^[A-Z-a-z]+$/;
        if (!usernamePattern.test(username)) throw new Error("Invalid username.");

        return username;
    }

    isValidPassword(password) {
        if (password.length < 8) throw new Error("Password too short.");

        const passwordPattern = /^[A-Za-z0-9$@%#*!?]+$/;
        if (!passwordPattern.test(password)) throw new Error("Password contains illegal characters.");

        // Check if there are lowercase and uppercase letters
        const uppercasePattern = /[A-Z]+/;
        if (password.match(uppercasePattern) === null) throw new Error("Password is missing an uppercase character.");
       
        const lowercasePattern = /[a-z]+/;
        if (password.match(lowercasePattern) === null) throw new Error("Password is missing a lowercase character.");

        // Check if there are digits
        const digitPattern = /[0-9]+/;
        if (password.match(digitPattern) === null) throw new Error("Password is missing a digit.");

        // Check if there are special characters
        const specialPattern = /[$@%#*!?]+/;
        if (password.match(specialPattern) === null) throw new Error("Password is missing a special character.");

        return password;
    }

    getUsername() {
        return this.username;
    }

    getPassword() {
        return this.password;
    }
};