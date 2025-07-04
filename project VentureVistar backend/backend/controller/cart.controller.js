const Cart = require('../models/Cart')
const {sendResponseError} = require('../middleware/middleware')

const getCartProducts = async (req, res) => {
  try {
    const carts = await Cart.find({userId: req.user._id}).populate('productId')
    // console.log(carts)
    res.status(200).send({status: 'ok', carts})
  } catch (err) {
    console.log(err)
    sendResponseError(500, `Error ${err}`, res)
  }
}

const addProductInCart = async (req, res) => {
  const {productId, count} = req.body
  
  // Input validation
  if (!productId || !count) {
    sendResponseError(400, 'Product ID and count are required', res)
    return
  }
  
  if (count < 1) {
    sendResponseError(400, 'Count must be at least 1', res)
    return
  }
  
  try {
    const cart = await Cart.findOneAndUpdate(
      {productId, userId: req.user._id}, // Include userId in query for security
      {productId, count, userId: req.user._id},
      {upsert: true, new: true},
    )

    res.status(201).send({status: 'ok', cart})
  } catch (err) {
    console.log(err)
    sendResponseError(500, `Error ${err}`, res)
  }
}
const deleteProductInCart = async (req, res) => {
  try {
    const cartItem = await Cart.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id // Security fix: Ensure user owns the cart item
    })
    
    if (!cartItem) {
      sendResponseError(404, 'Cart item not found or unauthorized', res)
      return
    }
    
    res.status(200).send({status: 'ok'})
  } catch (err) { // Fixed: was 'e' but using 'err'
    console.log(err)
    sendResponseError(500, `Error ${err}`, res)
  }
}
module.exports = {addProductInCart, deleteProductInCart, getCartProducts}
