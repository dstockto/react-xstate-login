import React, {ChangeEvent, useEffect} from "react";
import {useMachine} from "@xstate/react";
import MfaCodeMachine from "./MfaCodeMachine";

interface MfaCodeProps {
    onValid: (mfaCode: string) => void
}

const MfaCode = ({onValid}: MfaCodeProps) => {
    const [machine, send] = useMachine(MfaCodeMachine);

    useEffect(() => {
        if (machine.value === 'valid') {
            onValid(machine.context.mfaCode);
        } else {
            onValid('');
        }
    }, [machine.value]);

    return (
        <div className={'mfa-code'}>
            <label>MFA Code: <input
                type={'mfa_code'}
                value={machine.context.mfaCode}
                name={'mfa_code'}
                onChange={(e) => send({type: 'UPDATE_MFA_CODE', mfaCode: e.target.value})}/>
            </label>
            {machine.context.showHelp &&
            <p className={'mfa-help'}>
                MFA, or multi-factor authentication is a way to help improve the security of your account. Each bit of
                data you provide to authenticate makes it harder to for an attacker to gain access to your account. Different
                factors include things like "something you know", or "something you have". In some cases, like biometrics,
                it can include "something you are". In our case, we use password, or "something you know" along with a
                time-based one-time passcode or TOTP to be "something you have". This is done by providing a secret code
                that when used within an authenticator app on your phone &emdash; something like Google Authenticator or
                Authy &emdash; to generate a code that changes every 30 seconds. Without having access to your phone and knowing
                your password, it's extremely unlikely that an attacker would be able to gain access to your account.
            </p>}
        </div>
    );
}

export default MfaCode;