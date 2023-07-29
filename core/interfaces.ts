import { Board } from './board'

export type BoardStore = {
  create: (boards: Board[]) => Promise<void|Error>
}
