
import actionTypes from '../constant/constant'

export function changeState(text) {
    return dispatch =>{
        console.log('work')
        dispatch({type : actionTypes.CHANGEUSERNAME, payload : text})
    }
}