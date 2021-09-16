import React, { useCallback, useState } from "react"
import { SubgraphN } from "../../shared/clients/n"
import Layout from "../components/Layout"
import { MintingType } from "../components/minting/MintingType"
import { MintStep } from "../components/minting/MintStep"
import { PublicMintStep } from "../components/minting/PublicMintStep"
import { SelectMintType } from "../components/minting/SelectMintType"
import { SelectNStep } from "../components/minting/SelectNStep"
import { SuccessStep } from "../components/minting/SuccessStep"
import { useAvailableWalletNs } from "../hooks/useAvailableWalletNs"

export default function Mint() {
  const { availableNs } = useAvailableWalletNs()
  const [mintingType, setMintingType] = useState<MintingType | null>(null)
  const [selectedN, setSelectedN] = useState<SubgraphN | null>(null)
  const [mintedTokenId, setMintedTokenId] = useState<number | null>(null)


  const handleCancelMint = useCallback(() => {
    setSelectedN(null)
  }, [])

  return (
    <Layout requireWallet>
      {mintedTokenId !== null ? (
        <SuccessStep tokenId={mintedTokenId} />
      ) : (
        mintingType === null ? (
          <SelectMintType onSelectMintType={setMintingType} />
        ) : (
          mintingType === MintingType.Public ? (
            <PublicMintStep onSuccess={setMintedTokenId} />
          ) : (
            selectedN === null ? (
              <SelectNStep availableNs={availableNs} onSelectN={setSelectedN} />
            ) : (
              <MintStep
                onCancel={handleCancelMint}
                selectedN={selectedN}
                onSuccess={setMintedTokenId}
              />
            )
          )
        )
      )}
    </Layout>
  )
}
