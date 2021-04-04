import SignUpController from "./signup";
describe("SignUp Controller", () => {
  test("Shold return 400 if no name is provided", () => {
    // sut significa (S)istem (U)nder (T)est
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        /* name: "any_name", */
        email: "email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new Error("Missing param: name"));
  });

  test("Shold return 400 if no email is provided", () => {
    // sut significa (S)istem (U)nder (T)est
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        name: "any_name",
        // email: "email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new Error("Missing param: email"));
  });
});
