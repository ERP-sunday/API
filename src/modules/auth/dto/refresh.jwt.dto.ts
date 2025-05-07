import {IsNotEmpty, IsString} from "class-validator";
import {ValidationMessages} from "../../../common/utils/validation.messages";

export class RefreshJwtDTO {
    @IsString({ message: ValidationMessages.STRING })
    @IsNotEmpty({ message: ValidationMessages.REQUIRED })
    refreshToken: string;
}