import { EmailValidatorAdapter } from "../utils/email-validator"
import validator from "validator";

jest.mock('validator', () => ({
    isEmail() : boolean {
        return true;
    }
}));

describe("EmailValidator adapter", () => { 
    test("Should return << FALSE >> if validator return false", () => {
        const sut = new EmailValidatorAdapter();
        jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
        const isValid = sut.isValid('invalid_email@tteste.com');
        expect(isValid).toBe(false);
    });

    test("Should return << TRUE >> if validator return true", () => {
        const sut = new EmailValidatorAdapter();
        const isValid = sut.isValid('valid_email@mail.com');
        expect(isValid).toBe(true);
    });

    test("Should call validator if correct email", () => {
        const sut = new EmailValidatorAdapter();
        const isEmailSpy = jest.spyOn(validator, 'isEmail');
        sut.isValid('valid_email@mail.com');
        expect(isEmailSpy).toHaveBeenCalledWith("valid_email@mail.com");
    });

});