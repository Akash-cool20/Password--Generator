const inputSlider= document.querySelector("[data-lengthslider]");
const lenghtDisplay=document.querySelector("[datalengthnumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const cpyBtn=document.querySelector("[data-cpy]");
const copyMsg=document.querySelector("[data-cpymsg]");
const uppercaseCheck=document.querySelector('#uppercase');
const lowercaseCheck=document.querySelector('#lowercase');
const numberCheck=document.querySelector('#numbers');
const symbolCheck=document.querySelector('#symbols');
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols="+-~`!@#$%^&*()_+|\{}][:;<>?/.,"
 
let password="";
let passwordLength=10;
let checkCount=1;

handleSlider();
// set password Length
function handleSlider(){
    inputSlider.value=passwordLength;
    lenghtDisplay.innerText=passwordLength;
}

function handleCheckBoxChange(){
    checkCount =0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
        {
              checkCount++;
            handleSlider();    
        }
    })

    // special condition
    if(passwordLength<checkCount)
        passwordLength=checkCount;
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange)
})

// set indicator color
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// get random integer
function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}


function generateRandomNumber(){
    return getRndInteger(0,9); 
}

function generateLowercase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbols(){
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasSym=false;
    let hasNum=true;

    if(uppercaseCheck.checked) hasUpper= true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numberCheck.checked) hasNum=true;
    if(symbolCheck.checked) hasSym=true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
      } 
      else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6 ) {
        setIndicator("#ff0");
      } 
      else {
        setIndicator("#f00");
      }
     
}

 async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText='copied';
    }
    catch(e)
    {
        copyMsg.innerText="failed";
    }
   copyMsg.classList.add("active");
   setTimeout( ()=>{
    copyMsg.classList.remove("active");
   },2000);
}


inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

cpyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
        copyContent();  
})

function shufflePassword(array){
    // Fisher Yets Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }

    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function generatePassword(){
    if(checkCount<=0)
        return;

        if(passwordLength < checkCount){
            passwordLength=checkCount;
            handleSlider();
        }

        password="";

        let funcArr=[];


        if(uppercaseCheck.checked)
        {
            funcArr.push(generateUppercase);
        }

        if(lowercaseCheck.checked){
            funcArr.push(generateLowercase);
        }

        if(numberCheck.checked){
            funcArr.push(generateRandomNumber);
        }

        if(symbolCheck.checked){
            funcArr.push(generateSymbols);
        }

        


        for(let i=0;i<funcArr.length;i++)
        {
            password+=funcArr[i]();
        }

        for(let i=0;i<passwordLength-funcArr.length;i++){
            let randIndex=getRndInteger(0,funcArr.length);
            password+=funcArr[randIndex]();
        }

        password=shufflePassword(Array.from(password) );

        passwordDisplay.value=password;

        calcStrength();
};


