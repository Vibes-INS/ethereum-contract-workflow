const fs = require('fs')
const path = require('path')
const solc = require('solc')

const compiledDir = path.resolve(__dirname, '../compiled')
const contractPath = path.resolve(__dirname, '../contracts', 'Car.sol')
const contractSource = fs.readFileSync(contractPath, 'utf8')

// compile
const result = solc.compile(contractSource, 1)
if (Array.isArray(result.errors) && result.errors.length > 0) {
    throw new Error(result.errors[0])
}

// remove compiled files
console.log(compiledDir)
fs.rmdirSync(compiledDir, {
    recursive: true,
    force: true,
})
fs.mkdirSync(compiledDir)

// save compiled files
Object.keys(result.contracts).forEach(name => {
    const contractName = name.replace(/^:/, '')
    const filePath = path.resolve(compiledDir, `${contractName}.json`)
    fs.writeFileSync(filePath, JSON.stringify(result.contracts[name]))
    console.log(`save compiled contract ${contractName} to ${filePath}`)
})
