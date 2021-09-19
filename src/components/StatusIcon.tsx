import React, { useRef, useEffect } from 'react';

import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { injected, walletconnect } from 'utils/connectors';
import Jazzicon from '@metamask/jazzicon';

import WalletConnectIcon from 'assets/walletConnectIcon.svg';

const StyledIdenticonContainer = styled.div`
  height: 20px;
  width: 20px;
  border-radius: 10px;
`;

const IconWrapper = styled.div<{ size?: number }>`
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
`;

const Identicon = () => {
  const ref = useRef<HTMLDivElement>()
  const { account } = useWeb3React();
  
  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = ''
      ref.current.appendChild(Jazzicon(16, parseInt(account.slice(2, 10), 16)))
    }
  }, [account])

  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
  return <StyledIdenticonContainer ref={ref as any} />
}

function StatusIcon() {
  const { connector } = useWeb3React();
  
  if (connector === injected) {
    return (
      <Identicon />
    );
  } else if (connector === walletconnect) {
    return (
      <IconWrapper size={16}>
        <img src={WalletConnectIcon} alt="WalletConnect" />
      </IconWrapper>
    );
  }
  return null;
}

export default StatusIcon;