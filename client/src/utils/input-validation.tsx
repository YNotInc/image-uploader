function correctInput(id: string) {

  const target = document.getElementById(id)! as HTMLInputElement;
  console.log("target:", target);

  target.addEventListener("keyup", eventHandler);

  function eventHandler(e: Event) {
    const regex = /\s/g;
    target.value = target.value.replace(regex, "").toLowerCase()!;
  }
}
function displayInputErrors(idTagName: string, pwdTagName: string, imgTagName: string = '') {
  const email = document.getElementById(idTagName)! as HTMLInputElement;
  const emailText = email.value;
  const password = document.getElementById(pwdTagName)! as HTMLInputElement;
  const passwordText = password?.value;

  //Optional
  const image = document.getElementById
  (imgTagName)! as any;
  if (image) {
    const imageFile = image.files[0];
    console.log("IMAGEFile:", imageFile);
    if (!imageFile) {
      console.log("Image Input Border should be set to red")
      // image.style.border = "solid 1px red!important";
      image.setAttribute("class", "image-input-error")
    }
  }

  if (!emailText) {
    console.log("Style should be red");
    if (email) {
      email.style.borderColor = "red";
    }
  }
  if (!passwordText) {
    password.style.borderColor = "red";
  }
}

function removeImgErrorDisplay(imageId: string, imageClassAttr: string) {
  document.getElementById(imageId)?.classList.remove(imageClassAttr);
}

function
  removeInputErrors(target: any) {
  target.style.borderColor = "";
}

export { correctInput, displayInputErrors, removeImgErrorDisplay, removeInputErrors };
