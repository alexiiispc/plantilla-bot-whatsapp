const fs = require('fs')
const path = require('path')

class Function {
    
    convierte(hoy){
        //2024 10 31 18 53 38 PM
        return hoy.substr(6,2) + "/" + hoy.substr(4,2) + "/"+hoy.substr(0,4)+ " " + hoy.substr(8,2) + ":"+hoy.substr(10,2)+
        ":"+hoy.substr(12,2)
    }
    
}

module.exports = Function
