import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

// Reducers
import {authReducer} from './reducers/authReducer'
import {cartReducer} from './reducers/cartReducers'
import {getProductsReducer, getProductDetailsReducer} from './reducers/productReducers'

const reducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  getProducts: getProductsReducer,
  getProductDetails: getProductDetailsReducer,
})

const middleware = [thunk]

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store
