import asyncHandler from '@expresso/helpers/asyncHandler'
import BuildResponse from '@expresso/modules/Response/BuildResponse'
import RefreshTokenService from 'controllers/RefreshToken/service'
import { Request, Response } from 'express'
import Authorization from 'middlewares/Authorization'
import routes from 'routes/public'

routes.get(
  '/refresh-token',
  asyncHandler(async function getToken(req: Request, res: Response) {
    const { refreshToken } = req.getQuery()

    const data = await RefreshTokenService.getToken(refreshToken)
    const buildResponse = BuildResponse.get({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/refresh-token',
  Authorization,
  asyncHandler(async function createData(req: Request, res: Response) {
    const formData = req.getBody()

    const data = await RefreshTokenService.create(formData)
    const buildResponse = BuildResponse.created({ data })

    return res.status(201).json(buildResponse)
  })
)
