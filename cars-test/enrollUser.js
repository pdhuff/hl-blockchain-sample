const FabricCAServices = require('fabric-ca-client');
const { Wallets, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..\\gateway\\org1msp_profile.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

async function main() {
  try {

    // Create a new CA client for interacting with the CA.
    const caURL = ccp.certificateAuthorities['169.51.205.58:30181'].url;
    const ca = new FabricCAServices(caURL);

    // Create a new file system based wallet for managing identities.
    const wallet = await Wallets.newFileSystemWallet('..\\wallet');


    // Check to see if we've already enrolled the admin user.
    const userExists = await wallet.get('appUser');
    if (userExists) {
        console.log('An identity for the client user "appUser" already exists in the wallet');
        return;
    }

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await ca.enroll({ enrollmentID: 'appUser', enrollmentSecret: 'appUserpw' });
    const x509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
        },
        mspId: 'org1msp',
        type: 'X.509',
    };
    await wallet.put('appUser', x509Identity);
    console.log('Successfully enrolled client user "appUser" and imported it into the wallet');


    } catch (error) {
      console.error(`Failed to enroll "appUser": ${error}`);
      process.exit(1);
    }
}
main();