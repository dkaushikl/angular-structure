export enum ApiResponseStatus {
    Ok = 0,
    Error = 1,
}

export enum ApiOperationStatus {
    Success = 0,
    Failed = 1,
    Error = 2,
    Warning = 3,
    Authorize = 4,
    ValidationFailed = 5
}

export enum OrderType {
    Buy = 1,
    Sell = 2,
}

export enum SupportTicket {
  Pending = 1,
  Confirm = 2
}
