import { mnemonicToPrivateKey } from '@ton/crypto';
import { WalletContractV5R1, WalletContractV4, WalletContractV3R2 } from '@ton/ton';

const walletsMap = {
  W5: WalletContractV5R1,
  v4R2: WalletContractV4,
  v3R2: WalletContractV3R2,
};

async function extractKeysFromTonMnemonic(mnemonic, index) {
  const keyPair = await mnemonicToPrivateKey(mnemonic.split(' '));
  const { publicKey, secretKey} = keyPair;

  const publicKeyHex = publicKey.toString('hex');
  const privateKeyHex = secretKey.toString('hex').slice(0, 64);

  const wallets = {};

  for (const [version, walletClass] of Object.entries(walletsMap)) {
    const wallet = walletClass.create({
      workchain: 0,
      publicKey: keyPair.publicKey,
    });
    const address = wallet.address.toString({bounceable: false, urlSafe: true});

    wallets[version] = address;
  }

  return { wallets, publicKeyHex, privateKeyHex };
}

export {
  extractKeysFromTonMnemonic,
};
