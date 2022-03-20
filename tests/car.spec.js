const path = require('path')
const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')

const contractPath = path.resolve(__dirname, '../compiled/Car.json')
const { interface, bytecode } = require(contractPath)

const web3 = new Web3(ganache.provider())

let accounts
let contract
const initialBrand = 'AUDI'

describe('contract', () => {
    beforeEach(async () => {
        accounts = await web3.eth.getAccounts()
        console.log('合约部署账户', accounts[0])

        contract = await new web3.eth.Contract(JSON.parse(interface))
            .deploy({ data: bytecode, arguments: [ initialBrand ] })
            .send({ from: accounts[0], gas: '1000000' })
        console.log('合约部署成功', contract.options.address)
    })

    it('deploy a contract', () => {
        assert.ok(contract.options.address)
    })

    it('has initial brand', async () => {
        const brand = await contract.methods.brand().call()
        assert.equal(brand, initialBrand)
    })

    it('can change the brand', async () => {
        const newBrand = 'BWM';
        await contract.methods.setBrand(newBrand).send({ from: accounts[0] });
        const brand = await contract.methods.brand().call();
        assert.equal(brand, newBrand);
    });
})