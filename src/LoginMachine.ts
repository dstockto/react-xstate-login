import {assign, Machine} from "xstate";

interface LoginMachineSchema {
    states: {
        loggedOut: {},
        checkCredentials: {},
        getMfaCode: {},
        checkMfaLogin: {},
        loggedIn: {},
        lockedOut: {},
    }
}

type LoginEvent =
    | { type: 'SUBMIT_CREDENTIALS' }
    | { type: 'PROVIDE_USERNAME', username: string }
    | { type: 'PROVIDE_PASSWORD', password: string }
    | { type: 'PROVIDE_MFA_CODE' }
    | { type: 'I_HAVE_MFA' }
    | { type: 'I_HAVE_NO_MFA' }
    | { type: 'LOGIN_SUCCESS' }
    | { type: 'LOGIN_FAILURE' }
    | { type: 'MFA_REQUIRED' }
    | { type: 'LOGIN_MFA' }
    | { type: 'MFA_SUCCESS' }
    | { type: 'MFA_FAIL' }
    | { type: 'LOGOUT' };

interface LoginContext {
    username: string | null;
    password: string | null;
    mfaCode: string | null;
    badPasswordCount: number;
    badMfaCount: number;
}

export default Machine<LoginContext>(
    {
        id: 'fetch',
        initial: 'loggedOut',
        context: {
            username: null,
            password: null,
            mfaCode: null,
            badPasswordCount: 0,
            badMfaCount: 0,
        },
        states: {
            loggedOut: {
                on: {
                    SUBMIT_CREDENTIALS: {
                        target: 'checkCredentials',
                        cond: 'hasCredentials',
                    },
                    PROVIDE_USERNAME: {
                        target: 'loggedOut',
                        actions: assign((ctx, evt) => {
                            return {username: evt.username}
                        })
                    },
                    PROVIDE_PASSWORD: {
                        target: 'loggedOut',
                        actions: assign((ctx, evt) => {
                            return {password: evt.password}
                        })
                    },
                    I_HAVE_MFA: {
                        target: 'getMfaCode',
                        cond: 'hasCredentials'
                    }
                }
            },
            checkCredentials: {
                on: {
                    LOGIN_SUCCESS: 'loggedIn',
                    LOGIN_FAILURE: {
                        target: 'loggedOut',
                    },
                    MFA_REQUIRED: 'getMfaCode',
                },

            },
            getMfaCode: {
                on: {
                    LOGIN_MFA: {
                        target: 'checkMfaLogin',
                        cond: 'hasMfaCredentials',
                    },
                    I_HAVE_NO_MFA: {
                        target: 'loggedOut',
                        actions: assign((ctx, evt) => {
                            return {mfaCode: null}
                        })
                    },
                    PROVIDE_MFA_CODE: {
                        target: 'getMfaCode',
                        actions: assign((ctx, evt) => {
                            return {mfaCode: evt.mfaCode}
                        })
                    }
                }
            },
            checkMfaLogin: {
                on: {
                    MFA_SUCCESS: {
                        target: 'loggedIn'
                    },
                    MFA_FAIL: {
                        target: 'getMfaCode',
                    },
                }
            },
            loggedIn: {
                on: {
                    LOGOUT: {
                        target: 'loggedOut'
                    }
                },
            },
            lockedOut: {
                type: 'final'
            }
        },
    },
    {
        guards: {
            hasCredentials: (ctx) => {
                return !!ctx.username && !!ctx.password;
            },
            hasMfaCredentials: (ctx) => {
                const mfaValid = ctx.mfaCode !== null && ctx.mfaCode.match(/^\d{6}$/) !== null;
                return !!ctx.username && !!ctx.password && mfaValid;
            }
        }
    }
);
