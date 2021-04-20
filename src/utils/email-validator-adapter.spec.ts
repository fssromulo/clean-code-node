import { EmailValidatorAdapter } from "./email-validator-adapter"
import validator from "validator";

jest.mock('validator', () => ({
    isEmail() : boolean {
        return true;
    }
}));

const makeSut = (): EmailValidatorAdapter => ( new EmailValidatorAdapter());

describe("EmailValidator adapter", () => { 
    test("Should return << FALSE >> if validator return false", () => {
        const sut = makeSut();
        jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
        const isValid = sut.isValid('invalid_email@tteste.com');
        expect(isValid).toBe(false);
    });

    test("Should return << TRUE >> if validator return true", () => {
        const sut = makeSut();
        const isValid = sut.isValid('valid_email@mail.com');
        expect(isValid).toBe(true);
    });

    test("Should call validator if correct email", () => {
        const sut = makeSut();
        const isEmailSpy = jest.spyOn(validator, 'isEmail');
        sut.isValid('valid_email@mail.com');
        expect(isEmailSpy).toHaveBeenCalledWith("valid_email@mail.com");
    });

});