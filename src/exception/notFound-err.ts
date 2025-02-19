import { ErrorDetail } from "../utils/expressCustom";
import { HttpStatusCode } from "../utils/httpStatusCode";
import { ErrorCustom } from "./ErrorCustom";

export class NotFoundErr extends ErrorCustom {
  statusCode = HttpStatusCode.NOT_FOUND;
  constructor(private error: ErrorDetail) {
    super(error);
    Object.setPrototypeOf(this, NotFoundErr.prototype);
  }
  serializeError() {
    return {
      errorCode: this.error.errorCode,
      errorMessage: this.error.errorMessage,
    };
  }
}
