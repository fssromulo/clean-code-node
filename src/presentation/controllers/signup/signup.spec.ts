import SignUpController from "./signup"
import { MissingParamError, InvalidParamError, ServerError } from "../../errors";
import { EmailValidator, AddAccount, AddAccountModel,AccountModel } from "./signup-protocols";

const makeAddAccount = (): AddAccount => {
    // Stub = Dublê de teste
    class AddAccountStub implements AddAccount {
        add(account: AddAccountModel): AccountModel {
            const fakeAccount = {
                id: 'valid_id',
                name: "valid_name",
                email: "valid_email@mail.com",
                password: "valid_password"
            }
            return fakeAccount;
        }
    }
    return new AddAccountStub();
}

const makeEmailValidator = (): EmailValidator => {
    // Stub = Dublê de teste
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true;
        }
    }
    return new EmailValidatorStub();
}

interface SutTypes {
    sut: SignUpController,
    emailValidatorStub: EmailValidator,
    addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
    // Dependencias
    const emailValidatorStub = makeEmailValidator();
    const addAccountStub = makeAddAccount();

    const sut = new SignUpController(emailValidatorStub, addAccountStub);
    return {
        sut,
        emailValidatorStub,
        addAccountStub
    }
}

describe("SignUp Controller", () => {
    test("Should return 400 if no << name >> is provided", () => {
        // sut significa (S)istem (U)nder (T)est
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                /* name: "any_name", */
                email: "email@mail.com",
                password: "any_password",
                passwordConfirmation: "any_password"
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError("name"))
    })

    test("Should return 400 if no << email >> is provided", () => {
        // sut significa (S)istem (U)nder (T)est
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: "any_name",
                // email: "email@mail.com",
                passwordConfirmation: "any_password",
                password: "any_password"
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError("email"))
    })

    test("Should return 400 if no << password >> is provided", () => {
        // sut significa (S)istem (U)nder (T)est
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: "any_name",
                email: "email@mail.com",
                passwordConfirmation: "any_password"
                // password: "any_password"
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError("password"))
    })

    test("Should return 400 if no << password confirmation >> is provided", () => {
        // sut significa (S)istem (U)nder (T)est
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: "any_name",
                email: "email@mail.com",
                password: "any_password"
                // passwordConfirmation: "any_password"
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError("passwordConfirmation"))
    })

    test("Should return 400 if << password confirmation >> fails", () => {
        // sut significa (S)istem (U)nder (T)est
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: "any_name",
                email: "email@mail.com",
                password: "any_password",
                passwordConfirmation: "invalid_password"
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError("passwordConfirmation"))
    })

    test("Should return 400 if an invalid << email >> is provided", () => {
        // sut significa (S)istem (U)nder (T)est
        const { sut, emailValidatorStub } = makeSut();

        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

        const httpRequest = {
            body: {
                name: "any_name",
                email: "invalid_email@mail.com",
                password: "any_password",
                passwordConfirmation: "any_password"
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError("email"))
    })

    test("Should call EmailValidator with correct << email >>", () => {
        // sut significa (S)istem (U)nder (T)est
        const { sut, emailValidatorStub } = makeSut();

        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

        const httpRequest = {
            body: {
                name: "any_name",
                email: "any_any_email@mail.com",
                password: "any_password",
                passwordConfirmation: "any_password"
            }
        }
        sut.handle(httpRequest);
        expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
    })

    test("Should call AddAccount with correct value", () => {
        // sut significa (S)istem (U)nder (T)est
        const { sut, addAccountStub } = makeSut();
        const addSpy = jest.spyOn(addAccountStub, 'add');

        const httpRequest = {
            body: {
                name: "any_name",
                email: "any_any_email@mail.com",
                password: "any_password",
                passwordConfirmation: "any_password"
            }
        }
        sut.handle(httpRequest);
        expect(addSpy).toHaveBeenCalledWith({
            name: "any_name",
            email: "any_any_email@mail.com",
            password: "any_password"
        });
    });

    test("Should return 500 if emailValidator throws", () => {
        // Stub = Dublê de teste
        const { sut, emailValidatorStub } = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error;
        });

        const httpRequest = {
            body: {
                name: "any_name",
                email: "any_email@mail.com",
                password: "any_password",
                passwordConfirmation: "any_password"
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    });


    test("Should return 500 if addAccount throws", () => {
        // Stub = Dublê de teste
        const { sut, addAccountStub } = makeSut();
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
            throw new Error;
        });

        const httpRequest = {
            body: {
                name: "any_name",
                email: "any_email@mail.com",
                password: "any_password",
                passwordConfirmation: "any_password"
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    });

    test("Should returns 200 if valid data is provided", () => {
        const { sut } = makeSut();

        const httpRequest = {
            body: {
                name: "valid_name",
                email: "valid_email@mail.com",
                password: "valid_password",
                passwordConfirmation: "valid_password"
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse.body).toEqual({
            id: 'valid_id',
            name: "valid_name",
            email: "valid_email@mail.com",
            password: "valid_password"
        })

    });

})
