function CartId() {
  const generateRandomString = () => {
    const length = 6;
    const characters = "1234567890";
    let randomstring = "";

    for(let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      randomstring += characters.charAt(randomIndex);
    }
    localStorage.setItem("randomString", randomstring);
  };
  const existingRandomString = localStorage.getItem("randomString");
  if(!existingRandomString) {
    generateRandomString()
  }

  return existingRandomString;
}


export default CartId;