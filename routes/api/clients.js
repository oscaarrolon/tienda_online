const router = require('express').Router()

const Client = require('../../models/client.model')

router.get('/', async (req, res) => {

    try {
        const clients = await Client.find().populate('products');
        console.log(clients)
        res.json(clients)
    } catch (error) { res.json({ fatal: error.message }) }

})

router.get('/:idClient/product/:idProduct', async (req, res) => {
    const { cliendId, productId } = req.params;

    const clientFound = await Client.findById(cliendId)
    clientFound.products.push(productId)

    clientFound.save();
    res.json('producto agregado')



})


router.post('/', async (req, res) => {

    const response = await Client.create(req.body)
    res.json(response)

})


router.put('/:clientId', async (req, res) => {
    const { clienteId } = req.params;

    const updateClient = Client.findByIdAndUpdate(clienteId, req.body, { new: true })
    res.json(updateClient)

})


router.delete('/:clientId', async (req, res) => {
    const { clienteId } = req.params;

    const deleteClient = Client.findByIdAndDelete(clienteId)
    res.json(deleteClient)

})



module.exports = router