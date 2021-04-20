import { EmailValidatorAdapter } from "../utils/email-validator"

describe("EmailValidator adapter", () => { 
    test("Should return << FALSE >> if validator return false", () => {
        const sut = new EmailValidatorAdapter();
        const isValid = sut.isValid('invalid_email@mail.com');
        expect(isValid).toBe(false);

    });

});