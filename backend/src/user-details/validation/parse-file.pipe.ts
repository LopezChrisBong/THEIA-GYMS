import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseFile implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (value.mimetype == 'image/png' || value.mimetype == 'image/jpg' || value.mimetype == 'image/jpeg') {
            return {
                err: false,
                file: value
            }
        } else {
            return {
                err: true,
                file: value
            }

        }
    }
}