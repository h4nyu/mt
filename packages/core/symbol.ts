
export type Symbol = {
  id: SymbolId
  description: string
}

export enum SymbolId {
  BTC_JPY = 'BTC_JPY',
  ETH_JPY = 'ETH_JPY',
}
export const Symbol = (props: Symbol):Symbol => {
  const { id, description } = props
  return {
    id,
    description,
  }
}
