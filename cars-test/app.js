/*
 * This application has 6 basic steps:
 * 1. Select an identity from a wallet
 * 2. Connect to network gateway
 * 3. Access PaperNet network
 * 4. Construct request to buy commercial paper
 * 5. Submit transaction
 * 6. Process response
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const { Wallets, Gateway, DefaultQueryHandlerStrategies } = require('fabric-network')
const path = require('path');


// Main program function
async function main () {
    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        // Specify userName for network access
        const userName = 'appUser';

        // A wallet stores a collection of identities for use
        const wallet = await Wallets.newFileSystemWallet('..\\wallet');

        const ccpPath = path.resolve(__dirname, '..\\gateway\\org1msp_profile.json');
        const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
        const connectionProfile = JSON.parse(ccpJSON);

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled: true, asLocalhost: true, strategy: DefaultQueryHandlerStrategies.MSPID_SCOPE_ROUND_ROBIN }
        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        // Access PaperNet network
        console.log('Use network channel: channel1.');

        const network = await gateway.getNetwork('channel1');

        // Get addressability to commercial paper contract
        // TODO: Start Here
        console.log('Use fabcar smart contract.');

        const contract = await network.getContract('fabcar');

        // buy commercial paper
        console.log('Submit cars createCar transaction.');

        await contract.submitTransaction('createCar', 'CAR13', 'Honda', 'Accord', 'Black', 'Tom');

        console.log('Transaction complete.');

    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
}
main().then(() => {

    console.log('Buy program complete.');

}).catch((e) => {

    console.log('Buy program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});