const Susu = artifacts.require('./Susu.sol')

contract('Susu', function ([owner, donor]) {
    let susu

    beforeEach('setup contract for each test', async function () {
        susu = await Susu.new(owner)
    })

    // it('has an owner', async function () {
    //     assert.equal(await fundRaise.owner(), owner)
    // })

    it('accepts funds', async function () {
        await susu.PaySusu({ value: 1 })

        // const fundRaiseAddress = await susu.address
        // assert.equal(web3.eth.getBalance(fundRaiseAddress).toNumber(), 1e+18)
    })

    // it('is able to pause and unpause fund activity', async function () {
    //     await fundRaise.pause()

    //     try {
    //         await fundRaise.sendTransaction({ value: 1e+18, from: donor })
    //         assert.fail()
    //     } catch (error) {
    //         assert(error.toString().includes('invalid opcode'), error.toString())
    //     }
    //     const fundRaiseAddress = await fundRaise.address
    //     assert.equal(web3.eth.getBalance(fundRaiseAddress).toNumber(), 0)

    //     await fundRaise.unpause()
    //     await fundRaise.sendTransaction({ value: 1e+18, from: donor })
    //     assert.equal(web3.eth.getBalance(fundRaiseAddress).toNumber(), 1e+18)
    // })

    // it('permits owner to receive funds', async function () {
    //     await fundRaise.sendTransaction({ value: 1e+18, from: donor })
    //     const ownerBalanceBeforeRemovingFunds = web3.eth.getBalance(owner).toNumber()

    //     const fundRaiseAddress = await fundRaise.address
    //     assert.equal(web3.eth.getBalance(fundRaiseAddress).toNumber(), 1e+18)

    //     await fundRaise.removeFunds()

    //     assert.equal(web3.eth.getBalance(fundRaiseAddress).toNumber(), 0)
    //     assert.isAbove(web3.eth.getBalance(owner).toNumber(), ownerBalanceBeforeRemovingFunds)
    // })
})