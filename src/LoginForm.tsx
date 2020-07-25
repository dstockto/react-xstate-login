import React, {ChangeEvent} from "react";
import {useMachine} from "@xstate/react";
import LoginMachine from "./LoginMachine";
import {AnyEventObject} from "xstate";
import MfaCode from "./MfaCode";

export default () => {
    const [loginForm, send] = useMachine(LoginMachine);

    const allowedEvents = loginForm.nextEvents.filter(
        nextEvent => {
            return LoginMachine.transition(loginForm.value, {type: nextEvent}, loginForm.context).changed;
        }
    );

    const updateUsername = (username: string) => {
        return {
            type: 'PROVIDE_USERNAME',
            username
        };
    };

    const updatePassword = (password: string) => (
        {
            type: 'PROVIDE_PASSWORD',
            password
        }
    );

    const updateMfaCode = (mfaCode: string) => (
        {
            type: 'PROVIDE_MFA_CODE',
            mfaCode
        }
    );

    const sendEvent = (type: string) => {
        return (e: any) => {
            e.preventDefault();
            send({type});
        }
    };

    const doSend = (helper: (v:string) => AnyEventObject ) => {
        return (e: ChangeEvent<HTMLInputElement>) => send(helper(e.target.value));
    }

    const canLogin = allowedEvents.includes('LOGIN_MFA') || allowedEvents.includes('SUBMIT_CREDENTIALS');

    return (
        <div className={'form-container'}>
            <form className={'login-form'}>
                <label>Username: <input
                    type={'text'}
                    name={'username'}
                    value={loginForm.context.username || ''}
                    onChange={doSend(updateUsername)}/>
                </label>
                <label>Password: <input
                    type={'password'}
                    name={'password'}
                    value={loginForm.context.password || ''}
                    onChange={doSend(updatePassword)} />
                </label>
                {
                    loginForm.value === 'getMfaCode' &&
                        <MfaCode value={loginForm.context.mfaCode || ''} onChange={doSend(updateMfaCode)} />
                }
                <input type={'submit'} name={'login'} value={'Log In'}
                       disabled={!canLogin}/>
                {allowedEvents.includes('I_HAVE_MFA') &&
                <button onClick={sendEvent('I_HAVE_MFA')}>I have an MFA Code</button>}
                {allowedEvents.includes('I_HAVE_NO_MFA') &&
                <button onClick={sendEvent('I_HAVE_NO_MFA')}>I don't have an MFA Code</button>}
            </form>
        </div>
    );
};
