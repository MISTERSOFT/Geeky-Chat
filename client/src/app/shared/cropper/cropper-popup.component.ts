import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { PopupBaseComponent } from '@shared/popup/popup-base.component';

@Component({
  selector: 'app-cropper-popup',
  templateUrl: 'cropper-popup.component.html'
})

export class CropperPopupComponent extends PopupBaseComponent implements OnDestroy {
  @Input() image: any;
  @Output() validate = new EventEmitter<string>();

  @ViewChild('inputFile') $inputFile: ElementRef;
  private croppedImage: string;
  constructor() {
    super();
  }
  ngOnDestroy() {
    this.croppedImage = null;
  }
  onClosed() {
    super.close();
  }
  /**
   * Handle the end of the crop
   * @param image {string} Base64 image
   */
  onCropEnd(image: string) {
    this.croppedImage = image;
  }
  onValidate() {
    this.validate.next(this.croppedImage);
    super.close();
  }
  import() {
    this.$inputFile.nativeElement.click();
  }
  onFileImported(e) {
    // console.log('onFileChange', e);
    const reader = new FileReader();
    const files = e.target.files;
    // TODO: Check file extension
    if (files && files.length > 0) {
      reader.onabort = this.onFileReaderError.bind(this);
      reader.onerror = this.onFileReaderError.bind(this);
      reader.onload = this.onFileReaderOnLoad.bind(this, reader);
      reader.readAsDataURL(files[0]);
    }
  }

  private onFileReaderError() {
    console.log('error file');
    // TODO: Display error
  }
  private onFileReaderOnLoad(reader: FileReader) {
    // console.log('# FILE IMPORTED', reader.result);
    this.image = reader.result;
  }
}
