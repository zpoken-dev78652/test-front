import { createMessage, encrypt, readKey } from "openpgp";

// Object to be encrypted
interface CardDetails {
  circleKey: {
    keyId: string;
    publicKey: string;
  };
  dataToEncrypt: {
    number?: string; // required when storing card details
    cvv?: string; // required when cardVerification is set to cvv or three_d_secure
  };
}

// Encrypted result
interface EncryptedValue {
  encryptedMessage: string;
  keyId: string;
}

export const encryptCardDetails = async ({
  circleKey,
  dataToEncrypt,
}: CardDetails): Promise<EncryptedValue> => {
  const decodedPublicKey = await readKey({
    armoredKey: atob(circleKey.publicKey),
  });
  const message = await createMessage({ text: JSON.stringify(dataToEncrypt) });

  return encrypt({
    message,
    encryptionKeys: decodedPublicKey,
  }).then((ciphertext: any) => {
    return {
      encryptedMessage: btoa(ciphertext),
      keyId: circleKey.keyId,
    };
  });
};
