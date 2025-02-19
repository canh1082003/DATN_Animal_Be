import { ErrorDetail } from "../utils/expressCustom";
import { HttpStatusCode } from "../utils/httpStatusCode";
import { ErrorCustom } from "./ErrorCustom";

export class Forbidden extends ErrorCustom{
    statusCode= HttpStatusCode.FORBIDDEN;
    constructor(private error:ErrorDetail){
        super(error);
        Object.setPrototypeOf(this,Forbidden.prototype)
    }
    serializeError(){
        return{
            errorCode: this.error.errorCode,
            errorMessage: this.error.errorMessage,
        }
    }
}