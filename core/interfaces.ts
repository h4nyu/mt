import { Board } from './board'

export type BoardStore = {
  create: (boards: Board[]) => Promise<void|Error>
  read: (req: {
    symbols: string[]
    from?: Date
    to?: Date
    limit?: number
  }) => Promise<void|Error>
}
