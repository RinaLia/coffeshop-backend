const router = require('express').Router()
const ownersController = require('../controllers/owners')

router.get('/', ownersController.getAllOwners)
router.post('/', ownersController.createOwner)
router.put('/:id', ownersController.updateOwner)
router.delete('/:id', ownersController.deleteOwner)

module.exports = router
