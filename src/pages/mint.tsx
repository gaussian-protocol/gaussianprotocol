import React, { useCallback, useState } from "react"
import { SubgraphN } from "../../shared/clients/n"
import Layout from "../components/Layout"
import { MintingType } from "../components/minting/MintingType"
import { MintStep } from "../components/minting/MintStep"
import { SelectMintType } from "../components/minting/SelectMintType"
import { SelectNStep } from "../components/minting/SelectNStep"
import { SuccessStep } from "../components/minting/SuccessStep"
import { useAvailableWalletNs } from "../hooks/useAvailableWalletNs"

export default function Mint() {
  const { availableNs } = useAvailableWalletNs()
  const [mintingType, setMintingType] = useState<MintingType | null>(null)
  const [selectedN, setSelectedN] = useState<SubgraphN | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleCancelMint = useCallback(() => {
    setSelectedN(null)
  }, [])

  const handleSuccess = useCallback(() => {
    setIsSuccess(true)
  }, [])

  return (
    <Layout requireWallet>
      {selectedN ? (
        isSuccess ? (
          <SuccessStep tokenId={parseInt(selectedN.id)} />
        ) : (
          <MintStep
            onCancel={handleCancelMint}
            selectedN={selectedN}
            onSuccess={handleSuccess}
          />
        )
      ) : (
        mintingType === null ? (
          <SelectMintType onSelectMintType={setMintingType} />
        ) : (
          <SelectNStep availableNs={availableNs} onSelectN={setSelectedN} />
        )
      )}
    </Layout>
  )
}
