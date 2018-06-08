import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@core/index';
import { ToastService } from '@core/toast';
import { Response } from '@shared/models';
import { OptionsService } from '../options.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.scss']
})

export class ProfileComponent implements OnInit {
  detailsForm: FormGroup;
  passwordForm: FormGroup;
  saving = false;
  showCropperPopup = false;
  // user: User;
  get hasAvatar() {
    return !!this.detailsForm.controls.avatar.value;
  }
  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private options: OptionsService,
    private toast: ToastService,
    private auth: AuthService) { }
  ngOnInit() {
    this.detailsForm = this.fb.group({
      id: [this.auth.user.id],
      avatar: [this.auth.user.avatar],
      email: [this.auth.user.email, Validators.compose([Validators.required, Validators.email])],
      username: [this.auth.user.username, Validators.compose([Validators.required])]
    });
    this.passwordForm = this.fb.group({
      id: [this.auth.user.id],
      password: ['', Validators.compose([Validators.required])],
      confirm_password: ['', Validators.compose([Validators.required])]
    });
  }
  onSaveProfile(e) {
    this.saving = true;
    this.options.updateProfile(this.detailsForm.value).subscribe((response: Response<any>) => {
      if (response.success) {
        this.auth.user.username = this.detailsForm.value.username;
        this.auth.user.email = this.detailsForm.value.email;
        this.auth.user.avatar = this.detailsForm.value.avatar;
        this.toast.push$.next({ type: 'success', text: 'Profile details saved !' });
      } else {
        this.toast.push$.next({ type: 'error', text: 'An error occured ! Not able to save your profile details !' });
      }
      this.saving = false;
    });
  }
  onSavePassword(e) { }
  onFileChange(e) {
    // console.log('onFileChange', e);
    const reader = new FileReader();
    const files = e.target.files;
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
    // console.log('# FILE', reader.result);
    this.patchAvatar(reader.result);
    // console.log('FB', this.detailsForm);
    // this.user.avatar = reader.result;
  }
  private patchAvatar(value) {
    this.detailsForm.patchValue({
      avatar: value
    });
    this.cd.markForCheck();
    this.auth.user.avatar = value;
  }
  openCropperPopup() {
    this.showCropperPopup = true;
  }
  onCropperPopupValidate(image) {
    this.patchAvatar(image);
  }
}
