import { ErrorDetail } from "../utils/expressCustom";
import { HttpStatusCode } from "../utils/httpStatusCode";
import { ErrorCustom } from "./ErrorCustom";

export class Unauthorized extends ErrorCustom {
  statusCode = HttpStatusCode.UNAUTHORIZED;
  constructor(private error: ErrorDetail) {
    super(error);
    Object.setPrototypeOf(this, Unauthorized.prototype);
  }
  serializeError() {
    return {
      errorCode: this.error.errorCode,
      errorMessage: this.error.errorMessage,
    };
  }
}
