const request = require("supertest")
const app = require("./app")

jest.mock("./db/dbConfig", () => ({
    db: {
      one: jest.fn(),
      any: jest.fn(),
      oneOrNone: jest.fn(),
      none: jest.fn(),
    },
  }))

describe("app.js", () => {
    it("should return a welcome message on GET /", async () => {
        const response = await request(app).get("/")
        expect(response.statusCode).toBe(200)
        expect(response.text).toBe("Welcome to iCapital's - Budgeter")
    })

    it("should return 404 & error message for unknown routes", async () => {
        const response = await request(app).get("/unknown")
        expect(response.statusCode).toBe(404)
        expect(response.body).toEqual({ error: "Page not found!" })
    })

    it("should mount /accounts route", async () => {
        const response = await request(app).post("/accounts/")
        expect(response.statusCode).not.toBe(404)
    })
})

