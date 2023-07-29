
export enum Action {
  BUY='BUY',
  SELL='SELL',
  STAY='STAY',
}


export enum SymbolId {
  BTC = "BTC",
  ETH = "ETH",
  BTC_JPY = "BTC_JPY",
  ETH_JPY = "ETH_JPY",
  XRP_JPY = "XRP_JPY",
  LTC_JPY = "LTC_JPY",
}

export enum Sign {
    NONE = "0000",  // 事象なし
    UNCHANGED = "0056",  // 変わらず
    UP = "0057",  // UP
    DOWN = "0058",  // DOWN
    INITIAL_VALUE_AFTER_INTERRUPTED_PRE_OPEN = "0059",  // 中断板寄り後の初値
    TRADING_SESSION_CLOSE = "0060",  // ザラバ引け
    CLOSING_AUCTION = "0061",  // 板寄り引け
    TRADING_HALT_CLOSE = "0062",  // 中断引け
    DOWN_CLOSE = "0063",  // ダウン引け
    REVERSAL_CLOSING_PRICE = "0064",  // 逆転終値
    SPECIAL_QUOTATION_CLOSE = "0066",  // 特別気配引け
    TEMPORARY_RESERVATION_CLOSE = "0067",  // 一時留保引け
    TRADING_HALT_CLOSE = "0068",  // 売買停止引け
    CIRCUIT_BREAKER_CLOSE = "0069",  // サーキットブレーカ引け
    DYNAMIC_CIRCUIT_BREAKER_CLOSE = "0431",  // ダイナミックサーキットブレーカ引け
    GENERAL_QUOTATION = "0101",  // 一般気配
    SPECIAL_QUOTATION = "0102",  // 特別気配
    ATTENTION_QUOTATION = "0103",  // 注意気配
    PRE_OPENING_QUOTATION = "0107",  // 寄前気配
    PRE_STOP_QUOTATION = "0108",  // 停止前特別気配
    POST_CLOSE_QUOTATION = "0109",  // 引け後気配
    NO_TRADE_POINT_PRE_OPEN = "0116",  // 寄前気配約定成立ポイントなし
    TRADE_POINT_EXISTS_PRE_OPEN = "0117",  // 寄前気配約定成立ポイントあり
    CONTINUOUS_TRADING_QUOTATION = "0118",  // 連続約定気配
    PRE_STOP_CONTINUOUS_TRADING_QUOTATION = "0119",  // 停止前の連続約定気配
    BUY_UP_SELL_DOWN = "0120",  // 買い上がり売り下がり中
}

