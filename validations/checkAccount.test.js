jest.mock("../queries/accounts", () => ({
    getOneAccountByUserName: jest.fn(),
    getOneAccountByEmail: jest.fn(),
    getAllAccounts: jest.fn(),
  }))
  
  const { checkUsernameProvided } = require("./checkAccount")

describe("checkUsernameProvided", () => {
  it("should call next() if username is provided", () => {
    const req = { body: { username: "testuser" } }
    const res = {}
    const next = jest.fn()

    checkUsernameProvided(req, res, next)

    expect(next).toHaveBeenCalled()
  })

  it("should return 400 if username is not provided & error message", () => {
    const req = { body: {} }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const next = jest.fn()

    checkUsernameProvided(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: "Username is required!" })
  })
})
