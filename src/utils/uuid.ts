const uuid = (length: number = 30) => {
 let letters = `abcdefghijklmnopqrstuvwxyz`;
 let numbers = `1234567890`;
 let str = `${letters}${numbers}${letters.toLocaleUpperCase()}${Date.now()}`;

 const id = str.split("").sort(() => Math.random() - 0.5).slice(0,length).join("");
 return id;
};

export default uuid;