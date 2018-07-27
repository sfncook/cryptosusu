const Susu = artifacts.require('./Susu.sol')

contract('Susu', function ([owner, donor]) {
    let susu

    beforeEach('setup contract for each test', async function () {
        susu = await Susu.new(2, "Test", 1)
    })

    it('has an owner', async function () {
        assert.equal(await susu.owner(), owner)
    })

    it('sets the constructor arguments correctly', async function () {
        susu = await Susu.new(2, "Test", 1)
        
        assert.equal(await susu.groupName(), "Test", "Group name should be 'Test'")
        assert.equal(await susu.contribAmtWei(), 1, "Contribution amount should be 1 wei")
        assert.equal(await susu.getNumberOfMembersNeeded(), 2, "Number of members should be 2")
    })

    it('allows others to join the susu and tracks their address', async function () {
        susu = await Susu.new(2, "Test", 1)
        
        susu.joinGroup({from: donor})
        assert.equal(await susu.membersJoined(), 2, "Group should have 2 members")
        assert.equal(await susu.getMemberAtIndex(1), donor, "Donor should be 2nd member")
    })

    it('allows others to join the susu and tracks their address', async function () {
        susu = await Susu.new(2, "Test", 1)
        
        susu.joinGroup({from: donor})
        assert.equal(await susu.membersJoined(), 2, "Group should have 2 members")
        assert.equal(await susu.getMemberAtIndex(1), donor, "Donor should be 2nd member")
    })

    it('does not allow people to join twice from the same address', async function () {
        susu = await Susu.new(2, "Test", 1)
        
        try {   
            await susu.joinGroup({from: donor})
            await susu.joinGroup({from: donor})
        } catch (error) {
            err = error
        }

        assert.ok(err instanceof Error)
    })

    it('does not allow contributions if one has not joined', async function () {
        susu = await Susu.new(2, "Test", 1)
        
        try {
            await susu.contribute({from: donor, value: 1})
        } catch (error) {
            err = error
        }
      
        assert.ok(err instanceof Error)
    })

    it('does track contributions', async function () {
        susu = await Susu.new(2, "Test", 1)
        
        await susu.joinGroup({from: donor})
        await susu.contribute({from: donor, value: 1})
        assert.equal(await susu.getContributionForMember(donor), 1, "Contribution was not tracked correctly")
    })

    it('pays out correctly', async function () {
        susu = await Susu.new(2, "Test", 1)
        
        await susu.joinGroup({from: donor})
        await susu.contribute({from: donor, value: 1})
        await susu.contribute({from: owner, value: 1})
        await susu.payOut()


        assert.equal(await susu.getContributionForMember(donor), 0, "Contribution from donor was not paid out")
        assert.equal(await susu.getContributionForMember(owner), 0, "Contribution from owner was not paid out")
        assert.equal(await susu.memberIdxToPayNext(), 1, "Member to pay next was not incremented")
    })
})