import {Injectable} from '@angular/core';
import {DataService} from "../data/data.service";
import {Comment} from "../../models/comment.model"

@Injectable({
  providedIn: 'root'
})
export class FileUploadService extends DataService {
  private servicePrefix: string = "file";

  dataURLtoFile(dataurl: string, filename: string): File {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/);

    if (!mime) {
      throw new Error('The provided "dataurl" does not contain MIME information.');
    }

    let bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type: mime[1]});
  }

  uploadImage(file: File, savePath: string, imageId: string) {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('savePath', savePath);
    formData.append('imageId', imageId);

    return this.http.post(this.hostname + this.servicePrefix + "/uploadImage", formData, {
      responseType: 'text',
    });
  }
}
