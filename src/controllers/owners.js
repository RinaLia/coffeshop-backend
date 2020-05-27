const ownerModel = require('../model/owners')
const res = require('../config/response')
const { isFilled, isExists } = require('../config/validator')
const pagination = require('../config/pagination')

module.exports = {
  getAllOwners: async (req, res) => {
    const { page, limit, search, sort } = req.query
    const condition = {
      search,
      sort
    }

    const sliceStart = pagination.getPage(page) * pagination.getPerPage(limit) - pagination.getPerPage(limit)
    const sliceEnd = (pagination.getPage(page) * pagination.getPerPage(limit))
    const totalData = await ownerModel.getOwnersCount(condition)
    const totalPage = Math.ceil(totalData / pagination.getPerPage(limit))
    const prevLink = pagination.getPrevLink(pagination.getPage(page), req.query)
    const nextLink = pagination.getNextLink(pagination.getPage(page), totalPage, req.query)

    const ownerData = await ownerModel.getAllOwners(sliceStart, sliceEnd, condition)
    const data = {
      success: true,
      message: 'List owners',
      data: ownerData,
      pageInfo: {
        page: pagination.getPage(page),
        totalPage,
        perPage: pagination.getPerPage(limit),
        totalData,
        prevLink: prevLink && `${URL}owners?${nextLink}`,
        nextLink: nextLink && `${URL}owners?${nextLink}`
      }
    }
    res.status(200).send(data)
  },

  createOwner: async (req, res) => {
    const { name, address, phone } = req.body

    if (!isFilled({ name, address, phone })) return res.send(res(false, req.body, 'Name,addres, and phone must be filled'))

    const result = await ownerModel.create({ name, address, phone })
    if (result) return res.status(201).send(res(true, req.body, 'Owner successfully created'))
    else return res.send(res(false, req.body, 'Server Error or Error not handled'))
  },

  updateOwner: async (req, res) => {
    const { id } = req.params
    const { name, address, phone } = req.body
    const data = { ...req.body, ...{ id } }

    if (!isFilled({ id, name, address, phone })) return res.send(res(false, data, 'id, name, address, and phone  must be filled'))

    const isExistOwner = await isExists({ id }, 'owners')
    if (!isExistOwner) return res.send(res(false, data, 'Owner id is not valid'))

    const result = await ownerModel.update([{ name, address, phone }, { id }])
    if (result) return res.send(res(true, data, 'Owner successfully updated'))
    else return res.send(res(false, data, 'Server Error or Error not handled'))
  },
  deleteOwner: async (req, res) => {
    const { id } = req.params

    const data = { id }

    if (!isFilled({ id })) return res.send(res(false, { id }, 'ID must be filled'))

    const isExistOwner = await isExists({ id }, 'owners')
    if (!isExistOwner) return res.send(res(false, data, 'Owner id is not valid'))

    const result = await ownerModel.delete({ id })
    if (result) return res.send(res(true, data, 'Owner successfully deleted'))
    else return res.send(res(false, data, 'Server Error or Error not handled'))
  }
}
