jest.mock("../db/dbConfig.js", () => ({
    one: jest.fn(),
    any: jest.fn(),
    oneOrNone: jest.fn(),
    none: jest.fn(),
  }))


  const db = require("../db/dbConfig.js")
  const { getOneAccount } = require("./accounts")
  
  describe("getOneAccount", () => {
    it("should return an account when the query is successful", async () => {
      const mockAccount = { account_id: 1, username: "testuser" }
      db.one.mockResolvedValue(mockAccount)
  
      const result = await getOneAccount(1)
  
      expect(db.one).toHaveBeenCalledWith(
        "SELECT * FROM accounts WHERE account_id=$1",
        1
      )
      expect(result).toEqual(mockAccount)
    })
  
    it("should return an error object when the query fails", async () => {
      const mockError = new Error("Database error")
      db.one.mockRejectedValue(mockError)
  
      const result = await getOneAccount(1)
  
      expect(db.one).toHaveBeenCalledWith(
        "SELECT * FROM accounts WHERE account_id=$1",
        1
      )
      expect(result).toEqual({
        err: `${mockError}, sql query error - get one account`,
      })
    })
  })
  