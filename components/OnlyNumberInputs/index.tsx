import React from 'react'
import s from './OnlyNumberInputs.module.scss'

type OnlyNumberInputsProps = {
    label: string,
    value: number,
    onChange: any
}

export const OnlyNumberInputs: React.FC<OnlyNumberInputsProps> = ({
    label,
    value,
    onChange
}) => {

    return (
        <div className={s.container}>
            <label className={s.label}>
                <div className={s.descContainer}>{label && <div className={s.text}>{label}</div>}</div>
                <input className={s.input} type="text" value={value} onChange={onChange} />
            </label>
        </div>
    );
}
