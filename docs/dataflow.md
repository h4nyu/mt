```mermaid
flowchart TD
KabusAPI -->|WebSocket push| Board
Board -->|Save| DB
Board --> DetectSignal
MLModel --> DetectSignal
DetectSignal --> NotifyToUI
HumanTradeHistory --> MLModel
```
