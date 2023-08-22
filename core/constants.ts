export enum Action {
  BUY = "BUY",
  SELL = "SELL",
  STAY = "STAY",
}

export enum Sign {
  NONE = "0000", // 事象なし
  UNCHANGED = "0056", // 変わらず
  UP = "0057", // UP
  DOWN = "0058", // DOWN
  INITIAL_VALUE_AFTER_INTERRUPTED_PRE_OPEN = "0059", // 中断板寄り後の初値
  TRADING_SESSION_CLOSE = "0060", // ザラバ引け
  CLOSING_AUCTION = "0061", // 板寄り引け
  HALT_CLOSE = "0062", // 中断引け (修正)
  DOWN_CLOSE = "0063", // ダウン引け
  REVERSAL_CLOSING_PRICE = "0064", // 逆転終値
  SPECIAL_QUOTATION_CLOSE = "0066", // 特別気配引け
  TEMPORARY_RESERVATION_CLOSE = "0067", // 一時留保引け
  TRADING_HALT_CLOSE = "0068", // 売買停止引け
  CIRCUIT_BREAKER_CLOSE = "0069", // サーキットブレーカ引け
  DYNAMIC_CIRCUIT_BREAKER_CLOSE = "0431", // ダイナミックサーキットブレーカ引け
  GENERAL_QUOTATION = "0101", // 一般気配
  SPECIAL_QUOTATION = "0102", // 特別気配
  ATTENTION_QUOTATION = "0103", // 注意気配
  PRE_OPENING_QUOTATION = "0107", // 寄前気配
  PRE_STOP_QUOTATION = "0108", // 停止前特別気配
  POST_CLOSE_QUOTATION = "0109", // 引け後気配
  NO_TRADE_POINT_PRE_OPEN = "0116", // 寄前気配約定成立ポイントなし
  TRADE_POINT_EXISTS_PRE_OPEN = "0117", // 寄前気配約定成立ポイントあり
  CONTINUOUS_TRADING_QUOTATION = "0118", // 連続約定気配
  PRE_STOP_CONTINUOUS_TRADING_QUOTATION = "0119", // 停止前の連続約定気配
  BUY_UP_SELL_DOWN = "0120", // 買い上がり売り下がり中
}

export enum Code {
  "1328.T"="1328.T",
  "1399.T"="1399.T",
  "1477.T"="1477.T",
  "1572.T"="1572.T",
  "1605.T"="1605.T",
  "1617.T"="1617.T",
  "1623.T"="1623.T",
  "1630.T"="1630.T",
  "1631.T"="1631.T",
  "1632.T"="1632.T",
  "1633.T"="1633.T",
  "1655.T"="1655.T",
  "2516.T"="2516.T",
  "2628.T"="2628.T",
  "2530.T"="2530.T",
  "4063.T"="4063.T",
  "4519.T"="4519.T",
  "4502.T"="4502.T",
  "4568.T"="4568.T",
  "6098.T"="6098.T",
  "6178.T"="6178.T",
  "6367.T"="6367.T",
  "6501.T"="6501.T",
  "6594.T"="6594.T",
  "6701.T"="6701.T",
  "6723.T"="6723.T",
  "6857.T"="6857.T", 
  "6758.T"="6758.T", // Sony
  "6861.T"="6861.T", 
  "7203.T"="7203.T",
  "7267.T"="7267.T",
  "7974.T"="7974.T",
  "8001.T"="8001.T",
  "8031.T"="8031.T",
  "8035.T"="8035.T",
  "8058.T"="8058.T", 
  "8267.T"="8267.T",
  "8306.T"="8306.T", 
  "9432.T"="9432.T", 
  "9433.T"="9433.T", 
  "9983.T"="9983.T",
  "9984.T"="9984.T",
}
