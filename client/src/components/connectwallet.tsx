import { ConnectButton } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { createWallet } from "thirdweb/wallets";

const client = createThirdwebClient({
  clientId: "ed4bcdc6d450e0296557ec799c7ab19b",
});

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];

export function Example() {
  return (
    <ConnectButton
      client={client}
      connectModal={{ size: "compact" }}
      wallets={wallets}
    />
  );
}
