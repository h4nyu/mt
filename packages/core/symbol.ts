
export type Symbol = {
  id: SymbolId
  description: string
}

export enum SymbolId {
  ETH = 'ETH',
  BTC = 'BTC',
}
export const Symbol = (props: Symbol):Symbol => {
  const { id, description } = props
  return {
    id,
    description,
  }
}
