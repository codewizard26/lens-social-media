import {
  ChainId,
  ConnectWallet,
  useActiveChain,
  useAddress,
  useChain,
  useNetwork,
  useNetworkMismatch,
  useSwitchAccount,
  useSwitchChain,
} from "@thirdweb-dev/react";
import React from "react";
import useLensUser from "../lib/auth/useLensUser";
import useLogin from "../lib/auth/useLogin";

type Props = {};

export default function SignInButton({}: Props) {
  const address = useAddress();
  const isOnWrongNetwork = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  const { isSignedInQuery, profileQuery } = useLensUser();
  const { mutate: requestLogin } = useLogin();
  // 1 User needs to connect there wallet
  if (!address) {
    return <ConnectWallet />;
  }

  // User needs to switch network to polygon
  if (isOnWrongNetwork) {
    return (
      <button onClick={() => switchNetwork?.(ChainId.Polygon)}>
        Switch Network
      </button>
    );
  }

  // sign in with lens

  if (isSignedInQuery.isLoading) {
    return <div>Sign in Loading ...</div>;
  }

  if (isSignedInQuery.data) {
    return <button onClick={() => requestLogin()}>Sign in with lens</button>;
  }
  // Show user profile on lens

  if (profileQuery.isLoading) {
    console.log({ profileQuery });
    return <div>Profile Loading...</div>;
  }

  if (!profileQuery.data?.defaultProfile) {
    return <div>NO Lens Profile</div>;
  }

  if (profileQuery.data?.defaultProfile) {
    return <div>Hello {profileQuery.data?.defaultProfile?.handle}</div>;
  }

  return <div>Something went wrong</div>;
}
