import { UnsupportedMediaTypeException } from "@nestjs/common";
import { ExpressAdapter } from "@nestjs/platform-express";

export function fileMimetypeFilter(...mimetype: string[]) {
    return (
        req,
        file: Express.Multer.File,
        callback: (error: Error | null, acceptFile: boolean) => void,

    ) => {
        if (mimetype.some((m) => file.mimetype.includes(m))) {
            callback(null, true)
        } else {
            callback(
                new UnsupportedMediaTypeException(
                    `File type is not matching: ${mimetype.join(', ')}`,
                ),
                false,
            )
        }
    }
}