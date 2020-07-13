import React from "react";
import {useMachine} from "@xstate/react";
import LoginMachine from "./LoginMachine";

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
    }

    const updatePassword = (password: string) => (
        {
            type: 'PROVIDE_PASSWORD',
            password
        }
    );

    return (
        <div className={'form-container'}>
            <form className={'login-form'}>
                <label>Username: <input
                    type={'text'}
                    name={'username'}
                    value={loginForm.context.username || ''}
                    onChange={(e) => send(updateUsername(e.target.value))}/>
                </label>
                <label>Password: <input
                    type={'password'}
                    name={'password'}
                    value={loginForm.context.password || ''}
                    onChange={(e) => send(updatePassword(e.target.value))}/>
                </label>
                {
                    loginForm.value === 'getMfaCode' &&
                    <label>MFA Code: <input type={'mfa_code'} name={'mfa_code'}/></label>
                }
                <input type={'submit'} name={'login'} value={'Log In'}
                       disabled={!allowedEvents.includes('SUBMIT_CREDENTIALS')}/>
                {allowedEvents.includes('I_HAVE_MFA') && <button onClick={(e) => {
                    e.preventDefault();
                    console.log('sending I HAVE MFA')
                    send({type: 'I_HAVE_MFA'});
                }}>I have an MFA Code</button>}
                {allowedEvents.includes('I_HAVE_NO_MFA') &&
                <button onClick={() => send({type: 'I_HAVE_NO_MFA'})}>I don't have an MFA Code</button>}
            </form>
        </div>
    );
};
