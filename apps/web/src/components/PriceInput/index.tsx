import BN from 'bignumber.js'
import Image from 'next/image'
import { useState } from 'react'

import { NumericalInput } from '@pancakeswap/widgets-internal'
import infoError from '../../../public/images/nfts2/info-error.svg'
import { Wrapper } from './index.style'

type IPriceInput = {
  label: string
  balance?: string
  amount: string
  setAmount: (value: string) => void
  errorMsg?: string
  suffix: React.ReactNode
  disabled?: boolean
  min?: number
  max?: number
  decimal?: number
}
export default function PriceInput({
  label,
  balance,
  amount,
  setAmount,
  errorMsg,
  suffix,
  disabled,
  min = 0,
  max = 999999,
  decimal = 18,
}: IPriceInput) {
  const [internalError, setInternalError] = useState('')
  const getDecimalLength = (value: string) => {
    const parts = value.split('.')
    return parts.length > 1 ? parts[1].length : 0
  }
  return (
    <Wrapper>
      <div className={`price-input__wrapper ${errorMsg ? 'price-input__wrapper--error' : ''}`}>
        <div className="price-input__label-box">
          <div className="price-input__label">{label}</div>
          {balance !== undefined && (
            <div className="price-input__balance-box">
              <div className="price-input__balance-label">Balance</div>
              <div className="price-input__balance-value">{balance}</div>
            </div>
          )}
        </div>
        <div className="price-input__input-box">
          <NumericalInput
            align="left"
            className="price-input__input"
            type="number"
            placeholder=""
            inputMode="decimal"
            value={amount}
            style={{ width: '260px' }}
            pattern="^[0-9]*[.,]?[0-9]*$"
            onUserInput={(val) => {
              const bn = new BN(val)
              if (bn.isGreaterThan(max)) {
                setInternalError(`The maximum value is ${max}`)
              } else if (bn.isLessThan(min)) {
                setInternalError(`The minimum value is ${min}`)
              } else if (getDecimalLength(val || '') > decimal) {
                setInternalError(`The maximum decimal is ${decimal}`)
              } else {
                setInternalError('')
              }
              setAmount(val)
            }}
            max={max}
            disabled={disabled}
          />
          {suffix && <div className="price-input__input-suffix">{suffix}</div>}
        </div>
        {(errorMsg || internalError) && (
          <div className="price-input__error-box">
            <Image src={infoError} alt="error icon" className="price-input__error-icon" />
            <div className="price-input__error-msg">{errorMsg || internalError}</div>
          </div>
        )}
      </div>
    </Wrapper>
  )
}
