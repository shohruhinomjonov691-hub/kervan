export enum HttpCode {
  OK = 200,
  CREATED = 201,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum Message {
  SOMETHING_WENT_WRONG = "Something went wrong!",
  NO_DATA_FOUND = "No data is found!",
  CREATE_FAILED = "Create is failed!",
  UPDATE_FAILED = "Update is failed!",

  USED_NICK_PHONE = "You are inserting alerady used nick or phone!",
  TOKEN_CREATION_FAILED = "Token creation error!",
  NO_MEMBER_NICK = "No member with that member nick!",
  BLOCKED_USER = "You have been blocked, contact restaurant!",
  WRONG_PASSWORD = "Wrong password, please try again!",
  NOT_AUTHENTICATED = "You are not authenticated, Please login first!",

  NO_PAYMENT_METHOD = "Please add a payment method before paying!",
  INVALID_CARD = "Please enter valid card details!",
  INVALID_ORDER_STATUS = "Invalid order status change!",

  EMPTY_COMMENT = "Please write a comment before submitting!",

  EMPTY_BASKET = "Your basket is empty!",
  INVALID_QUANTITY = "Please enter a valid quantity!",
  PRODUCT_UNAVAILABLE = "One or more items in your basket are no longer available!",
}

class Errors extends Error {
  public code: HttpCode;
  public message: Message;

  static standard = {
    code: HttpCode.INTERNAL_SERVER_ERROR,
    message: Message.SOMETHING_WENT_WRONG,
  };

  constructor(statusCode: HttpCode, statusMessage: Message) {
    super();
    this.code = statusCode;
    this.message = statusMessage;
  }
}

export default Errors;
