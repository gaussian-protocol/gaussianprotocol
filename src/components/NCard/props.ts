import { FlexProps } from "@chakra-ui/react"
import { SubgraphN } from "../../../shared/clients/n"

export type NCardProps = {
  n: SubgraphN
  containerProps?: Partial<FlexProps>
}
