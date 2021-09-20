import React, { useState, useEffect, useRef } from 'react';
import { useWeb3React } from '@web3-react/core';

import {
  Link
} from '@chakra-ui/react';

import styled, { keyframes } from 'styled-components';

const StyledPolling = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 1rem;
  padding-right: 0;
  color: rgb(39, 174, 96);
`;
const StyledPollingNumber = styled.div<{ breathe: boolean; hovering: boolean }>`
  transition: opacity 0.25s ease;
  opacity: ${({ breathe, hovering }) => (hovering ? 0.7 : breathe ? 1 : 0.3)};
  :hover {
    opacity: 1;
  }
`;
const StyledPollingDot = styled.div`
  width: 8px;
  height: 8px;
  min-height: 8px;
  min-width: 8px;
  margin-left: 0.5rem;
  border-radius: 50%;
  position: relative;
  background-color: rgb(39, 174, 96);
`

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  animation: ${rotate360} 1s cubic-bezier(0.83, 0, 0.17, 1) infinite;
  transform: translateZ(0);
  border-top: 1px solid transparent;
  border-right: 1px solid transparent;
  border-bottom: 1px solid transparent;
  border-left: 2px solid ${({ theme }) => theme.green1};
  background: transparent;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  position: relative;
  left: -3px;
  top: -3px;
`;

const Polling = () => {
  const [isHover, setIsHover] = useState(false);
  const [blockNumber, setBlockNumber] = useState(0);
  const [isMounting, setIsMounting] = useState(false);
  const { library, chainId } = useWeb3React();
  
  const mountingTimerRef = useRef<any>();
  const explorerUrl = chainId === 1 ? 'https://www.etherscan.io' : 'https://ropsten.etherscan.io';

  const onNewBlock = (block) => {
    setBlockNumber(block);
    setIsMounting(true);
    mountingTimerRef.current = setTimeout(() => setIsMounting(false), 1000);
  }

  useEffect(() => {
    if (!library) {
      return;
    }
    library.on('block', onNewBlock);
    return () => {
      clearTimeout(mountingTimerRef.current);
      library.removeListener('block', onNewBlock);
    }

  }, [library]);

  return (
    <Link href={`${explorerUrl}/block/${blockNumber}`} target="_blank">
      <StyledPolling onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
        <StyledPollingNumber breathe={isMounting} hovering={isHover}>
          {blockNumber}
        </StyledPollingNumber>
        <StyledPollingDot>{isMounting && <Spinner />}</StyledPollingDot>
      </StyledPolling>
    </Link>
  );
}

export default Polling;