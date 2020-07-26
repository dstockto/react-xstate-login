import {assign, Machine} from "xstate";

interface MfaCodeContext {
    mfaCode: string,
    showHelp: boolean,
}

export default Machine<MfaCodeContext>(
    {
        id: 'mfaCode',
        initial: 'empty',
        context: {
            mfaCode: '',
            showHelp: false,
        },
        states: {
            empty: {
                on: {
                    UPDATE_MFA_CODE: {
                        actions: [
                            assign((ctx, evt) => ({mfaCode: evt.mfaCode}))
                        ]
                    }
                },
                always: [
                    {
                        target: 'invalid',
                        cond: 'mfaInvalid'
                    },
                    {
                        target: 'valid',
                        cond: 'mfaValid'
                    }
                ],
                after: {
                    10000: {
                        target: 'help',
                        actions: [
                            assign((ctx, evt) => ({showHelp: true}))
                        ]
                    },

                }
            },
            invalid: {
                on: {
                    UPDATE_MFA_CODE: {
                        actions: [
                            assign((ctx, evt) => ({mfaCode: evt.mfaCode}))
                        ]
                    }
                },
                always: [
                    {
                        target: 'empty',
                        cond: 'mfaEmpty'
                    },
                    {
                        target: 'valid',
                        cond: 'mfaValid'
                    }
                ]
            },
            valid: {
                on: {
                    UPDATE_MFA_CODE: {
                        actions: [
                            assign((ctx, evt) => ({mfaCode: evt.mfaCode}))
                        ]
                    }
                },
                always: [
                    {
                        target: 'empty',
                        cond: 'mfaEmpty'
                    },
                    {
                        target: 'invalid',
                        cond: 'mfaInvalid'
                    },
                ]
            },
            help: {
                // invoke: 'turnOnHelp',
                always: [
                    {
                        cond: 'mfaEmpty',
                        target: 'empty'
                    },
                    {
                        cond: 'mfaValid',
                        target: 'valid',
                    },
                    {
                        cond: 'mfaInvalid',
                        target: 'invalid'
                    },
                ]
            }
        },
    },
    {
        guards: {
            mfaEmpty: (ctx: MfaCodeContext) => (
                ctx.mfaCode === ''
            ),
            mfaInvalid: (ctx: MfaCodeContext) => (
                ctx.mfaCode !== '' && ctx.mfaCode.match(/^\d{6}$/) === null
            ),
            mfaValid: (ctx: MfaCodeContext) => (
                ctx.mfaCode.match(/^\d{6}$/) !== null
            ),
        },
        actions: {
            // turnOnHelp: assign({showHelp: true}),
        }
    }
);
