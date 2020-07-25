import React, {ChangeEvent} from "react";

interface MfaCodeProps {
    value: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const MfaCode = ({value, onChange}: MfaCodeProps) => {
    return (
        <label>MFA Code: <input
        type={'mfa_code'}
        value={value}
        name={'mfa_code'}
        onChange={onChange}/>
    </label>
    );
}

export default MfaCode;