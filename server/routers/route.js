import actions from './actions.js'
import data from "./data.js"

function route(app){
    app.use('/', actions, data)
}

export default route