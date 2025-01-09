jest.mock('../queries/accounts', () => ({
    getOneAccountByUserName: jest.fn(),
    getOneAccountByEmail: jest.fn(),
    getAllAccounts: jest.fn(),
  }))
  
  const { checkUsernameProvided } = require('./checkAccount')

describe('checkUsernameProvided', () => {
  it('should call next() if username is provided', () => {
    const req = { body: { username: 'testuser' } }
    const res = {}
    const next = jest.fn()

    checkUsernameProvided(req, res, next)

    expect(next).toHaveBeenCalled()
  })

  it('should return 400 if username is not provided & error message', () => {
    const req = { body: {} }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const next = jest.fn()

    checkUsernameProvided(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Username is required!' })
  })
})

const { checkUsernameExists } = require('./checkAccount')
const { getOneAccountByUserName } = require('../queries/accounts')

describe('checkUsernameExists', () => {
    it('should call next() if username does not exist', async () => {
      getOneAccountByUserName.mockResolvedValue(null)
      const req = { body: { username: 'newuser' } }
      const res = {}
      const next = jest.fn()
  
      await checkUsernameExists(req, res, next)
  
      expect(next).toHaveBeenCalled()
    })
  
    it('should return 409 if username exists & error message', async () => {
      getOneAccountByUserName.mockResolvedValue({ username: 'existinguser' })
      const req = { body: { username: 'existinguser' } }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const next = jest.fn()
  
      await checkUsernameExists(req, res, next)
  
      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Account already registered with this username.',
      })
    })
  
    it('should return 500 if there is an error & error message', async () => {
      getOneAccountByUserName.mockRejectedValue(new Error('Database error'))
      const req = { body: { username: 'erroruser' } }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const next = jest.fn()
  
      await checkUsernameExists(req, res, next)
  
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Internal Server Error at checkUsernameExists.',
      })
    })
  })