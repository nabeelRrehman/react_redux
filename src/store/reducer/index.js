import reducer from './reducer'
import {combineReducers} from 'redux'
import authReducer from './authReducer'

export default combineReducers({
    rootReducer : reducer,
    authReducer : authReducer
})