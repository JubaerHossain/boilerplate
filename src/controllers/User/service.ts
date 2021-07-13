import { validateBoolean } from '@expresso/helpers/Common'
import useValidation from '@expresso/hooks/useValidation'
import ResponseError from '@expresso/modules/Response/ResponseError'
import PluginSqlizeQuery from '@expresso/modules/SqlizeQuery/PluginSqlizeQuery'
import UserRoleService from 'controllers/UserRole/service'
import { Request } from 'express'
import { isEmpty } from 'lodash'
import models from 'models'
import { UserAttributes } from 'models/user'
import db from 'models/_instance'
import { Transaction } from 'sequelize/types'
import userSchema from './schema'

const { Sequelize } = db
const { Op } = Sequelize

const { User, Role, Session } = models
const including = [{ model: Role }]
const includeSession = [{ model: Role }, { model: Session }]

class UserService {
  /**
   *
   * @param req Request
   */
  public static async getAll(req: Request) {
    const { filtered } = req.query
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req.query,
      User,
      PluginSqlizeQuery.makeIncludeQueryable(filtered, including)
    )

    const data = await User.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'desc']],
    })
    const total = await User.count({
      include: includeCount,
      where: queryFind.where,
    })

    return { message: `${total} data has been received.`, data, total }
  }

  /**
   *
   * @param id
   * @param paranoid
   */
  public static async getOne(id: string, paranoid?: boolean) {
    const data = await User.findByPk(id, {
      include: including,
      paranoid,
    })

    if (!data) {
      throw new ResponseError.NotFound(
        'user data not found or has been deleted'
      )
    }

    return data
  }

  /**
   *
   * @param id
   * @param paranoid
   */
  public static async getUserWithSession(id: string, paranoid?: boolean) {
    const data = await User.findByPk(id, {
      include: includeSession,
      paranoid,
    })

    if (!data) {
      throw new ResponseError.NotFound(
        'user data not found or has been deleted'
      )
    }

    return data
  }

  /**
   *
   * @param id
   * @param paranoid
   * note: find by id only find data not include relation
   */
  public static async findById(id: string, paranoid?: boolean) {
    const data = await User.findByPk(id, { paranoid })

    if (!data) {
      throw new ResponseError.NotFound(
        'user data not found or has been deleted'
      )
    }

    return data
  }

  /**
   *
   * @param email
   */
  public static async validateUserEmail(email: string) {
    const data = await User.findOne({ where: { email } })

    if (data) {
      throw new ResponseError.BadRequest('email address already in use')
    }

    return null
  }

  /**
   *
   * @param formData
   * @param txn Transaction Sequelize
   */
  public static async create(formData: UserAttributes, txn?: Transaction) {
    const value = useValidation(userSchema.create, formData)

    const data = await User.create(value, {
      transaction: txn,
    })

    return data
  }

  /**
   *
   * @param id
   * @param formData
   * @param txn Transaction Sequelize
   */
  public static async update(
    id: string,
    formData: UserAttributes,
    txn?: Transaction
  ) {
    const data = await this.findById(id)

    if (formData.email !== data.email) {
      // @ts-ignore
      await this.validateUserEmail(formData.email)
    }

    const newFormData = {
      ...data.toJSON(),
      ...formData,
      picturePath: formData.picturePath || data.picturePath,
    }

    const value = useValidation(userSchema.create, {
      ...data.toJSON(),
      ...newFormData,
    })

    await data.update(value || {}, { transaction: txn })

    return data
  }

  /**
   *
   * @param id
   * @param force - Force Deleted
   */
  public static async delete(id: string, force?: boolean) {
    const data = await this.findById(id)
    const isForce = validateBoolean(force)

    if (isForce) {
      await UserRoleService.deleteByUserId(id)
    }

    await data.destroy({ force: isForce })
  }

  /**
   *
   * @param id - Restore data from Trash
   */
  public static async restore(id: string) {
    const data = await this.findById(id, false)
    await data.restore()
  }

  /**
   *
   * @param ids
   * @param force
   * @example ids = ['id_1', 'id_2']
   */
  public static async multipleDelete(ids: Array<string>, force?: boolean) {
    const isForce = validateBoolean(force)

    if (isEmpty(ids)) {
      throw new ResponseError.BadRequest('ids cannot be empty')
    }

    if (isForce) {
      await UserRoleService.deleteByUserIds(ids)
    }

    await User.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      force: isForce,
    })
  }

  /**
   *
   * @param ids
   * @example ids = ["id_1", "id_2"]
   */
  public static async multipleRestore(ids: Array<string>) {
    await User.restore({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    })
  }
}

export default UserService
