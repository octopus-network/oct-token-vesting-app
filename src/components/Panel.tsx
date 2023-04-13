import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'

import {
  Box,
  Heading,
  Flex,
  Text,
  Button,
  VStack,
  Skeleton,
  useBoolean,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  Icon,
  Link,
  HStack,
  Tooltip,
} from '@chakra-ui/react'

import styled from 'styled-components'
import { ExternalLinkIcon, QuestionOutlineIcon } from '@chakra-ui/icons'
import { useEffect } from 'react'
import { MdRefresh } from 'react-icons/md'
import { AiOutlineWarning } from 'react-icons/ai'
import { getBalanceAmount, beautifyAmount, ZERO } from 'utils/formatBalance'
import useTxns from 'hooks/useTransactions'

const RefreshIcon = styled(Icon)<{ refreshing: boolean }>`
  animation: ${({ refreshing }) =>
    refreshing
      ? 'rotate360 .3s cubic-bezier(0.83, 0, 0.17, 1) infinite'
      : 'none'};
  transform: translateZ(0);
`

const Panel = ({ contract }) => {
  const { account, chainId } = useWeb3React()
  const [totalBenefit, setTotalBenefit] = useState(ZERO)
  const [unreleasedBalance, setUnreleasedBalance] = useState(ZERO)
  const [releasedBalance, setReleasedBalance] = useState(ZERO)
  const [withdrawedBalance, setWithdrawedBalance] = useState(ZERO)
  const [beneficiary, setBeneficiary] = useState('')
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [isWithdrawed, setIsWithdrawed] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [isModalOpen, setIsModalOpen] = useBoolean()
  const { appendTx } = useTxns()

  const explorerUrl =
    chainId === 1 ? 'https://www.etherscan.io' : 'https://ropsten.etherscan.io'

  const onRefresh = () => {
    if (!account) {
      return
    }
    setIsRefreshing(true)
    Promise.all([
      contract.methods.totalBenefit().call(),
      contract.methods.unreleasedBalance().call(),
      contract.methods.releasedBalance().call(),
      contract.methods.withdrawedBalance().call(),
      contract.methods.beneficiary().call(),
    ]).then(([benefit, unreleased, released, withdrawed, tmpBeneficiary]) => {
      setTotalBenefit(getBalanceAmount(benefit))
      setUnreleasedBalance(getBalanceAmount(unreleased))
      setReleasedBalance(getBalanceAmount(released))
      setWithdrawedBalance(getBalanceAmount(withdrawed))
      setBeneficiary(tmpBeneficiary)
      setTimeout(() => {
        setIsRefreshing(false)
      }, 300)
    })
  }

  const onWithdraw = async () => {
    setIsWithdrawing(true)
    try {
      await contract.methods
        .withdraw()
        .send(
          {
            from: account,
          },
          (err, hash) => {
            if (!err) {
              appendTx({
                addedTime: new Date().getTime(),
                hash,
                from: account,
                summary: `Withdraw OCT`,
              })
              setTimeout(() => {
                setIsWithdrawed(true)
                setIsWithdrawing(false)
              }, 1500)
            }
          }
        )
        .catch((err) => {
          throw err
        })
    } catch ({ code, message }: any) {
      if (code === 4001) {
        setModalMessage('Transaction rejected.')
      } else if (message) {
        setModalMessage(message as any)
      } else {
        setModalMessage('Unknown error.')
      }
      setIsModalOpen.on()
      setIsWithdrawing(false)
    }
  }

  useEffect(() => {
    if (!contract) {
      return
    }
    onRefresh()
  }, [contract, onRefresh])

  return (
    <>
      <Box p={6} pb={8} boxShadow="octoShadow" borderRadius="8" bg="#fff">
        <Flex alignItems="center" justifyContent="space-between">
          <Heading fontSize="2xl">My Vesting</Heading>
          {account && (
            <Flex
              fontSize="sm"
              onClick={onRefresh}
              color="gray"
              cursor="pointer"
              alignItems="center"
            >
              <RefreshIcon
                refreshing={isRefreshing ? 1 : 0}
                as={MdRefresh}
                w="4"
                h="4"
              />
              <Text>Refresh</Text>
            </Flex>
          )}
        </Flex>
        <Skeleton isLoaded={!isRefreshing && !!account}>
          <Box p={4} mt={6} bg="rgba(120, 120, 150, .06)" borderRadius={5}>
            <VStack spacing={3} alignItems="flex-start">
              <Flex color="gray" alignItems="flex-end">
                <HStack minW="120px" fontSize="sm">
                  <Tooltip label="The total amount of OCT token that the beneficiary can withdraw during the timelock duration">
                    <QuestionOutlineIcon />
                  </Tooltip>
                  <Text>Total Benefit:</Text>
                </HStack>
                <Heading fontSize="md" color="black">
                  {beautifyAmount(totalBenefit)} OCT
                </Heading>
              </Flex>
              <Flex color="gray" alignItems="flex-end">
                <HStack minW="120px" fontSize="sm">
                  <Tooltip label="Unreleased balance">
                    <QuestionOutlineIcon />
                  </Tooltip>
                  <Text>Unreleased:</Text>
                </HStack>
                <Heading fontSize="md" color="black">
                  {beautifyAmount(unreleasedBalance)} OCT
                </Heading>
              </Flex>
              <Flex color="gray" alignItems="flex-end">
                <HStack minW="120px" fontSize="sm">
                  <Tooltip label="Released balance, totalBenefit * the days passed since releaseStartTime / daysOfTimelock">
                    <QuestionOutlineIcon />
                  </Tooltip>
                  <Text>Released:</Text>
                </HStack>
                <Heading fontSize="md" color="black">
                  {beautifyAmount(releasedBalance)} OCT
                </Heading>
              </Flex>
              <Flex color="gray" alignItems="flex-end">
                <HStack minW="120px" fontSize="sm">
                  <Tooltip label="Beneficiary of tokens after they are released">
                    <QuestionOutlineIcon />
                  </Tooltip>
                  <Text>Beneficiary:</Text>
                </HStack>
                <Link
                  href={`${explorerUrl}/address/${beneficiary}`}
                  target="_blank"
                >
                  <HStack color="octoColor.500" fontSize="sm">
                    <Text
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      maxW="100px"
                    >
                      {beneficiary}
                    </Text>
                    <ExternalLinkIcon />
                  </HStack>
                </Link>
              </Flex>
            </VStack>
          </Box>
        </Skeleton>
        <Box mt={4}>
          <Skeleton isLoaded={!isRefreshing && !!account}>
            <Button
              width="100%"
              size="lg"
              variant="solid"
              onClick={onWithdraw}
              isLoading={isWithdrawing}
              isDisabled={
                isWithdrawed ||
                !contract ||
                isWithdrawing ||
                !account ||
                withdrawedBalance.gte(releasedBalance)
              }
              borderRadius="30"
              colorScheme="octoColor"
            >
              {withdrawedBalance.gte(releasedBalance) || isWithdrawed
                ? 'Withdrawed'
                : `Withdraw ${beautifyAmount(
                    releasedBalance.minus(withdrawedBalance)
                  )} OCT`}
            </Button>
          </Skeleton>
        </Box>
      </Box>
      <Flex
        mt={4}
        color="gray"
        fontSize="sm"
        borderRadius={5}
        justifyContent="center"
      >
        <Text mr={1}>Contract:</Text>
        <Link
          href={`${explorerUrl}/address/${contract?.options.address}`}
          ml={1}
          target="_blank"
        >
          <HStack>
            <Text
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              maxW="200px"
            >
              {contract?.options.address}
            </Text>
            <ExternalLinkIcon />
          </HStack>
        </Link>
      </Flex>
      <Modal isOpen={isModalOpen} onClose={setIsModalOpen.off}>
        <ModalOverlay />
        <ModalContent ml={2} mr={2}>
          <ModalHeader>Error</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <Icon as={AiOutlineWarning} w="16" h="16" color="red" />
              <Box textAlign="center">
                <Heading fontSize="lg" color="red">
                  {modalMessage}
                </Heading>
              </Box>
            </VStack>
            <Box mt="8" mb="2">
              <Button onClick={setIsModalOpen.off} width="100%">
                Dismiss
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Panel
