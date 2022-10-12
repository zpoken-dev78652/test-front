import firebase from "firebase/app";
import "firebase/auth";
import { useRedux } from ".";
import {
  authActions,
  authAsync,
  profileActions,
  verifyEmailAsync,
} from "../redux";
import { fingerprint } from "../helpers/fingerprint";
import { useRouter } from "next/router";
import { infoMessages } from "../constants";

export const useAuth = () => {
  const [_, dispatch] = useRedux();
  const { pathname } = useRouter();
  const isLogin = pathname === "/login" || pathname === "/";
  const auth = firebase.auth();
  const { setInfoMessage } = authActions;
  const { setError: setProfileError } = profileActions;
  const fingerprintId = fingerprint();

  const dispatchAuthAsync = async ({
    idToken,
    email,
  }: {
    idToken: string;
    email?: string;
  }) => {
    if (!idToken) return;

    dispatch(
      authAsync({
        idToken: idToken,
        fingerprint: fingerprintId,
        ...(!isLogin && { email: email }),
      })
    );
  };

  const facebookAuth = async () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.setCustomParameters({ display: "popup" });
    try {
      await auth.signInWithPopup(provider);
      const currentUser: any = await auth.currentUser;
      const currentUserToken = await currentUser?.getIdTokenResult();

      if (!currentUserToken) return;

      dispatchAuthAsync({
        idToken: currentUserToken.token,
        email: currentUserToken.claims.email,
      });
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        await auth.currentUser?.linkWithCredential(error.credential);
        const curUser: any = await auth.currentUser?.getIdTokenResult();
        dispatch(authAsync({ idToken: curUser.token }));
      }
    }
  };

  const googleAuth = async () => {
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/userinfo.email");
    provider.setCustomParameters({ display: "popup" });
    try {
      await auth.signInWithPopup(provider);
      const currentUser: any = await auth.currentUser?.getIdTokenResult();

      if (!currentUser) return;

      dispatchAuthAsync({
        idToken: currentUser.token,
        email: currentUser.claims.email,
      });
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        await auth.currentUser?.linkWithCredential(error.credential);
        const curUser: any = await auth.currentUser?.getIdTokenResult();
        dispatch(authAsync({ idToken: curUser.token }));
      }
    }
  };

  const appleAuth = async () => {
    const provider = new firebase.auth.OAuthProvider("apple.com");

    try {
      await auth.signInWithPopup(provider);
      const currentUser: any = await auth.currentUser?.getIdTokenResult();

      if (!currentUser) return;

      dispatchAuthAsync({
        idToken: currentUser.token,
        email: currentUser.claims.email,
      });
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        await auth.currentUser?.linkWithCredential(error.credential);
        const curUser: any = await auth.currentUser?.getIdTokenResult();
        dispatch(authAsync({ idToken: curUser.token }));
      }
    }
  };

  const loginWithEmailAndPass = async (email: string, newPass: string) => {
    await auth.signInWithEmailAndPassword(email, newPass);
    const currentUser = await auth.currentUser?.getIdTokenResult();

    if (!currentUser) return;

    dispatchAuthAsync({
      idToken: currentUser.token,
    });
  };

  const verifyEmail = async ({ email_code }: { email_code: string }) => {
    try {
      dispatch(verifyEmailAsync({ email_code, fingerprint: fingerprintId }));
    } catch (error) {}
  };

  const restorePassword = async ({
    actionCode,
    newPass,
  }: {
    actionCode: string;
    newPass: string;
  }) => {
    try {
      dispatch(setInfoMessage(infoMessages.LOADING_RESET_PASS));
      const email = await auth.verifyPasswordResetCode(actionCode);
      await auth.confirmPasswordReset(actionCode, newPass);

      loginWithEmailAndPass(email, newPass);
    } catch (error) {
      dispatch(setProfileError(error.code));
    } finally {
      dispatch(setInfoMessage(""));
    }
  };

  return {
    facebookAuth,
    googleAuth,
    appleAuth,
    verifyEmail,
    restorePassword,
    loginWithEmailAndPass,
    dispatchAuthAsync,
  };
};
