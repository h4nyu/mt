```mermaid
erDiagram
    Symbol ||--o{ Order : symbolId
    Symbol ||--o{ Candle : symbolId
    Position ||--|| Order : orderId
```
